import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "./cart.controller";
import {
  addCartItemSchema,
  cartItemParamsSchema,
  cartMessageSchema,
  cartSchema,
  updateCartItemSchema,
} from "./cart.schemas";

const cartResponse = {
  content: { "application/json": { schema: cartSchema } },
  description: "The current guest or authenticated user's cart",
};
const notFoundResponse = {
  content: { "application/json": { schema: cartMessageSchema } },
  description: "Product or cart item not found",
};
const conflictResponse = {
  content: { "application/json": { schema: cartMessageSchema } },
  description: "Requested quantity is unavailable",
};

export const getCartRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Cart"],
  responses: { 200: cartResponse },
});

export const addCartItemRoute = createRoute({
  method: "post",
  path: "/items",
  tags: ["Cart"],
  request: { body: { content: { "application/json": { schema: addCartItemSchema } } } },
  responses: { 200: cartResponse, 404: notFoundResponse, 409: conflictResponse },
});

export const updateCartItemRoute = createRoute({
  method: "patch",
  path: "/items/{productId}",
  tags: ["Cart"],
  request: {
    params: cartItemParamsSchema,
    body: { content: { "application/json": { schema: updateCartItemSchema } } },
  },
  responses: { 200: cartResponse, 404: notFoundResponse, 409: conflictResponse },
});

export const removeCartItemRoute = createRoute({
  method: "delete",
  path: "/items/{productId}",
  tags: ["Cart"],
  request: { params: cartItemParamsSchema },
  responses: { 200: cartResponse, 404: notFoundResponse },
});

export const clearCartRoute = createRoute({
  method: "delete",
  path: "/",
  tags: ["Cart"],
  responses: { 200: cartResponse },
});

export const cartRouter = new OpenAPIHono();
cartRouter.openapi(getCartRoute, getCart);
cartRouter.openapi(addCartItemRoute, addCartItem);
cartRouter.openapi(updateCartItemRoute, updateCartItem);
cartRouter.openapi(removeCartItemRoute, removeCartItem);
cartRouter.openapi(clearCartRoute, clearCart);
