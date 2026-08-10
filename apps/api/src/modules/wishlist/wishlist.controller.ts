import { randomUUID } from "node:crypto";
import type { RouteHandler } from "@hono/zod-openapi";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";

import { db } from "../../db/client";
import {
  category,
  categoryParent,
  product,
  wishlistItem,
} from "../../db/schema/index";
import { mapStorefrontProduct } from "../products/products.shared";
import type {
  getWishlistRoute,
  toggleWishlistProductRoute,
} from "./wishlist.routes";

export const getWishlist: RouteHandler<typeof getWishlistRoute> = async (c) => {
  const user = c.get("user");
  const { categoryId, sort } = c.req.valid("query");
  const [categories, categoryLinks] = await Promise.all([
    db
      .select({ id: category.id, name: category.name })
      .from(category)
      .orderBy(asc(category.name)),
    categoryId ? db.select().from(categoryParent) : Promise.resolve([]),
  ]);

  let productIds: number[] | undefined;
  if (categoryId) {
    const childrenByParent = new Map<number, number[]>();
    for (const link of categoryLinks) {
      const children = childrenByParent.get(link.parentId) ?? [];
      children.push(link.categoryId);
      childrenByParent.set(link.parentId, children);
    }

    const categoryIds = new Set<number>();
    const pending = [categoryId];
    while (pending.length) {
      const currentId = pending.pop()!;
      if (categoryIds.has(currentId)) continue;
      categoryIds.add(currentId);
      pending.push(...(childrenByParent.get(currentId) ?? []));
    }

    productIds = (
      await db
        .select({ id: product.id })
        .from(product)
        .where(inArray(product.categoryId, [...categoryIds]))
    ).map((record) => record.id);
  }

  const wishlistProductPrice = sql<number>`coalesce((select coalesce("products"."discount_price", "products"."price") from "products" where "products"."id" = "wishlistItem"."product_id"), 0)`;
  const wishlistProductName = sql<string>`(select "products"."name" from "products" where "products"."id" = "wishlistItem"."product_id")`;
  const orderBy =
    sort === "Price: Low to High"
      ? asc(wishlistProductPrice)
      : sort === "Price: High to Low"
        ? desc(wishlistProductPrice)
        : sort === "Name A–Z"
          ? asc(wishlistProductName)
          : desc(wishlistItem.createdAt);

  const records = await db.query.wishlistItem.findMany({
    where: and(
      eq(wishlistItem.userId, user.id),
      inArray(
        wishlistItem.productId,
        db
          .select({ id: product.id })
          .from(product)
          .where(eq(product.status, "active")),
      ),
      ...(productIds ? [inArray(wishlistItem.productId, productIds)] : []),
    ),
    orderBy: [orderBy],
    with: {
      product: {
        with: {
          brand: true,
          images: true,
          specification: true,
        },
      },
    },
  });

  return c.json(
    {
      categories,
      items: records.map((record) =>
        mapStorefrontProduct(
          {
            ...record.product,
            images: [...record.product.images].sort(
              (left, right) => left.position - right.position,
            ),
          },
          true,
        ),
      ),
    },
    200,
  );
};

export const toggleWishlistProduct: RouteHandler<
  typeof toggleWishlistProductRoute
> = async (c) => {
  const user = c.get("user");
  const { productId } = c.req.valid("json");
  const [existing] = await db
    .select({ id: wishlistItem.id })
    .from(wishlistItem)
    .where(
      and(
        eq(wishlistItem.userId, user.id),
        eq(wishlistItem.productId, productId),
      ),
    )
    .limit(1);

  if (existing) {
    await db.delete(wishlistItem).where(eq(wishlistItem.id, existing.id));
    return c.json({ productId, isWishlisted: false }, 200);
  }

  const [selectedProduct] = await db
    .select({ id: product.id })
    .from(product)
    .where(and(eq(product.id, productId), eq(product.status, "active")))
    .limit(1);
  if (!selectedProduct) {
    return c.json({ message: "Product is not available" }, 404);
  }

  await db
    .insert(wishlistItem)
    .values({ id: randomUUID(), userId: user.id, productId })
    .onConflictDoNothing();

  return c.json({ productId, isWishlisted: true }, 200);
};
