import type { RouteHandler } from "@hono/zod-openapi";
import { and, count, desc, eq, ilike, inArray, or } from "drizzle-orm";

import { db } from "../../db/client";
import { order, orderItem } from "../../db/schema";
import type {
  getAdminOrdersRoute,
  getMyOrderRoute,
  getMyOrdersRoute,
  updateOrderStatusRoute,
} from "./orders.routes";

export const getMyOrders: RouteHandler<typeof getMyOrdersRoute> = async (c) => {
  const user = c.get("user");
  const { page, pageSize, search, status, userId } = c.req.valid("query");
  if (userId && user.role !== "admin") {
    return c.json({ message: "Forbidden" }, 403);
  }

  const targetUserId = userId ?? user.id;
  const normalizedSearch = search?.trim();
  const conditions = [eq(order.userId, targetUserId)];

  if (status) conditions.push(eq(order.status, status));
  if (normalizedSearch) {
    const pattern = `%${normalizedSearch}%`;
    conditions.push(
      or(
        ilike(order.orderNumber, pattern),
        inArray(
          order.id,
          db
            .select({ orderId: orderItem.orderId })
            .from(orderItem)
            .where(ilike(orderItem.productName, pattern)),
        ),
      )!,
    );
  }

  const where = and(...conditions);
  const [records, [{ total }], statusCounts] = await Promise.all([
    db.query.order.findMany({
      where,
      orderBy: [desc(order.placedAt)],
      limit: pageSize,
      offset: (page - 1) * pageSize,
      with: { items: true },
    }),
    db.select({ total: count() }).from(order).where(where),
    db
      .select({ status: order.status, total: count() })
      .from(order)
      .where(eq(order.userId, targetUserId))
      .groupBy(order.status),
  ]);

  const stats = {
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };
  for (const record of statusCounts) {
    if (record.status in stats) {
      stats[record.status as keyof typeof stats] = record.total;
      stats.total += record.total;
    }
  }

  return c.json(
    {
      items: records.map((record) => ({
        id: record.id,
        orderNumber: record.orderNumber,
        status: record.status as keyof Omit<typeof stats, "total">,
        paymentStatus: record.paymentStatus,
        currency: record.currency,
        total: record.total,
        itemCount: record.items.reduce((sum, item) => sum + item.quantity, 0),
        placedAt: record.placedAt.toISOString(),
        items: record.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          productSlug: item.productSlug,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
        })),
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      stats,
    },
    200,
  );
};

export const getMyOrder: RouteHandler<typeof getMyOrderRoute> = async (c) => {
  const user = c.get("user");
  const { orderNumber } = c.req.valid("param");
  const record = await db.query.order.findFirst({
    where: and(
      eq(order.orderNumber, orderNumber),
      ...(user.role === "admin" ? [] : [eq(order.userId, user.id)]),
    ),
    with: { items: true },
  });

  if (!record) return c.json({ message: "Order not found" }, 404);

  return c.json(
    {
      id: record.id,
      orderNumber: record.orderNumber,
      status: record.status as
        "pending" | "processing" | "shipped" | "delivered" | "cancelled",
      paymentStatus: record.paymentStatus,
      currency: record.currency,
      subtotal: record.subtotal,
      shippingTotal: record.shippingTotal,
      taxTotal: record.taxTotal,
      discountTotal: record.discountTotal,
      total: record.total,
      placedAt: record.placedAt.toISOString(),
      shippingAddress: {
        ...record.shippingAddress,
        line2: record.shippingAddress.line2 ?? null,
      },
      items: record.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        sku: item.sku,
        imageUrl: item.imageUrl,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        lineTotal: item.lineTotal,
      })),
    },
    200,
  );
};

export const getAdminOrders: RouteHandler<typeof getAdminOrdersRoute> = async (
  c,
) => {
  const { page, pageSize, status, paymentStatus, orderNumber, userId } =
    c.req.valid("query");
  const where = and(
    ...(status ? [eq(order.status, status)] : []),
    ...(paymentStatus ? [eq(order.paymentStatus, paymentStatus)] : []),
    ...(orderNumber ? [ilike(order.orderNumber, `%${orderNumber}%`)] : []),
    ...(userId ? [eq(order.userId, userId)] : []),
  );
  const [records, [{ total }]] = await Promise.all([
    db.query.order.findMany({
      where,
      orderBy: [desc(order.placedAt)],
      limit: pageSize,
      offset: (page - 1) * pageSize,
      with: { items: true },
    }),
    db.select({ total: count() }).from(order).where(where),
  ]);
  return c.json(
    {
      items: records.map((record) => ({
        id: record.id,
        orderNumber: record.orderNumber,
        status: record.status as
          "pending" | "processing" | "shipped" | "delivered" | "cancelled",
        paymentStatus: record.paymentStatus,
        currency: record.currency,
        total: record.total,
        itemCount: record.items.reduce((sum, item) => sum + item.quantity, 0),
        placedAt: record.placedAt.toISOString(),
        items: record.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          productSlug: item.productSlug,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
        })),
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      stats: {
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      },
    },
    200,
  );
};

export const updateOrderStatus: RouteHandler<
  typeof updateOrderStatusRoute
> = async (c) => {
  const { orderNumber } = c.req.valid("param");
  const { status } = c.req.valid("json");
  const [updated] = await db
    .update(order)
    .set({ status })
    .where(eq(order.orderNumber, orderNumber))
    .returning();
  if (!updated) return c.json({ message: "Order not found" }, 404);
  return c.json({ message: "Order status updated" }, 200);
};
