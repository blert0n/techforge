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
  specifications: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean()]),
  ),
  attributeKeys: z.array(z.string()),
});

export const storefrontProductListQuerySchema = z.object({
  category: z.string().trim().min(1).optional(),
  search: z.string().trim().max(200).optional(),
  categoryIds: z.string().trim().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  minRating: z.coerce.number().min(1).max(5).optional(),
  specifications: z.string().trim().optional(),
  sort: z
    .enum(["featured", "price-ascending", "price-descending"])
    .default("featured"),
});

export const storefrontProductSchema = z.object({
  id: z.number().int(),
  slug: z.string(),
  name: z.string(),
  brand: z.string(),
  categoryId: z.number().int(),
  price: z.number(),
  discountPrice: z.number().nullable(),
  stock: z.number().int().nonnegative(),
  imageUrl: z.string().nullable(),
  imageAltText: z.string().nullable(),
  specifications: z.array(z.string()),
  specificationValues: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean()]),
  ),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
});

export const storefrontProductListSchema = z.object({
  category: z
    .object({
      id: z.number().int(),
      name: z.string(),
      slug: z.string(),
      description: z.string().nullable(),
      parents: z.array(z.object({ name: z.string(), slug: z.string() })),
      children: z.array(
        z.object({
          id: z.number().int(),
          name: z.string(),
          slug: z.string(),
          categoryIds: z.array(z.number().int()),
        }),
      ),
    })
    .nullable(),
  items: z.array(storefrontProductSchema),
  specificationFilters: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      unit: z.string().nullable(),
      format: z.enum(["text", "number", "boolean"]),
      options: z.array(z.object({ value: z.string(), label: z.string() })),
    }),
  ),
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

export const adminProductParamsSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive()
    .openapi({
      param: { name: "id", in: "path" },
      example: 1,
    }),
});

export const productSlugParamsSchema = z.object({
  slug: z.string().min(1),
});

export const storefrontProductDetailSchema = storefrontProductSchema.extend({
  description: z.string(),
  category: z.object({
    id: z.number().int(),
    name: z.string(),
    slug: z.string(),
    specificationTemplate: z
      .object({
        fields: z.array(
          z.union([
            z.string(),
            z.object({
              key: z.string(),
              label: z.string(),
              unit: z.string().optional(),
              group: z.string().optional(),
              order: z.number().int().optional(),
              format: z.enum(["text", "number", "boolean"]),
            }),
          ]),
        ),
      })
      .nullable(),
  }),
  images: z.array(
    z.object({ url: z.string(), altText: z.string().nullable() }),
  ),
});

export const editableProductSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
  sku: z.string(),
  brandId: z.number().int(),
  categoryId: z.number().int(),
  description: z.string(),
  price: z.number(),
  discountPrice: z.number().nullable(),
  stock: z.number().int().nonnegative(),
  status: z.enum(["draft", "active"]),
  images: z.array(z.object({ url: z.string(), altText: z.string() })),
  specifications: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean()]),
  ),
  attributeKeys: z.array(z.string()),
});

export const productMediaUrlSchema = z.object({ sourceUrl: z.string().url() });
export const productMediaUploadSchema = z.object({ file: z.any() });
export const productMediaResponseSchema = z.object({ url: z.string().url() });

export const messageSchema = z.object({ message: z.string() });
