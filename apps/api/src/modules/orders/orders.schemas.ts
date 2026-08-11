import { z } from "@hono/zod-openapi";

export const orderStatusSchema = z.enum([
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const myOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(200).optional(),
  status: orderStatusSchema.optional(),
  userId: z.string().min(1).optional(),
});

export const adminOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: orderStatusSchema.optional(),
  paymentStatus: z.string().trim().min(1).max(50).optional(),
  orderNumber: z.string().trim().max(100).optional(),
  userId: z.string().trim().min(1).optional(),
});
export const updateOrderStatusSchema = z.object({ status: orderStatusSchema });

export const orderParamsSchema = z.object({
  orderNumber: z
    .string()
    .min(1)
    .openapi({
      param: { name: "orderNumber", in: "path" },
      example: "TF-1786377017595-EAA9B9",
    }),
});

export const orderListItemSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  status: orderStatusSchema,
  paymentStatus: z.string(),
  currency: z.string(),
  total: z.string(),
  itemCount: z.number().int().positive(),
  placedAt: z.string().datetime(),
  items: z.array(
    z.object({
      id: z.string(),
      productId: z.number().int().nullable(),
      productName: z.string(),
      productSlug: z.string(),
      imageUrl: z.string().nullable(),
      quantity: z.number().int().positive(),
      lineTotal: z.string(),
    }),
  ),
});

export const orderStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  pending: z.number().int().nonnegative(),
  processing: z.number().int().nonnegative(),
  shipped: z.number().int().nonnegative(),
  delivered: z.number().int().nonnegative(),
  cancelled: z.number().int().nonnegative(),
});

export const myOrdersSchema = z.object({
  items: z.array(orderListItemSchema),
  pagination: z.object({
    page: z.number().int(),
    pageSize: z.number().int(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
  stats: orderStatsSchema,
});

export const orderDetailsSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  status: orderStatusSchema,
  paymentStatus: z.string(),
  currency: z.string(),
  subtotal: z.string(),
  shippingTotal: z.string(),
  taxTotal: z.string(),
  discountTotal: z.string(),
  total: z.string(),
  placedAt: z.string().datetime(),
  shippingAddress: z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    line1: z.string(),
    line2: z.string().nullable(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  items: z.array(
    z.object({
      id: z.string(),
      productId: z.number().int().nullable(),
      productName: z.string(),
      productSlug: z.string(),
      sku: z.string(),
      imageUrl: z.string().nullable(),
      unitPrice: z.string(),
      quantity: z.number().int().positive(),
      lineTotal: z.string(),
    }),
  ),
});

export const ordersMessageSchema = z.object({ message: z.string() });
