import { z } from "@hono/zod-openapi";

export const reviewParamsSchema = z.object({
  id: z
    .string()
    .uuid()
    .openapi({
      param: { name: "id", in: "path" },
      example: "f4ab3147-5cdf-4f32-9d9d-213d9cf9ca6e",
    }),
});

export const reviewListQuerySchema = z.object({
  productId: z.coerce.number().int().positive(),
});

export const myReviewListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  rating: z.coerce.number().int().min(1).max(5).optional(),
});

export const adminReviewListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  productId: z.coerce.number().int().positive().optional(),
});

export const createReviewSchema = z.object({
  productId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().min(3).max(120),
  body: z.string().trim().min(20).max(5_000),
});

export const updateReviewSchema = createReviewSchema
  .omit({ productId: true })
  .partial()
  .refine(
    (value) => Object.keys(value).length > 0,
    "Provide at least one field to update",
  );

export const reviewHelpfulnessSchema = z.object({
  vote: z.enum(["up", "down"]),
});

export const reviewSchema = z.object({
  id: z.string().uuid(),
  productId: z.number().int(),
  rating: z.number().int().min(1).max(5),
  title: z.string(),
  body: z.string(),
  helpfulUpvotes: z.number().int().nonnegative(),
  helpfulDownvotes: z.number().int().nonnegative(),
  product: z.object({
    id: z.number().int(),
    name: z.string(),
    category: z.string(),
  }),
  author: z.object({
    id: z.string(),
    name: z.string(),
    image: z.string().nullable(),
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const reviewMessageSchema = z.object({ message: z.string() });

export const myReviewsSchema = z.object({
  items: z.array(reviewSchema),
  pagination: z.object({
    page: z.number().int(),
    pageSize: z.number().int(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
  stats: z.object({
    total: z.number().int().nonnegative(),
    averageRating: z.number().nonnegative(),
    helpfulVotes: z.number().int().nonnegative(),
  }),
});

export const adminReviewsSchema = z.object({
  items: z.array(reviewSchema),
  pagination: z.object({
    page: z.number().int(),
    pageSize: z.number().int(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});

export const pendingReviewProductSchema = z.object({
  productId: z.number().int(),
  productName: z.string(),
  category: z.string(),
  orderNumber: z.string(),
  placedAt: z.string().datetime(),
});
