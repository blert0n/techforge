import type { RouteHandler } from "@hono/zod-openapi";
import { count, desc, eq, lte, sql } from "drizzle-orm";

import { db } from "../../db/client";
import { order, product, user } from "../../db/schema";
import type { getAdminDashboardRoute } from "./dashboard.routes";

export const getAdminDashboard: RouteHandler<
  typeof getAdminDashboardRoute
> = async (c) => {
  const [revenue, totalOrders, activeCustomers, lowStockItems, recentOrders] =
    await Promise.all([
      db
        .select({
          total: sql<string>`coalesce(sum(case when ${order.paymentStatus} = 'paid' then ${order.total} else 0 end), 0)`,
        })
        .from(order),
      db.select({ total: count() }).from(order),
      db.select({ total: count() }).from(user).where(eq(user.role, "user")),
      db.select({ total: count() }).from(product).where(lte(product.stock, 5)),
      db
        .select({
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: user.name,
          status: order.status,
          currency: order.currency,
          total: order.total,
          placedAt: order.placedAt,
        })
        .from(order)
        .innerJoin(user, eq(order.userId, user.id))
        .orderBy(desc(order.placedAt))
        .limit(4),
    ]);

  return c.json(
    {
      metrics: {
        totalRevenue: revenue[0]?.total ?? "0",
        totalOrders: totalOrders[0]?.total ?? 0,
        activeCustomers: activeCustomers[0]?.total ?? 0,
        lowStockItems: lowStockItems[0]?.total ?? 0,
      },
      recentOrders: recentOrders.map((order) => ({
        ...order,
        status: order.status as
          "pending" | "processing" | "shipped" | "delivered" | "cancelled",
        placedAt: order.placedAt.toISOString(),
      })),
    },
    200,
  );
};
