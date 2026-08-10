import { z } from "@hono/zod-openapi";

export const checkoutAddressSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  line1: z.string().trim().min(1),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1),
  state: z.string().trim().min(1),
  postalCode: z.string().trim().min(1),
  country: z.string().trim().min(2),
});

export const createCheckoutSessionSchema = z.object({
  checkoutKey: z.string().uuid(),
  shippingAddress: checkoutAddressSchema,
});

export const checkoutSessionSchema = z.object({
  orderId: z.string(),
  checkoutUrl: z.string().url(),
});

export const paymentMessageSchema = z.object({ message: z.string() });
