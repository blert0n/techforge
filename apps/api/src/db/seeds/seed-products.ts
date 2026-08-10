import "dotenv/config";

import { eq } from "drizzle-orm";

import { db, pool } from "../client";
import {
  brand,
  category,
  product,
  productAttribute,
  productImage,
  productSpecification,
  specificationTemplate,
} from "../schema/index";

type SeedCatalog = {
  brands: Array<{ name: string; slug: string }>;
  categories: Array<{
    name: string;
    slug: string;
    attributePrefix: string;
    description: string;
    template: Array<Record<string, unknown>>;
  }>;
  products: Array<{
    name: string;
    slug: string;
    sku: string;
    brand: string;
    category: string;
    description: string;
    price: string;
    discountPrice: string | null;
    stock: number;
    specifications: Record<string, unknown>;
    attributes: Array<[string, string]>;
  }>;
};

// Add catalog records here when you are ready to seed production data.
const catalog: SeedCatalog = {
  brands: [],
  categories: [],
  products: [],
};

async function seedProducts() {
  await db.transaction(async (tx) => {
    const brandIds = new Map<string, number>();
    const categoryIds = new Map<string, number>();

    for (const item of catalog.brands) {
      const [savedBrand] = await tx
        .insert(brand)
        .values(item)
        .onConflictDoUpdate({
          target: brand.slug,
          set: { name: item.name, updatedAt: new Date() },
        })
        .returning({ id: brand.id });
      brandIds.set(item.slug, savedBrand.id);
    }

    for (const item of catalog.categories) {
      const [savedCategory] = await tx
        .insert(category)
        .values({
          name: item.name,
          slug: item.slug,
          attributePrefix: item.attributePrefix,
          description: item.description,
        })
        .onConflictDoUpdate({
          target: category.slug,
          set: {
            name: item.name,
            attributePrefix: item.attributePrefix,
            description: item.description,
            updatedAt: new Date(),
          },
        })
        .returning({ id: category.id });
      categoryIds.set(item.slug, savedCategory.id);

      await tx
        .insert(specificationTemplate)
        .values({ categoryId: savedCategory.id, fields: item.template })
        .onConflictDoUpdate({
          target: specificationTemplate.categoryId,
          set: { fields: item.template, updatedAt: new Date() },
        });
    }

    for (const item of catalog.products) {
      const brandId = brandIds.get(item.brand);
      const categoryId = categoryIds.get(item.category);

      if (!brandId || !categoryId) {
        throw new Error(`Missing brand or category for ${item.sku}`);
      }

      const [savedProduct] = await tx
        .insert(product)
        .values({
          name: item.name,
          slug: item.slug,
          sku: item.sku,
          brandId,
          categoryId,
          description: item.description,
          price: item.price,
          discountPrice: item.discountPrice,
          stock: item.stock,
          status: "active",
        })
        .onConflictDoUpdate({
          target: product.sku,
          set: {
            name: item.name,
            slug: item.slug,
            brandId,
            categoryId,
            description: item.description,
            price: item.price,
            discountPrice: item.discountPrice,
            stock: item.stock,
            status: "active",
            updatedAt: new Date(),
          },
        })
        .returning({ id: product.id });

      await tx
        .insert(productSpecification)
        .values({
          productId: savedProduct.id,
          specifications: item.specifications,
        })
        .onConflictDoUpdate({
          target: productSpecification.productId,
          set: { specifications: item.specifications, updatedAt: new Date() },
        });

      await tx
        .delete(productAttribute)
        .where(eq(productAttribute.productId, savedProduct.id));
      if (item.attributes.length) {
        await tx.insert(productAttribute).values(
          item.attributes.map(([attributeName, attributeValue]) => ({
            productId: savedProduct.id,
            attributeName,
            attributeValue,
          })),
        );
      }

      await tx
        .delete(productImage)
        .where(eq(productImage.productId, savedProduct.id));
      await tx.insert(productImage).values({
        productId: savedProduct.id,
        url: `https://placehold.co/1200x900?text=${encodeURIComponent(item.name)}`,
        altText: item.name,
        position: 0,
      });
    }
  });
}

seedProducts()
  .then(() => console.log("Product catalog seeded successfully."))
  .catch((error: unknown) => {
    console.error("Failed to seed product catalog", error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
