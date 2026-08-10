import type { RouteHandler } from "@hono/zod-openapi";
import {
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  ilike,
  lte,
  or,
  sql,
  type SQL,
} from "drizzle-orm";
import { db } from "../../db/client";
import {
  category,
  categoryParent,
  brand,
  product as productTable,
  productAttribute,
  productImage,
  specificationTemplate,
} from "../../db/schema/index";
import type {
  getStorefrontProductRoute,
  listProductsRoute,
} from "./products.routes";
import {
  mapStorefrontProduct,
  parseIdList,
  parseSpecificationFilters,
  resolveCategoryTree,
} from "./products.shared";

export const getStorefrontProduct: RouteHandler<
  typeof getStorefrontProductRoute
> = async (c) => {
  const { slug } = c.req.valid("param");
  const record = await db.query.product.findFirst({
    where: and(eq(productTable.slug, slug), eq(productTable.status, "active")),
    with: {
      brand: true,
      category: { with: { specificationTemplate: true } },
      images: { orderBy: [asc(productImage.position)] },
      specification: true,
    },
  });
  if (!record) return c.json({ message: "Product not found" }, 404);

  return c.json(
    {
      ...mapStorefrontProduct(record),
      description: record.description,
      category: {
        id: record.category.id,
        name: record.category.name,
        slug: record.category.slug,
        specificationTemplate: record.category.specificationTemplate
          ? { fields: record.category.specificationTemplate.fields }
          : null,
      },
      images: record.images.map((image) => ({
        url: image.url,
        altText: image.altText,
      })),
    } as never,
    200,
  );
};

function getProductOrderBy({
  sort,
  effectivePrice,
  shouldShuffle,
}: {
  sort: "featured" | "price-ascending" | "price-descending";
  effectivePrice: SQL;
  shouldShuffle: boolean;
}) {
  if (sort === "price-ascending") return asc(effectivePrice);
  if (sort === "price-descending") return desc(effectivePrice);
  if (shouldShuffle) return sql`random()`;

  return desc(productTable.createdAt);
}

export const listProducts: RouteHandler<typeof listProductsRoute> = async (
  c,
) => {
  const query = c.req.valid("query");
  const categoryTree = await resolveCategoryTree(query.category);
  if (!categoryTree) return c.json({ message: "Category not found" }, 404);

  const { selectedCategory, childCategoryFilters } = categoryTree;
  const baseFilters: SQL[] = [eq(productTable.status, "active")];
  if (categoryTree.categoryIds) {
    baseFilters.push(
      inArray(productTable.categoryId, categoryTree.categoryIds),
    );
  }

  if (query.search) {
    const pattern = `%${query.search}%`;
    baseFilters.push(
      or(
        ilike(productTable.name, pattern),
        ilike(productTable.description, pattern),
      )!,
    );
  }

  const productFilters = [...baseFilters];
  const requestedCategoryIds = parseIdList(query.categoryIds);
  if (requestedCategoryIds.size) {
    const allowedCategoryIds = childCategoryFilters
      .filter((child) => requestedCategoryIds.has(child.id))
      .flatMap((child) => child.categoryIds);
    productFilters.push(
      allowedCategoryIds.length
        ? inArray(productTable.categoryId, allowedCategoryIds)
        : sql`false`,
    );
  }

  const effectivePrice = sql<number>`coalesce(${productTable.discountPrice}, ${productTable.price})`;
  if (query.minPrice !== undefined)
    productFilters.push(gte(effectivePrice, query.minPrice));
  if (query.maxPrice !== undefined)
    productFilters.push(lte(effectivePrice, query.maxPrice));
  if (query.minRating !== undefined)
    productFilters.push(sql`0 >= ${query.minRating}`);

  const requestedSpecifications = parseSpecificationFilters(
    query.specifications,
  );
  if (selectedCategory && childCategoryFilters.length === 0) {
    for (const [key, filter] of Object.entries(requestedSpecifications)) {
      const attributeName = `${selectedCategory.attributePrefix}.${key}`;
      if (Array.isArray(filter) && !filter.length) continue;
      const range = Array.isArray(filter) ? undefined : filter;
      productFilters.push(
        inArray(
          productTable.id,
          db
            .select({ productId: productAttribute.productId })
            .from(productAttribute)
            .where(
              and(
                eq(productAttribute.attributeName, attributeName),
                ...(range
                  ? [
                      ...(range.min !== undefined
                        ? [
                            sql`cast(${productAttribute.attributeValue} as numeric) >= ${range.min}`,
                          ]
                        : []),
                      ...(range.max !== undefined
                        ? [
                            sql`cast(${productAttribute.attributeValue} as numeric) <= ${range.max}`,
                          ]
                        : []),
                    ]
                  : [inArray(productAttribute.attributeValue, filter)]),
              ),
            ),
        ),
      );
    }
  } else if (
    Object.values(requestedSpecifications).some((filter) =>
      Array.isArray(filter) ? filter.length : true,
    )
  ) {
    productFilters.push(sql`false`);
  }

  const orderBy = getProductOrderBy({
    sort: query.sort,
    effectivePrice,
    shouldShuffle: !selectedCategory || childCategoryFilters.length > 0,
  });

  const [records, facetAttributes] = await Promise.all([
    db.query.product.findMany({
      where: and(...productFilters),
      with: {
        brand: true,
        images: { orderBy: [asc(productImage.position)] },
        specification: true,
      },
      orderBy: [orderBy],
    }),
    selectedCategory && childCategoryFilters.length === 0
      ? db
          .select({
            name: productAttribute.attributeName,
            value: productAttribute.attributeValue,
          })
          .from(productAttribute)
          .innerJoin(
            productTable,
            eq(productAttribute.productId, productTable.id),
          )
          .where(and(...baseFilters))
      : Promise.resolve([]),
  ]);

  let parents: { name: string; slug: string }[] = [];
  if (selectedCategory) {
    parents = await db
      .select({ name: category.name, slug: category.slug })
      .from(categoryParent)
      .innerJoin(category, eq(categoryParent.parentId, category.id))
      .where(eq(categoryParent.categoryId, selectedCategory.id));
  }

  let specificationFilters: {
    key: string;
    label: string;
    unit: string | null;
    format: "text" | "number" | "boolean";
    options: { value: string; label: string }[];
  }[] = [];
  if (selectedCategory && childCategoryFilters.length === 0) {
    const template = await db.query.specificationTemplate.findFirst({
      where: eq(specificationTemplate.categoryId, selectedCategory.id),
    });
    const fields = (template?.fields ?? []) as Array<
      | string
      | {
          key: string;
          label: string;
          unit?: string;
          format: "text" | "number" | "boolean";
        }
    >;
    specificationFilters = fields.flatMap((field) => {
      const key = typeof field === "string" ? field : field.key;
      const label =
        typeof field === "string"
          ? field.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
          : field.label;
      const unit = typeof field === "string" ? null : (field.unit ?? null);
      const format = typeof field === "string" ? "text" : field.format;
      const attributeName = `${selectedCategory.attributePrefix}.${key}`;
      const values = [
        ...new Set(
          facetAttributes
            .filter((attribute) => attribute.name === attributeName)
            .map((attribute) => attribute.value)
            .filter((value) => format !== "number" || Number(value) !== 0),
        ),
      ].sort((left, right) =>
        left.localeCompare(right, undefined, { numeric: true }),
      );
      return values.length
        ? [
            {
              key,
              label,
              unit,
              format,
              options: values.map((value) => ({
                value,
                label: `${value === "true" ? "Yes" : value === "false" ? "No" : value}${unit ? ` ${unit}` : ""}`,
              })),
            },
          ]
        : [];
    });
  }

  return c.json(
    {
      category: selectedCategory
        ? {
            id: selectedCategory.id,
            name: selectedCategory.name,
            slug: selectedCategory.slug,
            description: selectedCategory.description,
            parents,
            children: childCategoryFilters,
          }
        : null,
      items: records.map(mapStorefrontProduct),
      specificationFilters,
    },
    200,
  );
};
