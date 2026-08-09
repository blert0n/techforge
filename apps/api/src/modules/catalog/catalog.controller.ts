import { asc, eq, or } from "drizzle-orm";
import type { RouteHandler } from "@hono/zod-openapi";

import { db } from "../../db/client";
import { brand, category, product, specificationTemplate } from "../../db/schema/index";
import type {
  createCatalogBrandRoute,
  createCatalogCategoryRoute,
  deleteCatalogBrandRoute,
  deleteCatalogCategoryRoute,
  listCatalogBrandsRoute,
  listCatalogCategoriesRoute,
  updateCatalogCategoryRoute,
  updateCatalogBrandRoute,
  updateCategorySpecificationTemplateRoute,
} from "./catalog.routes";
import type { specificationFieldSchema } from "./catalog.schemas";

type SpecificationFields = Array<
  import("zod").infer<typeof specificationFieldSchema>
>;

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function serializeBrand(record: typeof brand.$inferSelect) {
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export const listCatalogBrands: RouteHandler<typeof listCatalogBrandsRoute> =
  async (c) => {
    const brands = await db.select().from(brand).orderBy(asc(brand.name));

    return c.json(brands.map(serializeBrand), 200);
  };

export const createCatalogBrand: RouteHandler<
  typeof createCatalogBrandRoute
> = async (c) => {
  const { name } = c.req.valid("json");
  const slug = createSlug(name);
  const existingBrand = await db
    .select({ id: brand.id })
    .from(brand)
    .where(or(eq(brand.name, name), eq(brand.slug, slug)))
    .limit(1);

  if (existingBrand[0]) {
    return c.json({ message: "A brand with this name already exists" }, 409);
  }

  const [createdBrand] = await db.insert(brand).values({ name, slug }).returning();

  return c.json(serializeBrand(createdBrand), 201);
};

export const updateCatalogBrand: RouteHandler<
  typeof updateCatalogBrandRoute
> = async (c) => {
  const { id } = c.req.valid("param");
  const { name } = c.req.valid("json");
  const slug = createSlug(name);
  const conflictingBrands = await db
    .select({ id: brand.id })
    .from(brand)
    .where(or(eq(brand.name, name), eq(brand.slug, slug)))
    .limit(1);

  if (conflictingBrands[0] && conflictingBrands[0].id !== id) {
    return c.json({ message: "A brand with this name already exists" }, 409);
  }

  const [updatedBrand] = await db
    .update(brand)
    .set({ name, slug, updatedAt: new Date() })
    .where(eq(brand.id, id))
    .returning();

  if (!updatedBrand) {
    return c.json({ message: "Brand not found" }, 404);
  }

  return c.json(serializeBrand(updatedBrand), 200);
};

export const deleteCatalogBrand: RouteHandler<
  typeof deleteCatalogBrandRoute
> = async (c) => {
  const { id } = c.req.valid("param");
  const brandProducts = await db
    .select({ id: product.id })
    .from(product)
    .where(eq(product.brandId, id))
    .limit(1);

  if (brandProducts[0]) {
    return c.json(
      { message: "This brand cannot be deleted while products use it" },
      409,
    );
  }

  const [deletedBrand] = await db
    .delete(brand)
    .where(eq(brand.id, id))
    .returning({ id: brand.id });

  if (!deletedBrand) {
    return c.json({ message: "Brand not found" }, 404);
  }

  return c.json({ message: "Brand deleted" }, 200);
};

function serializeCategory(record: {
  id: number;
  name: string;
  slug: string;
  attributePrefix: string;
  description: string | null;
  imageUrl: string | null;
  parentId: number | null;
  createdAt: Date;
  updatedAt: Date;
  specificationTemplate: typeof specificationTemplate.$inferSelect | null;
}) {
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    attributePrefix: record.attributePrefix,
    description: record.description ?? undefined,
    imageUrl: record.imageUrl ?? undefined,
    parentId: record.parentId,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    specificationTemplate: record.specificationTemplate
      ? {
          id: record.specificationTemplate.id,
          categoryId: record.specificationTemplate.categoryId,
          fields: record.specificationTemplate.fields as SpecificationFields,
          createdAt: record.specificationTemplate.createdAt.toISOString(),
          updatedAt: record.specificationTemplate.updatedAt.toISOString(),
        }
      : null,
  };
}

export const listCatalogCategories: RouteHandler<
  typeof listCatalogCategoriesRoute
> = async (c) => {
  const categories = await db.query.category.findMany({
    with: { specificationTemplate: true },
    orderBy: [asc(category.name)],
  });

  return c.json(categories.map(serializeCategory), 200);
};

export const createCatalogCategory: RouteHandler<typeof createCatalogCategoryRoute> = async (c) => {
  const body = c.req.valid("json");
  const [created] = await db.insert(category).values(body).returning({ id: category.id });
  const saved = await db.query.category.findFirst({ where: eq(category.id, created.id), with: { specificationTemplate: true } });
  return c.json(serializeCategory(saved!), 201);
};

export const updateCategorySpecificationTemplate: RouteHandler<
  typeof updateCategorySpecificationTemplateRoute
> = async (c) => {
  const { id } = c.req.valid("param");
  const { fields } = c.req.valid("json");

  const existingCategory = await db.query.category.findFirst({
    where: eq(category.id, id),
  });

  if (!existingCategory) {
    return c.json({ message: "Category not found" }, 404);
  }

  await db
    .insert(specificationTemplate)
    .values({ categoryId: id, fields })
    .onConflictDoUpdate({
      target: specificationTemplate.categoryId,
      set: { fields, updatedAt: new Date() },
    });

  const updatedCategory = await db.query.category.findFirst({
    where: eq(category.id, id),
    with: { specificationTemplate: true },
  });

  return c.json(serializeCategory(updatedCategory!), 200);
};

export const updateCatalogCategory: RouteHandler<
  typeof updateCatalogCategoryRoute
> = async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  const [updated] = await db
    .update(category)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(category.id, id))
    .returning({ id: category.id });

  if (!updated) return c.json({ message: "Category not found" }, 404);

  const savedCategory = await db.query.category.findFirst({
    where: eq(category.id, id),
    with: { specificationTemplate: true },
  });

  return c.json(serializeCategory(savedCategory!), 200);
};

export const deleteCatalogCategory: RouteHandler<
  typeof deleteCatalogCategoryRoute
> = async (c) => {
  const { id } = c.req.valid("param");
  const categoryProducts = await db
    .select({ id: product.id })
    .from(product)
    .where(eq(product.categoryId, id))
    .limit(1);

  if (categoryProducts[0]) {
    return c.json(
      { message: "This category cannot be deleted while products use it" },
      409,
    );
  }

  const [deleted] = await db
    .delete(category)
    .where(eq(category.id, id))
    .returning({ id: category.id });

  if (!deleted) return c.json({ message: "Category not found" }, 404);

  return c.json({ message: "Category deleted" }, 200);
};
