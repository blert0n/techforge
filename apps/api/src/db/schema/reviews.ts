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

export const review = pgTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    helpfulUpvotes: integer("helpful_upvotes").default(0).notNull(),
    helpfulDownvotes: integer("helpful_downvotes").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("reviews_user_product_idx").on(table.userId, table.productId),
    index("reviews_product_created_at_idx").on(
      table.productId,
      table.createdAt,
    ),
    check("reviews_rating_range_check", sql`${table.rating} BETWEEN 1 AND 5`),
    check(
      "reviews_helpful_vote_counts_nonnegative",
      sql`${table.helpfulUpvotes} >= 0 AND ${table.helpfulDownvotes} >= 0`,
    ),
  ],
);

export const reviewRelations = relations(review, ({ one }) => ({
  product: one(product, {
    fields: [review.productId],
    references: [product.id],
  }),
  user: one(user, { fields: [review.userId], references: [user.id] }),
}));
