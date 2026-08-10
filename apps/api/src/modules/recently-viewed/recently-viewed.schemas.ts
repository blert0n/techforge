import { z } from "@hono/zod-openapi";
import { storefrontProductSchema } from "../products/products.schemas";

export const recordRecentlyViewedProductSchema = z.object({
  productId: z.number().int().positive(),
});

export const recentlyViewedProductsSchema = z.object({
  owner: z.enum(["guest", "user"]),
  items: z.array(storefrontProductSchema),
});
