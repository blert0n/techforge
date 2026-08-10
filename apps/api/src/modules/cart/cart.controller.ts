import { randomUUID } from "node:crypto";
import type { RouteHandler } from "@hono/zod-openapi";
import { and, eq } from "drizzle-orm";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

import { db } from "../../db/client";
import { cartItem, product } from "../../db/schema/index";
import { auth } from "../../lib/auth";
import { createGuestToken, isGuestToken } from "../../lib/guest-token";
import { GUEST_CART_COOKIE, guestCartCookieOptions } from "./cart.constants";
import {
  getCartDetails,
  getOrCreateGuestCart,
  getOrCreateUserCart,
  mergeGuestCartIntoUser,
} from "./cart.service";
import type {
  addCartItemRoute,
  clearCartRoute,
  getCartRoute,
  removeCartItemRoute,
  updateCartItemRoute,
} from "./cart.routes";

async function resolveCart(
  c: Parameters<RouteHandler<typeof getCartRoute>>[0],
) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  const cookieToken = getCookie(c, GUEST_CART_COOKIE);

  if (session) {
    if (isGuestToken(cookieToken)) {
      await mergeGuestCartIntoUser(cookieToken, session.user.id);
      deleteCookie(c, GUEST_CART_COOKIE, { path: "/" });
    }
    return {
      record: await getOrCreateUserCart(session.user.id),
      owner: "user" as const,
    };
  }

  const guestToken = isGuestToken(cookieToken)
    ? cookieToken
    : createGuestToken();
  if (guestToken !== cookieToken) {
    setCookie(c, GUEST_CART_COOKIE, guestToken, guestCartCookieOptions);
  }
  return {
    record: await getOrCreateGuestCart(guestToken),
    owner: "guest" as const,
  };
}

async function serializeCart(cartId: string, owner: "guest" | "user") {
  const details = await getCartDetails(cartId);
  if (!details)
    throw new Error("Cart disappeared while processing the request");

  const items = details.items.map((item) => {
    const unitPrice = Number(item.product.discountPrice ?? item.product.price);
    return {
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      slug: item.product.slug,
      brand: item.product.brand.name,
      imageUrl: item.product.images[0]?.url ?? null,
      unitPrice: unitPrice.toFixed(2),
      quantity: item.quantity,
      stock: item.product.stock,
      lineTotal: (unitPrice * item.quantity).toFixed(2),
    };
  });

  return {
    id: details.id,
    owner,
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items
      .reduce((total, item) => total + Number(item.lineTotal), 0)
      .toFixed(2),
    updatedAt: details.updatedAt.toISOString(),
  };
}

export const getCart: RouteHandler<typeof getCartRoute> = async (c) => {
  const resolved = await resolveCart(c);
  return c.json(await serializeCart(resolved.record.id, resolved.owner), 200);
};

export const addCartItem: RouteHandler<typeof addCartItemRoute> = async (c) => {
  const resolved = await resolveCart(
    c as Parameters<RouteHandler<typeof getCartRoute>>[0],
  );
  const body = c.req.valid("json");
  const [selectedProduct] = await db
    .select({ id: product.id, stock: product.stock, status: product.status })
    .from(product)
    .where(eq(product.id, body.productId))
    .limit(1);

  if (!selectedProduct || selectedProduct.status !== "active") {
    return c.json({ message: "Product is not available" }, 404);
  }

  const existing = await db.query.cartItem.findFirst({
    where: and(
      eq(cartItem.cartId, resolved.record.id),
      eq(cartItem.productId, body.productId),
    ),
  });
  const nextQuantity = (existing?.quantity ?? 0) + body.quantity;
  if (nextQuantity > Math.min(selectedProduct.stock, 99)) {
    return c.json(
      { message: "Requested quantity exceeds available stock" },
      409,
    );
  }

  await db
    .insert(cartItem)
    .values({
      id: randomUUID(),
      cartId: resolved.record.id,
      productId: body.productId,
      quantity: body.quantity,
    })
    .onConflictDoUpdate({
      target: [cartItem.cartId, cartItem.productId],
      set: { quantity: nextQuantity, updatedAt: new Date() },
    });

  return c.json(await serializeCart(resolved.record.id, resolved.owner), 200);
};

export const updateCartItem: RouteHandler<typeof updateCartItemRoute> = async (
  c,
) => {
  const resolved = await resolveCart(
    c as Parameters<RouteHandler<typeof getCartRoute>>[0],
  );
  const { productId } = c.req.valid("param");
  const { quantity } = c.req.valid("json");
  const [selectedProduct] = await db
    .select({ stock: product.stock })
    .from(product)
    .where(eq(product.id, productId))
    .limit(1);

  if (!selectedProduct) return c.json({ message: "Product not found" }, 404);
  if (quantity > selectedProduct.stock) {
    return c.json(
      { message: "Requested quantity exceeds available stock" },
      409,
    );
  }

  const [updated] = await db
    .update(cartItem)
    .set({ quantity, updatedAt: new Date() })
    .where(
      and(
        eq(cartItem.cartId, resolved.record.id),
        eq(cartItem.productId, productId),
      ),
    )
    .returning({ id: cartItem.id });
  if (!updated) return c.json({ message: "Cart item not found" }, 404);

  return c.json(await serializeCart(resolved.record.id, resolved.owner), 200);
};

export const removeCartItem: RouteHandler<typeof removeCartItemRoute> = async (
  c,
) => {
  const resolved = await resolveCart(
    c as Parameters<RouteHandler<typeof getCartRoute>>[0],
  );
  const { productId } = c.req.valid("param");
  const [deleted] = await db
    .delete(cartItem)
    .where(
      and(
        eq(cartItem.cartId, resolved.record.id),
        eq(cartItem.productId, productId),
      ),
    )
    .returning({ id: cartItem.id });
  if (!deleted) return c.json({ message: "Cart item not found" }, 404);

  return c.json(await serializeCart(resolved.record.id, resolved.owner), 200);
};

export const clearCart: RouteHandler<typeof clearCartRoute> = async (c) => {
  const resolved = await resolveCart(
    c as Parameters<RouteHandler<typeof getCartRoute>>[0],
  );
  await db.delete(cartItem).where(eq(cartItem.cartId, resolved.record.id));
  return c.json(await serializeCart(resolved.record.id, resolved.owner), 200);
};
