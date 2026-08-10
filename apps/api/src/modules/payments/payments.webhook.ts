import Stripe from "stripe";
import { and, eq, gt, gte, lte, ne, sql } from "drizzle-orm";
import { env } from "../../config/env";
import { db } from "../../db/client";
import { cart, cartItem, order, orderItem, product } from "../../db/schema";

export async function handleStripeWebhook(request: Request) {
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET)
    return new Response("Stripe webhook is not configured", { status: 503 });
  const signature = request.headers.get("stripe-signature");
  if (!signature)
    return new Response("Missing Stripe signature", { status: 400 });
  let event: Stripe.Event;
  try {
    event = new Stripe(env.STRIPE_SECRET_KEY).webhooks.constructEvent(
      await request.text(),
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return new Response("Invalid Stripe signature", { status: 400 });
  }
  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId && session.payment_status === "paid") {
      await db.transaction(async (tx) => {
        const [settledOrder] = await tx
          .update(order)
          .set({
            status: "processing",
            paymentStatus: "paid",
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : null,
          })
          .where(and(eq(order.id, orderId), ne(order.paymentStatus, "paid")))
          .returning({ cartId: order.cartId });
        if (!settledOrder) return;

        const purchasedItems = await tx
          .select({
            productId: orderItem.productId,
            quantity: orderItem.quantity,
          })
          .from(orderItem)
          .where(eq(orderItem.orderId, orderId));

        for (const item of purchasedItems) {
          if (item.productId === null) continue;
          await tx
            .update(product)
            .set({
              stock: sql`${product.stock} - ${item.quantity}`,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(product.id, item.productId),
                gte(product.stock, item.quantity),
              ),
            );
        }

        if (!settledOrder.cartId) return;
        for (const item of purchasedItems) {
          if (item.productId === null) continue;
          await tx
            .delete(cartItem)
            .where(
              and(
                eq(cartItem.cartId, settledOrder.cartId),
                eq(cartItem.productId, item.productId),
                lte(cartItem.quantity, item.quantity),
              ),
            );
          await tx
            .update(cartItem)
            .set({
              quantity: sql`${cartItem.quantity} - ${item.quantity}`,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(cartItem.cartId, settledOrder.cartId),
                eq(cartItem.productId, item.productId),
                gt(cartItem.quantity, item.quantity),
              ),
            );
        }
        await tx
          .update(cart)
          .set({ updatedAt: new Date() })
          .where(eq(cart.id, settledOrder.cartId));
      });
    }
  }
  return new Response(null, { status: 200 });
}
