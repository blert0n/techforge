import { z } from "@hono/zod-openapi";

import { orderStatusSchema } from "../orders/orders.schemas";

export const dashboardOrderSchema = z.object({
  id: z.string(),
  orderNumber: z.string(),
  customerName: z.string(),
  status: orderStatusSchema,
  currency: z.string(),
  total: z.string(),
  placedAt: z.string().datetime(),
});

export const adminDashboardSchema = z.object({
  metrics: z.object({
    totalRevenue: z.string(),
    totalOrders: z.number().int().nonnegative(),
    activeCustomers: z.number().int().nonnegative(),
    lowStockItems: z.number().int().nonnegative(),
  }),
  recentOrders: z.array(dashboardOrderSchema),
});
