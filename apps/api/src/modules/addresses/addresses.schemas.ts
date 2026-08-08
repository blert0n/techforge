import { z } from "@hono/zod-openapi";

export const addressTypeSchema = z.enum(["Home", "Work", "Other"]);

export const addressSchema = z.object({
  id: z.string(),
  type: addressTypeSchema,
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  line1: z.string(),
  line2: z.string().optional(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
  isDefault: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createAddressSchema = addressSchema
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    line2: z.string().optional(),
    isDefault: z.boolean().optional().default(false),
  });

export const updateAddressSchema = createAddressSchema.partial();

export const addressParamsSchema = z.object({
  id: z.string().openapi({
    param: { name: "id", in: "path" },
    example: "f4ab3147-5cdf-4f32-9d9d-213d9cf9ca6e",
  }),
});

export const messageSchema = z.object({ message: z.string() });
