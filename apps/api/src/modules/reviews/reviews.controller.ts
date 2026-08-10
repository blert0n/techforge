import { randomUUID } from "node:crypto";
import { and, desc, eq, sql } from "drizzle-orm";
import type { RouteHandler } from "@hono/zod-openapi";
import { db } from "../../db/client";
import { product, review } from "../../db/schema/index";
import type {
  createReviewRoute,
  deleteReviewRoute,
  getReviewRoute,
  listReviewsRoute,
  listMyReviewsRoute,
  updateReviewRoute,
  voteOnReviewHelpfulnessRoute,
} from "./reviews.routes";

function serializeReview(
  record: typeof review.$inferSelect & {
    user: { id: string; name: string; image?: string | null };
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
    with: { user: true },
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
    with: { user: true },
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
  const records = await db.query.review.findMany({
    where: eq(review.userId, user.id),
    orderBy: [desc(review.createdAt)],
    with: { user: true },
  });
  return c.json(records.map(serializeReview), 200);
};

export const createReview: RouteHandler<typeof createReviewRoute> = async (
  c,
) => {
  const user = c.get("user");
  const body = c.req.valid("json");
  const availableProduct = await db.query.product.findFirst({
    where: and(eq(product.id, body.productId), eq(product.status, "active")),
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
  return c.json(serializeReview({ ...created, user }), 201);
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
  return c.json(serializeReview({ ...updated, user: existing.user }), 200);
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
  return c.json(serializeReview({ ...updated, user: existing.user }), 200);
};
