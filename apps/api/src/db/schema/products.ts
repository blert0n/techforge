import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

type JsonObject = Record<string, unknown>;
type JsonArray = unknown[];

export const brand = pgTable(
  "brands",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [uniqueIndex("brands_name_idx").on(table.name)],
);

export const category = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    attributePrefix: text("attribute_prefix").notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    displayInNav: boolean("display_in_nav").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
);

export const categoryParent = pgTable(
  "category_parents",
  {
    categoryId: integer("category_id")
      .notNull()
      .references(() => category.id, { onDelete: "cascade" }),
    parentId: integer("parent_id")
      .notNull()
      .references(() => category.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.categoryId, table.parentId] }),
    index("category_parents_parent_id_idx").on(table.parentId),
  ],
);

export const product = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),
    sku: text("sku").notNull().unique(),
    brandId: integer("brand_id")
      .notNull()
      .references(() => brand.id, { onDelete: "restrict" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => category.id, { onDelete: "restrict" }),
    price: numeric("price", { precision: 12, scale: 2 }).notNull(),
    discountPrice: numeric("discount_price", { precision: 12, scale: 2 }),
    stock: integer("stock").default(0).notNull(),
    status: text("status").default("draft").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("products_brand_id_idx").on(table.brandId),
    index("products_category_id_idx").on(table.categoryId),
    index("products_status_idx").on(table.status),
  ],
);

export const productImage = pgTable(
  "product_images",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    altText: text("alt_text"),
    position: integer("position").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("product_images_product_id_idx").on(table.productId),
    uniqueIndex("product_images_product_position_idx").on(
      table.productId,
      table.position,
    ),
  ],
);

export const productSpecification = pgTable(
  "product_specifications",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .unique()
      .references(() => product.id, { onDelete: "cascade" }),
    specifications: jsonb("specifications").$type<JsonObject>().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("product_specifications_product_id_idx").on(table.productId)],
);

export const productAttribute = pgTable(
  "product_attributes",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => product.id, { onDelete: "cascade" }),
    attributeName: text("attribute_name").notNull(),
    attributeValue: text("attribute_value").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("product_attributes_product_id_idx").on(table.productId),
    index("product_attributes_name_value_idx").on(
      table.attributeName,
      table.attributeValue,
    ),
    uniqueIndex("product_attributes_product_name_value_idx").on(
      table.productId,
      table.attributeName,
      table.attributeValue,
    ),
  ],
);

export const specificationTemplate = pgTable(
  "specification_templates",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .unique()
      .references(() => category.id, { onDelete: "cascade" }),
    fields: jsonb("fields").$type<JsonArray>().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("specification_templates_category_id_idx").on(table.categoryId)],
);

export const brandRelations = relations(brand, ({ many }) => ({
  products: many(product),
}));

export const categoryRelations = relations(category, ({ one, many }) => ({
  parentLinks: many(categoryParent, { relationName: "categoryParentLinks" }),
  childLinks: many(categoryParent, { relationName: "categoryChildLinks" }),
  products: many(product),
  specificationTemplate: one(specificationTemplate),
}));

export const categoryParentRelations = relations(categoryParent, ({ one }) => ({
  category: one(category, {
    fields: [categoryParent.categoryId],
    references: [category.id],
    relationName: "categoryParentLinks",
  }),
  parent: one(category, {
    fields: [categoryParent.parentId],
    references: [category.id],
    relationName: "categoryChildLinks",
  }),
}));

export const productRelations = relations(product, ({ one, many }) => ({
  brand: one(brand, {
    fields: [product.brandId],
    references: [brand.id],
  }),
  category: one(category, {
    fields: [product.categoryId],
    references: [category.id],
  }),
  images: many(productImage),
  specification: one(productSpecification),
  attributes: many(productAttribute),
}));

export const productImageRelations = relations(productImage, ({ one }) => ({
  product: one(product, {
    fields: [productImage.productId],
    references: [product.id],
  }),
}));

export const productSpecificationRelations = relations(
  productSpecification,
  ({ one }) => ({
    product: one(product, {
      fields: [productSpecification.productId],
      references: [product.id],
    }),
  }),
);

export const productAttributeRelations = relations(productAttribute, ({ one }) => ({
  product: one(product, {
    fields: [productAttribute.productId],
    references: [product.id],
  }),
}));

export const specificationTemplateRelations = relations(
  specificationTemplate,
  ({ one }) => ({
    category: one(category, {
      fields: [specificationTemplate.categoryId],
      references: [category.id],
    }),
  }),
);
