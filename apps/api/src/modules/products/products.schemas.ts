import { z } from "@hono/zod-openapi";

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  category: z.string(),
});

export const createProductSchema = productSchema.omit({ id: true });

export const updateProductSchema = createProductSchema.partial();

export const productParamsSchema = z.object({
  id: z.string().openapi({
    param: { name: "id", in: "path" },
    example: "1",
  }),
});

export const messageSchema = z.object({ message: z.string() });
