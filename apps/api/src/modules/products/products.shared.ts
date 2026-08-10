import { asc, eq, inArray } from "drizzle-orm";
import { db } from "../../db/client";
import {
  category,
  categoryParent,
} from "../../db/schema/index";

export type CategoryFilter = {
  id: number;
  name: string;
  slug: string;
  categoryIds: number[];
};

export async function resolveCategoryTree(slug?: string) {
  if (!slug) {
    return {
      selectedCategory: undefined,
      categoryIds: undefined,
      childCategoryFilters: [] as CategoryFilter[],
    };
  }

  const selectedCategory = await db.query.category.findFirst({
    where: eq(category.slug, slug),
  });
  if (!selectedCategory) return null;

  const links = await db.select().from(categoryParent);
  const childrenByParent = new Map<number, number[]>();
  for (const link of links) {
    const children = childrenByParent.get(link.parentId) ?? [];
    children.push(link.categoryId);
    childrenByParent.set(link.parentId, children);
  }

  const descendants = (rootId: number) => {
    const result = new Set<number>();
    const pending = [rootId];
    while (pending.length) {
      const current = pending.pop()!;
      if (result.has(current)) continue;
      result.add(current);
      pending.push(...(childrenByParent.get(current) ?? []));
    }
    return [...result];
  };

  const directChildIds = childrenByParent.get(selectedCategory.id) ?? [];
  const directChildren = directChildIds.length
    ? await db
        .select({ id: category.id, name: category.name, slug: category.slug })
        .from(category)
        .where(inArray(category.id, directChildIds))
        .orderBy(asc(category.name))
    : [];

  return {
    selectedCategory,
    categoryIds: descendants(selectedCategory.id),
    childCategoryFilters: directChildren.map((child) => ({
      ...child,
      categoryIds: descendants(child.id),
    })),
  };
}

export function parseIdList(value?: string) {
  return new Set(
    (value ?? "")
      .split(",")
      .map(Number)
      .filter((item) => Number.isInteger(item) && item > 0),
  );
}

export function parseSpecificationFilters(value?: string) {
  if (!value) return {} as Record<string, string[] | { min?: number; max?: number }>;
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).filter(([, filter]) =>
      (Array.isArray(filter) && filter.every((item) => typeof item === "string")) ||
      (typeof filter === "object" && filter !== null && !Array.isArray(filter) &&
        (typeof filter.min === "number" || typeof filter.max === "number")),
    ));
  } catch {
    return {};
  }
}

export function mapStorefrontProduct(record: {
  id: number;
  slug: string;
  name: string;
  categoryId: number;
  price: string;
  discountPrice: string | null;
  stock: number;
  brand: { name: string };
  images: Array<{ url: string; altText: string | null }>;
  specification: { specifications: unknown } | null;
}) {
  const rawSpecifications = (record.specification?.specifications ?? {}) as Record<string, unknown>;
  const specificationValues = Object.fromEntries(
    Object.entries(rawSpecifications).filter(
      (entry): entry is [string, string | number | boolean] =>
        ["string", "number", "boolean"].includes(typeof entry[1]) && entry[1] !== "",
    ),
  );
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    brand: record.brand.name,
    categoryId: record.categoryId,
    price: Number(record.price),
    discountPrice: record.discountPrice === null ? null : Number(record.discountPrice),
    stock: record.stock,
    imageUrl: record.images[0]?.url ?? null,
    imageAltText: record.images[0]?.altText ?? null,
    specifications: Object.entries(specificationValues)
      .slice(0, 2)
      .map(([key, item]) => `${key.replace(/([a-z0-9])([A-Z])/g, "$1 $2")}: ${String(item)}`),
    specificationValues,
    rating: 0,
    reviewCount: 0,
  };
}
