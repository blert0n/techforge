import { randomUUID } from "node:crypto";
import type { RouteHandler } from "@hono/zod-openapi";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { env } from "../../config/env";
import { db } from "../../db/client";
import { order, orderItem } from "../../db/schema";
import { getCartDetails, getOrCreateUserCart } from "../cart/cart.service";
import type { createCheckoutSessionRoute } from "./payments.routes";

function stripeClient() {
  if (!env.STRIPE_SECRET_KEY) throw new Error("Stripe is not configured");
  return new Stripe(env.STRIPE_SECRET_KEY);
}

export const createCheckoutSession: RouteHandler<
  typeof createCheckoutSessionRoute
> = async (c) => {
  const { checkoutKey, shippingAddress } = c.req.valid("json");
  const userId = c.get("user").id;
  let existing = await db.query.order.findFirst({
    where: eq(order.checkoutKey, checkoutKey),
  });

  if (existing && existing.userId !== userId)
    return c.json({ message: "Invalid checkout attempt" }, 400);

  if (!existing) {
    const userCart = await getOrCreateUserCart(userId);
    const cart = await getCartDetails(userCart.id);
    if (!cart?.items.length)
      return c.json({ message: "Your cart is empty" }, 400);

    const items = cart.items.map((item) => {
      if (
        item.product.status !== "active" ||
        item.product.stock < item.quantity
      )
        throw new Error(`${item.product.name} is no longer available`);
      const unitPrice = Number(
        item.product.discountPrice ?? item.product.price,
      );
      return { item, unitPrice, lineTotal: unitPrice * item.quantity };
    });
    const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
    const taxTotal = subtotal * 0.07;
    const [created] = await db
      .insert(order)
      .values({
        id: randomUUID(),
        orderNumber: `TF-${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`,
        userId,
        cartId: userCart.id,
        checkoutKey,
        shippingAddress,
        paymentMethod: "stripe",
        subtotal: subtotal.toFixed(2),
        taxTotal: taxTotal.toFixed(2),
        total: (subtotal + taxTotal).toFixed(2),
      })
      .onConflictDoNothing({ target: order.checkoutKey })
      .returning();
    existing = created;
    if (created) {
      await db.insert(orderItem).values(
        items.map(({ item, unitPrice, lineTotal }) => ({
          id: randomUUID(),
          orderId: created.id,
          productId: item.productId,
          productName: item.product.name,
          productSlug: item.product.slug,
          sku: item.product.sku,
          imageUrl: item.product.images[0]?.url,
          unitPrice: unitPrice.toFixed(2),
          quantity: item.quantity,
          lineTotal: lineTotal.toFixed(2),
        })),
      );
    } else {
      existing = await db.query.order.findFirst({
        where: eq(order.checkoutKey, checkoutKey),
      });
    }
  }
  if (!existing) return c.json({ message: "Unable to create checkout" }, 400);

  const stripe = stripeClient();
  const lineItems = await db.query.orderItem.findMany({
    where: eq(orderItem.orderId, existing.id),
  });
  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      client_reference_id: existing.id,
      metadata: { orderId: existing.id },
      success_url: `${env.WEB_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.WEB_URL}/checkout`,
      line_items: lineItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(Number(item.unitPrice) * 100),
          product_data: { name: item.productName },
        },
      })),
    },
    { idempotencyKey: checkoutKey },
  );
  if (!session.url)
    return c.json({ message: "Unable to create checkout" }, 400);
  if (!existing.stripeCheckoutSessionId)
    await db
      .update(order)
      .set({ stripeCheckoutSessionId: session.id })
      .where(eq(order.id, existing.id));

  return c.json({ orderId: existing.id, checkoutUrl: session.url }, 200);
};
