import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import type { AuthVariables } from "../../middleware/auth.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { getWishlist, toggleWishlistProduct } from "./wishlist.controller";
import {
  wishlistMessageSchema,
  wishlistListQuerySchema,
  wishlistProductSchema,
  wishlistSchema,
  wishlistToggleResultSchema,
} from "./wishlist.schemas";

const unauthorizedResponse = {
  content: { "application/json": { schema: wishlistMessageSchema } },
  description: "Authentication is required",
};

export const getWishlistRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Wishlist"],
  middleware: requireAuth,
  request: { query: wishlistListQuerySchema },
  responses: {
    200: {
      content: { "application/json": { schema: wishlistSchema } },
      description: "The current user's wishlist",
    },
    401: unauthorizedResponse,
  },
});

export const toggleWishlistProductRoute = createRoute({
  method: "post",
  path: "/toggle",
  tags: ["Wishlist"],
  middleware: requireAuth,
  request: {
    body: {
      content: { "application/json": { schema: wishlistProductSchema } },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": { schema: wishlistToggleResultSchema },
      },
      description: "Wishlist state updated",
    },
    401: unauthorizedResponse,
    404: {
      content: { "application/json": { schema: wishlistMessageSchema } },
      description: "Product is not available",
    },
  },
});

export const wishlistRouter = new OpenAPIHono<{ Variables: AuthVariables }>();
wishlistRouter.openapi(getWishlistRoute, getWishlist);
wishlistRouter.openapi(toggleWishlistProductRoute, toggleWishlistProduct);
