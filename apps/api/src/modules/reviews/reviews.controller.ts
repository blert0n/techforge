import { randomUUID } from "node:crypto";
import { and, count, desc, eq, sql } from "drizzle-orm";
import type { RouteHandler } from "@hono/zod-openapi";
import { db } from "../../db/client";
import {
  category,
  order,
  orderItem,
  product,
  review,
} from "../../db/schema/index";
import type {
  createReviewRoute,
  deleteReviewRoute,
  getReviewRoute,
  listReviewsRoute,
  listMyReviewsRoute,
  listAdminReviewsRoute,
  listPendingReviewProductsRoute,
  updateReviewRoute,
  voteOnReviewHelpfulnessRoute,
} from "./reviews.routes";

function serializeReview(
  record: typeof review.$inferSelect & {
    user: { id: string; name: string; image?: string | null };
    product: { id: number; name: string; category: { name: string } };
  },
) {
  return {
    id: record.id,
    productId: record.productId,
    rating: record.rating,
    title: record.title,
    body: record.body,
    helpfulUpvotes: record.helpfulUpvotes,
    helpfulDownvotes: record.helpfulDownvotes,
    product: {
      id: record.product.id,
      name: record.product.name,
      category: record.product.category.name,
    },
    author: {
      id: record.user.id,
      name: record.user.name,
      image: record.user.image ?? null,
    },
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

async function findReview(id: string) {
  return db.query.review.findFirst({
    where: eq(review.id, id),
    with: { user: true, product: { with: { category: true } } },
  });
}

function mayManage(
  reviewUserId: string,
  user: { id: string; role?: string | null },
) {
  return user.id === reviewUserId || user.role === "admin";
}

export const listReviews: RouteHandler<typeof listReviewsRoute> = async (c) => {
  const { productId } = c.req.valid("query");
  const records = await db.query.review.findMany({
    where: eq(review.productId, productId),
    orderBy: [desc(review.createdAt)],
    with: { user: true, product: { with: { category: true } } },
  });
  return c.json(records.map(serializeReview), 200);
};

export const getReview: RouteHandler<typeof getReviewRoute> = async (c) => {
  const record = await findReview(c.req.valid("param").id);
  return record
    ? c.json(serializeReview(record), 200)
    : c.json({ message: "Review not found" }, 404);
};

export const listMyReviews: RouteHandler<typeof listMyReviewsRoute> = async (
  c,
) => {
  const user = c.get("user");
  const { page, pageSize, rating } = c.req.valid("query");
  const where = and(
    eq(review.userId, user.id),
    ...(rating ? [eq(review.rating, rating)] : []),
  );
  const [records, [{ total }], [stats]] = await Promise.all([
    db.query.review.findMany({
      where,
      orderBy: [desc(review.createdAt)],
      limit: pageSize,
      offset: (page - 1) * pageSize,
      with: { user: true, product: { with: { category: true } } },
    }),
    db.select({ total: count() }).from(review).where(where),
    db
      .select({
        total: count(),
        averageRating: sql<string>`coalesce(avg(${review.rating}), 0)`,
        helpfulVotes: sql<string>`coalesce(sum(${review.helpfulUpvotes}), 0)`,
      })
      .from(review)
      .where(eq(review.userId, user.id)),
  ]);
  return c.json(
    {
      items: records.map(serializeReview),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
      stats: {
        total: stats.total,
        averageRating: Number(stats.averageRating),
        helpfulVotes: Number(stats.helpfulVotes),
      },
    },
    200,
  );
};

export const listAdminReviews: RouteHandler<
  typeof listAdminReviewsRoute
> = async (c) => {
  const { page, pageSize, rating, productId } = c.req.valid("query");
  const where = and(
    ...(rating ? [eq(review.rating, rating)] : []),
    ...(productId ? [eq(review.productId, productId)] : []),
  );
  const [records, [{ total }]] = await Promise.all([
    db.query.review.findMany({
      where,
      orderBy: [desc(review.createdAt)],
      limit: pageSize,
      offset: (page - 1) * pageSize,
      with: { user: true, product: { with: { category: true } } },
    }),
    db.select({ total: count() }).from(review).where(where),
  ]);
  return c.json(
    {
      items: records.map(serializeReview),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    },
    200,
  );
};

export const createReview: RouteHandler<typeof createReviewRoute> = async (
  c,
) => {
  const user = c.get("user");
  const body = c.req.valid("json");
  const availableProduct = await db.query.product.findFirst({
    where: and(eq(product.id, body.productId), eq(product.status, "active")),
    with: { category: true },
  });
  if (!availableProduct)
    return c.json({ message: "Product is unavailable" }, 400);
  const existing = await db.query.review.findFirst({
    where: and(
      eq(review.productId, body.productId),
      eq(review.userId, user.id),
    ),
  });
  if (existing)
    return c.json({ message: "You have already reviewed this product" }, 409);
  const [created] = await db
    .insert(review)
    .values({ id: randomUUID(), userId: user.id, ...body })
    .returning();
  return c.json(
    serializeReview({ ...created, user, product: availableProduct }),
    201,
  );
};

export const listPendingReviewProducts: RouteHandler<
  typeof listPendingReviewProductsRoute
> = async (c) => {
  const user = c.get("user");
  const records = await db
    .select({
      productId: product.id,
      productName: product.name,
      category: category.name,
      orderNumber: order.orderNumber,
      placedAt: order.placedAt,
    })
    .from(orderItem)
    .innerJoin(order, eq(orderItem.orderId, order.id))
    .innerJoin(product, eq(orderItem.productId, product.id))
    .innerJoin(category, eq(product.categoryId, category.id))
    .where(
      and(
        eq(order.userId, user.id),
        eq(order.paymentStatus, "paid"),
        sql`not exists (select 1 from ${review} where ${review.userId} = ${user.id} and ${review.productId} = ${product.id})`,
      ),
    )
    .orderBy(desc(order.placedAt));

  const products = new Map<number, (typeof records)[number]>();
  for (const record of records) products.set(record.productId, record);
  return c.json(
    [...products.values()].map((record) => ({
      ...record,
      placedAt: record.placedAt.toISOString(),
    })),
    200,
  );
};

export const updateReview: RouteHandler<typeof updateReviewRoute> = async (
  c,
) => {
  const user = c.get("user");
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  const existing = await findReview(id);
  if (!existing) return c.json({ message: "Review not found" }, 404);
  if (!mayManage(existing.userId, user))
    return c.json({ message: "Forbidden" }, 403);
  const [updated] = await db
    .update(review)
    .set(body)
    .where(eq(review.id, id))
    .returning();
  return c.json(
    serializeReview({
      ...updated,
      user: existing.user,
      product: existing.product,
    }),
    200,
  );
};

export const deleteReview: RouteHandler<typeof deleteReviewRoute> = async (
  c,
) => {
  const user = c.get("user");
  const { id } = c.req.valid("param");
  const existing = await findReview(id);
  if (!existing) return c.json({ message: "Review not found" }, 404);
  if (!mayManage(existing.userId, user))
    return c.json({ message: "Forbidden" }, 403);
  await db.delete(review).where(eq(review.id, id));
  return c.json({ message: "Review deleted" }, 200);
};

export const voteOnReviewHelpfulness: RouteHandler<
  typeof voteOnReviewHelpfulnessRoute
> = async (c) => {
  const { id } = c.req.valid("param");
  const { vote } = c.req.valid("json");
  const existing = await findReview(id);
  if (!existing) return c.json({ message: "Review not found" }, 404);

  const [updated] = await db
    .update(review)
    .set({
      helpfulUpvotes:
        vote === "up" ? sql`${review.helpfulUpvotes} + 1` : undefined,
      helpfulDownvotes:
        vote === "down" ? sql`${review.helpfulDownvotes} + 1` : undefined,
      updatedAt: new Date(),
    })
    .where(eq(review.id, id))
    .returning();
  return c.json(
    serializeReview({
      ...updated,
      user: existing.user,
      product: existing.product,
    }),
    200,
  );
};
