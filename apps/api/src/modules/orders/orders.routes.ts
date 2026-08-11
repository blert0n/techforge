import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import type { AuthVariables } from "../../middleware/auth.middleware";
import { requireAuth, requireRole } from "../../middleware/auth.middleware";
import {
  getAdminOrders,
  getMyOrder,
  getMyOrders,
  updateOrderStatus,
} from "./orders.controller";
import {
  myOrdersQuerySchema,
  adminOrdersQuerySchema,
  myOrdersSchema,
  orderDetailsSchema,
  orderParamsSchema,
  ordersMessageSchema,
  updateOrderStatusSchema,
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

export const getAdminOrdersRoute = createRoute({
  method: "get",
  path: "/admin",
  tags: ["Orders"],
  middleware: requireRole("admin"),
  request: { query: adminOrdersQuerySchema },
  responses: {
    200: {
      content: { "application/json": { schema: myOrdersSchema } },
      description: "All orders for administration",
    },
  },
});
export const updateOrderStatusRoute = createRoute({
  method: "patch",
  path: "/admin/{orderNumber}/status",
  tags: ["Orders"],
  middleware: requireRole("admin"),
  request: {
    params: orderParamsSchema,
    body: {
      content: { "application/json": { schema: updateOrderStatusSchema } },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: ordersMessageSchema } },
      description: "Order status updated",
    },
    404: {
      content: { "application/json": { schema: ordersMessageSchema } },
      description: "Order not found",
    },
  },
});

export const ordersRouter = new OpenAPIHono<{ Variables: AuthVariables }>();
ordersRouter.openapi(getMyOrdersRoute, getMyOrders);
ordersRouter.openapi(getAdminOrdersRoute, getAdminOrders);
ordersRouter.openapi(updateOrderStatusRoute, updateOrderStatus);
ordersRouter.openapi(getMyOrderRoute, getMyOrder);
