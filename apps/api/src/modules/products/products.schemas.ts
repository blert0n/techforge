import { z } from "@hono/zod-openapi";

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  category: z.string(),
});

export const createProductSchema = productSchema.omit({ id: true });

export const createCatalogProductSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().min(2),
  brandId: z.number().int().positive(),
  categoryId: z.number().int().positive(),
  description: z.string().min(20),
  price: z.number().positive(),
  discountPrice: z.number().positive().nullable().optional(),
  stock: z.number().int().min(0),
  status: z.enum(["draft", "active"]),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        altText: z.string().trim().max(250).optional(),
      }),
    )
    .max(12),
  specifications: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  attributeKeys: z.array(z.string()),
});

export const adminProductListItemSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
  sku: z.string(),
  brand: z.object({
    id: z.number().int(),
    name: z.string(),
  }),
  category: z.object({
    id: z.number().int(),
    name: z.string(),
  }),
  price: z.number(),
  discountPrice: z.number().nullable(),
  stock: z.number().int(),
  status: z.string(),
  imageUrl: z.string().nullable(),
  imageAltText: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const adminProductListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(12),
  search: z.string().trim().max(200).optional(),
  status: z.enum(["active", "draft"]).optional(),
  categoryId: z.coerce.number().int().positive().optional(),
});

export const adminProductListSchema = z.object({
  items: z.array(adminProductListItemSchema),
  pagination: z.object({
    page: z.number().int(),
    pageSize: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
  }),
  summary: z.object({
    total: z.number().int(),
    active: z.number().int(),
    drafts: z.number().int(),
    lowStock: z.number().int(),
  }),
});

export const createdCatalogProductSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
  sku: z.string(),
  brandId: z.number().int(),
  categoryId: z.number().int(),
  status: z.string(),
});

export const updateProductSchema = createProductSchema.partial();

export const productParamsSchema = z.object({
  id: z.string().openapi({
    param: { name: "id", in: "path" },
    example: "1",
  }),
});

export const messageSchema = z.object({ message: z.string() });
