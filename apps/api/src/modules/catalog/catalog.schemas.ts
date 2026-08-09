import { z } from "@hono/zod-openapi";

export const specificationFieldSchema = z.union([
  z.string().min(1),
  z
    .object({
      key: z.string().min(1),
      label: z.string().min(1),
      group: z.string().min(1).optional(),
      unit: z.string().min(1).optional(),
      format: z.enum(["text", "number", "boolean"]),
      order: z.number().int().nonnegative().optional(),
    })
    .passthrough(),
]);

export const specificationTemplateSchema = z.object({
  id: z.number().int(),
  categoryId: z.number().int(),
  fields: z.array(specificationFieldSchema),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const categoryWithTemplateSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
  attributePrefix: z.string(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  parentId: z.number().int().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  specificationTemplate: specificationTemplateSchema.nullable(),
});

export const brandSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createBrandSchema = z.object({
  name: z.string().trim().min(1).max(120),
});
export const updateBrandSchema = createBrandSchema;

export const updateCatalogCategorySchema = z.object({
  name: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1).max(120),
  attributePrefix: z.string().trim().regex(/^[a-z][a-z0-9_]*$/),
  description: z.string().trim().nullable(),
});

export const createCatalogCategorySchema = updateCatalogCategorySchema;

export const categoryParamsSchema = z.object({
  id: z.coerce.number().int().positive().openapi({
    param: { name: "id", in: "path" },
    example: 1,
  }),
});

export const updateSpecificationTemplateSchema = z.object({
  fields: z.array(specificationFieldSchema),
});

export const messageSchema = z.object({ message: z.string() });
