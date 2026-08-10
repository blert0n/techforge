import { z } from "@hono/zod-openapi";

import { storefrontProductSchema } from "../products/products.schemas";

export const wishlistProductSchema = z.object({
  productId: z.number().int().positive(),
});

export const wishlistToggleResultSchema = z.object({
  productId: z.number().int().positive(),
  isWishlisted: z.boolean(),
});

export const wishlistMessageSchema = z.object({ message: z.string() });

export const wishlistListQuerySchema = z.object({
  categoryId: z.coerce.number().int().positive().optional(),
  sort: z
    .enum([
      "Date Added",
      "Price: Low to High",
      "Price: High to Low",
      "Name A–Z",
    ])
    .default("Date Added"),
});

export const wishlistCategorySchema = z.object({
  id: z.number().int(),
  name: z.string(),
});

export const wishlistSchema = z.object({
  items: z.array(storefrontProductSchema),
  categories: z.array(wishlistCategorySchema),
});
