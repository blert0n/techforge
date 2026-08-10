import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import {
  getRecentlyViewedProducts,
  recordRecentlyViewedProduct,
} from "./recently-viewed.controller";
import {
  recentlyViewedProductsSchema,
  recordRecentlyViewedProductSchema,
} from "./recently-viewed.schemas";

export const getRecentlyViewedProductsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Recently Viewed"],
  responses: {
    200: {
      content: { "application/json": { schema: recentlyViewedProductsSchema } },
      description: "The current account or browser's recently viewed products",
    },
  },
});

export const recordRecentlyViewedProductRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Recently Viewed"],
  request: {
    body: {
      content: {
        "application/json": { schema: recordRecentlyViewedProductSchema },
      },
    },
  },
  responses: {
    204: { description: "Product recorded as recently viewed" },
  },
});

export const recentlyViewedRouter = new OpenAPIHono();
recentlyViewedRouter.openapi(
  getRecentlyViewedProductsRoute,
  getRecentlyViewedProducts,
);
recentlyViewedRouter.openapi(
  recordRecentlyViewedProductRoute,
  recordRecentlyViewedProduct,
);
