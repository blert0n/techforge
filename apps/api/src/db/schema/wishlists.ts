import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { user } from "./auth";
import { product } from "./products";

export const wishlistItem = pgTable(
  "wishlist_items",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("wishlist_items_user_product_idx").on(
      table.userId,
      table.productId,
    ),
    index("wishlist_items_product_id_idx").on(table.productId),
  ],
);

export const wishlistItemRelations = relations(wishlistItem, ({ one }) => ({
  user: one(user, {
    fields: [wishlistItem.userId],
    references: [user.id],
  }),
  product: one(product, {
    fields: [wishlistItem.productId],
    references: [product.id],
  }),
}));
