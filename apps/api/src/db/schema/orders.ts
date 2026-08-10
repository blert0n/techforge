import { relations, sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { address } from "./addresses";
import { user } from "./auth";
import { product } from "./products";

export type ShippingAddressSnapshot = {
  firstName: string;
  lastName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export const order = pgTable(
  "orders",
  {
    id: text("id").primaryKey(),
    orderNumber: text("order_number").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    shippingAddressId: text("shipping_address_id").references(
      () => address.id,
      { onDelete: "set null" },
    ),
    shippingAddress: jsonb("shipping_address")
      .$type<ShippingAddressSnapshot>()
      .notNull(),
    status: text("status").notNull().default("pending"),
    paymentStatus: text("payment_status").notNull().default("pending"),
    paymentMethod: text("payment_method").notNull(),
    currency: text("currency").notNull().default("USD"),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
    shippingTotal: numeric("shipping_total", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    taxTotal: numeric("tax_total", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    discountTotal: numeric("discount_total", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    total: numeric("total", { precision: 12, scale: 2 }).notNull(),
    placedAt: timestamp("placed_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("orders_order_number_idx").on(table.orderNumber),
    index("orders_user_placed_at_idx").on(table.userId, table.placedAt),
    index("orders_status_idx").on(table.status),
    check(
      "orders_totals_nonnegative",
      sql`${table.subtotal} >= 0 AND ${table.shippingTotal} >= 0 AND ${table.taxTotal} >= 0 AND ${table.discountTotal} >= 0 AND ${table.total} >= 0`,
    ),
  ],
);

export const orderItem = pgTable(
  "order_items",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => order.id, { onDelete: "cascade" }),
    productId: integer("product_id").references(() => product.id, {
      onDelete: "set null",
    }),
    productName: text("product_name").notNull(),
    productSlug: text("product_slug").notNull(),
    sku: text("sku").notNull(),
    imageUrl: text("image_url"),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull(),
    lineTotal: numeric("line_total", { precision: 12, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("order_items_order_id_idx").on(table.orderId),
    index("order_items_product_id_idx").on(table.productId),
    check("order_items_quantity_check", sql`${table.quantity} > 0`),
    check(
      "order_items_prices_nonnegative",
      sql`${table.unitPrice} >= 0 AND ${table.lineTotal} >= 0`,
    ),
  ],
);

export const orderRelations = relations(order, ({ many, one }) => ({
  user: one(user, { fields: [order.userId], references: [user.id] }),
  shippingAddressRecord: one(address, {
    fields: [order.shippingAddressId],
    references: [address.id],
  }),
  items: many(orderItem),
}));

export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(order, { fields: [orderItem.orderId], references: [order.id] }),
  product: one(product, {
    fields: [orderItem.productId],
    references: [product.id],
  }),
}));
