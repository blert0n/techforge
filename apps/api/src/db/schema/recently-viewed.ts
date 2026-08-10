import { relations, sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { user } from "./auth";
import { product } from "./products";

export const recentlyViewedProduct = pgTable(
  "recently_viewed_products",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    guestTokenHash: text("guest_token_hash"),
    productId: integer("product_id")
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    viewedAt: timestamp("viewed_at").defaultNow().notNull(),
  },
  (table) => [
    check(
      "recently_viewed_products_exactly_one_owner_check",
      sql`(${table.userId} IS NOT NULL) <> (${table.guestTokenHash} IS NOT NULL)`,
    ),
    uniqueIndex("recently_viewed_products_user_product_idx")
      .on(table.userId, table.productId)
      .where(sql`${table.userId} IS NOT NULL`),
    uniqueIndex("recently_viewed_products_guest_product_idx")
      .on(table.guestTokenHash, table.productId)
      .where(sql`${table.guestTokenHash} IS NOT NULL`),
    index("recently_viewed_products_user_viewed_at_idx").on(
      table.userId,
      table.viewedAt,
    ),
    index("recently_viewed_products_guest_viewed_at_idx").on(
      table.guestTokenHash,
      table.viewedAt,
    ),
  ],
);

export const recentlyViewedProductRelations = relations(
  recentlyViewedProduct,
  ({ one }) => ({
    user: one(user, {
      fields: [recentlyViewedProduct.userId],
      references: [user.id],
    }),
    product: one(product, {
      fields: [recentlyViewedProduct.productId],
      references: [product.id],
    }),
  }),
);
