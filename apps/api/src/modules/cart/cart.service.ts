import { createHash, randomUUID } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";

import { db } from "../../db/client";
import { cart, cartItem, product } from "../../db/schema/index";

export function hashGuestCartToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createGuestCartToken() {
  return randomUUID();
}

export function isGuestCartToken(value: string | null | undefined): value is string {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
}

export async function getOrCreateUserCart(userId: string) {
  const existing = await db.query.cart.findFirst({ where: eq(cart.userId, userId) });
  if (existing) return existing;

  await db.insert(cart).values({ id: randomUUID(), userId }).onConflictDoNothing();
  const created = await db.query.cart.findFirst({ where: eq(cart.userId, userId) });
  if (!created) throw new Error("Unable to create user cart");
  return created;
}

export async function getOrCreateGuestCart(token: string) {
  const guestTokenHash = hashGuestCartToken(token);
  const existing = await db.query.cart.findFirst({
    where: eq(cart.guestTokenHash, guestTokenHash),
  });
  if (existing) return existing;

  await db
    .insert(cart)
    .values({ id: randomUUID(), guestTokenHash })
    .onConflictDoNothing();
  const created = await db.query.cart.findFirst({
    where: eq(cart.guestTokenHash, guestTokenHash),
  });
  if (!created) throw new Error("Unable to create guest cart");
  return created;
}

export async function mergeGuestCartIntoUser(token: string, userId: string) {
  const guestTokenHash = hashGuestCartToken(token);

  return db.transaction(async (tx) => {
    const guest = await tx.query.cart.findFirst({
      where: eq(cart.guestTokenHash, guestTokenHash),
    });
    if (!guest) return false;

    let userCart = await tx.query.cart.findFirst({ where: eq(cart.userId, userId) });
    if (!userCart) {
      const [claimed] = await tx
        .update(cart)
        .set({ userId, guestTokenHash: null, updatedAt: new Date() })
        .where(and(eq(cart.id, guest.id), eq(cart.guestTokenHash, guestTokenHash)))
        .returning();
      if (claimed) return true;

      userCart = await tx.query.cart.findFirst({ where: eq(cart.userId, userId) });
      if (!userCart) throw new Error("Unable to claim guest cart");
    }

    const guestItems = await tx.select().from(cartItem).where(eq(cartItem.cartId, guest.id));
    for (const item of guestItems) {
      const [selectedProduct] = await tx
        .select({ stock: product.stock })
        .from(product)
        .where(eq(product.id, item.productId))
        .limit(1);
      if (!selectedProduct || selectedProduct.stock <= 0) continue;

      await tx
        .insert(cartItem)
        .values({
          id: randomUUID(),
          cartId: userCart.id,
          productId: item.productId,
          quantity: Math.min(item.quantity, selectedProduct.stock, 99),
        })
        .onConflictDoUpdate({
          target: [cartItem.cartId, cartItem.productId],
          set: {
            quantity: sql`LEAST(${cartItem.quantity} + EXCLUDED.quantity, 99, COALESCE((SELECT ${product.stock} FROM ${product} WHERE ${product.id} = EXCLUDED.product_id), ${cartItem.quantity} + EXCLUDED.quantity))`,
            updatedAt: new Date(),
          },
        });
    }

    await tx.delete(cart).where(eq(cart.id, guest.id));
    await tx.update(cart).set({ updatedAt: new Date() }).where(eq(cart.id, userCart.id));
    return true;
  });
}

export async function getCartDetails(cartId: string) {
  return db.query.cart.findFirst({
    where: eq(cart.id, cartId),
    with: {
      items: {
        orderBy: (item, { asc }) => [asc(item.createdAt)],
        with: {
          product: {
            with: {
              brand: true,
              images: { orderBy: (image, { asc }) => [asc(image.position)] },
            },
          },
        },
      },
    },
  });
}
