import { z } from "@hono/zod-openapi";

export const cartItemSchema = z.object({
  id: z.string(),
  productId: z.number().int(),
  name: z.string(),
  slug: z.string(),
  brand: z.string(),
  imageUrl: z.string().nullable(),
  unitPrice: z.string(),
  quantity: z.number().int().positive(),
  stock: z.number().int().nonnegative(),
  lineTotal: z.string(),
});

export const cartSchema = z.object({
  id: z.string(),
  owner: z.enum(["guest", "user"]),
  items: z.array(cartItemSchema),
  itemCount: z.number().int().nonnegative(),
  subtotal: z.string(),
  updatedAt: z.string().datetime(),
});

export const addCartItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive().max(99).default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive().max(99),
});

export const cartItemParamsSchema = z.object({
  productId: z.coerce.number().int().positive().openapi({
    param: { name: "productId", in: "path" },
    example: 1,
  }),
});

export const cartMessageSchema = z.object({ message: z.string() });
