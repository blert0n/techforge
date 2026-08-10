import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { requireAuth } from "../../middleware/auth.middleware";
import { createCheckoutSession } from "./payments.controller";
import {
  checkoutSessionSchema,
  createCheckoutSessionSchema,
  paymentMessageSchema,
} from "./payments.schemas";

export const createCheckoutSessionRoute = createRoute({
  method: "post",
  path: "/checkout-session",
  tags: ["Payments"],
  middleware: requireAuth,
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: { "application/json": { schema: createCheckoutSessionSchema } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: checkoutSessionSchema } },
      description:
        "A reusable Stripe Checkout session for this checkout attempt",
    },
    400: {
      content: { "application/json": { schema: paymentMessageSchema } },
      description: "The cart cannot be checked out",
    },
    401: {
      content: { "application/json": { schema: paymentMessageSchema } },
      description: "Authentication is required",
    },
  },
});

export const paymentsRouter = new OpenAPIHono();
paymentsRouter.openapi(createCheckoutSessionRoute, createCheckoutSession);
