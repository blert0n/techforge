import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import type { AuthVariables } from "../../middleware/auth.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { getMyOrder, getMyOrders } from "./orders.controller";
import {
  myOrdersQuerySchema,
  myOrdersSchema,
  orderDetailsSchema,
  orderParamsSchema,
  ordersMessageSchema,
} from "./orders.schemas";

export const getMyOrdersRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Orders"],
  middleware: requireAuth,
  request: { query: myOrdersQuerySchema },
  responses: {
    200: {
      content: { "application/json": { schema: myOrdersSchema } },
      description: "The current user's orders",
    },
    401: {
      content: { "application/json": { schema: ordersMessageSchema } },
      description: "Authentication is required",
    },
    403: {
      content: { "application/json": { schema: ordersMessageSchema } },
      description:
        "Filtering another user's orders requires administrator access",
    },
  },
});

export const getMyOrderRoute = createRoute({
  method: "get",
  path: "/{orderNumber}",
  tags: ["Orders"],
  middleware: requireAuth,
  request: { params: orderParamsSchema },
  responses: {
    200: {
      content: { "application/json": { schema: orderDetailsSchema } },
      description: "An order the current user may access",
    },
    401: {
      content: { "application/json": { schema: ordersMessageSchema } },
      description: "Authentication is required",
    },
    404: {
      content: { "application/json": { schema: ordersMessageSchema } },
      description: "Order not found",
    },
  },
});

export const ordersRouter = new OpenAPIHono<{ Variables: AuthVariables }>();
ordersRouter.openapi(getMyOrdersRoute, getMyOrders);
ordersRouter.openapi(getMyOrderRoute, getMyOrder);
