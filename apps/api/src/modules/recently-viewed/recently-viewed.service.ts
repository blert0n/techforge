import { randomUUID } from "node:crypto";
import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "../../db/client";
import { recentlyViewedProduct } from "../../db/schema/index";
import { hashGuestToken } from "../../lib/guest-token";
import { mapStorefrontProduct } from "../products/products.shared";

const MAX_RECENTLY_VIEWED_PRODUCTS = 4;

export async function recordRecentlyViewedProduct({
  productId,
  userId,
  guestToken,
}: {
  productId: number;
  userId?: string;
  guestToken?: string;
}) {
  const guestTokenHash = guestToken ? hashGuestToken(guestToken) : undefined;
  if (!userId && !guestTokenHash) return;
  const ownerFilter = userId
    ? eq(recentlyViewedProduct.userId, userId)
    : eq(recentlyViewedProduct.guestTokenHash, guestTokenHash!);
  await db.transaction(async (tx) => {
    await tx
      .delete(recentlyViewedProduct)
      .where(and(ownerFilter, eq(recentlyViewedProduct.productId, productId)));
    await tx.insert(recentlyViewedProduct).values({
      id: randomUUID(),
      productId,
      ...(userId ? { userId } : { guestTokenHash }),
    });
    const stale = await tx
      .select({ id: recentlyViewedProduct.id })
      .from(recentlyViewedProduct)
      .where(ownerFilter)
      .orderBy(desc(recentlyViewedProduct.viewedAt))
      .offset(MAX_RECENTLY_VIEWED_PRODUCTS);
    if (stale.length)
      await tx.delete(recentlyViewedProduct).where(
        inArray(
          recentlyViewedProduct.id,
          stale.map((item) => item.id),
        ),
      );
  });
}

export async function getRecentlyViewedProducts({
  userId,
  guestToken,
}: {
  userId?: string;
  guestToken?: string;
}) {
  const guestTokenHash = guestToken ? hashGuestToken(guestToken) : undefined;
  if (!userId && !guestTokenHash) return [];
  const ownerFilter = userId
    ? eq(recentlyViewedProduct.userId, userId)
    : eq(recentlyViewedProduct.guestTokenHash, guestTokenHash!);
  const records = await db.query.recentlyViewedProduct.findMany({
    where: ownerFilter,
    orderBy: [desc(recentlyViewedProduct.viewedAt)],
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

  return records
    .filter((record) => record.product.status === "active")
    .map((record) =>
      mapStorefrontProduct({
        ...record.product,
        images: [...record.product.images].sort(
          (left, right) => left.position - right.position,
        ),
      }),
    );
}

export async function mergeGuestRecentlyViewedProducts(
  token: string,
  userId: string,
) {
  const guestTokenHash = hashGuestToken(token);
  const guestRecords = await db
    .select({ productId: recentlyViewedProduct.productId })
    .from(recentlyViewedProduct)
    .where(eq(recentlyViewedProduct.guestTokenHash, guestTokenHash))
    .orderBy(desc(recentlyViewedProduct.viewedAt));

  for (const record of guestRecords.reverse()) {
    await recordRecentlyViewedProduct({ productId: record.productId, userId });
  }

  const userRecords = await db
    .select({ productId: recentlyViewedProduct.productId })
    .from(recentlyViewedProduct)
    .where(eq(recentlyViewedProduct.userId, userId))
    .orderBy(desc(recentlyViewedProduct.viewedAt));

  await db
    .delete(recentlyViewedProduct)
    .where(eq(recentlyViewedProduct.guestTokenHash, guestTokenHash));
  for (const record of userRecords.reverse()) {
    await recordRecentlyViewedProduct({
      productId: record.productId,
      guestToken: token,
    });
  }
}
