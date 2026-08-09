import type { RouteHandler } from "@hono/zod-openapi";
import type { Context } from "hono";
import { createHash } from "node:crypto";
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  lte,
  or,
} from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { db } from "../../db/client";
import {
  brand,
  category,
  product as productTable,
  productAttribute,
  productImage,
  productSpecification,
} from "../../db/schema/index";
import type {
  listProductsRoute,
  listAdminProductsRoute,
  getProductRoute,
  createProductRoute,
  updateProductRoute,
  deleteProductRoute,
} from "./products.routes";
import { env } from "../../config/env";
import { createCatalogProductSchema } from "./products.schemas";

function cloudinaryConfiguration() {
  const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } = env;

  if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET || !CLOUDINARY_CLOUD_NAME) {
    return null;
  }

  return { apiKey: CLOUDINARY_API_KEY, apiSecret: CLOUDINARY_API_SECRET, cloudName: CLOUDINARY_CLOUD_NAME };
}

function createCloudinarySignature(params: Record<string, string>, apiSecret: string) {
  const value = Object.entries(params)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, item]) => `${key}=${item}`)
    .join("&");

  return createHash("sha1").update(`${value}${apiSecret}`).digest("hex");
}

async function uploadToCloudinary(file: string | File) {
  const config = cloudinaryConfiguration();
  if (!config) throw new Error("Cloudinary is not configured.");

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signatureParams = { folder: "techforge/products", timestamp };
  const formData = new FormData();
  formData.set("file", file);
  formData.set("api_key", config.apiKey);
  formData.set("timestamp", timestamp);
  formData.set("folder", signatureParams.folder);
  formData.set("signature", createCloudinarySignature(signatureParams, config.apiSecret));

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    { method: "POST", body: formData },
  );
  const payload = (await response.json()) as { secure_url?: string; error?: { message?: string } };
  if (!response.ok || !payload.secure_url) {
    throw new Error(payload.error?.message ?? "Cloudinary could not upload the image.");
  }

  return payload.secure_url;
}

export async function uploadProductMedia(c: Context) {
  try {
    const contentType = c.req.header("content-type") ?? "";
    let file: string | File;

    if (contentType.includes("application/json")) {
      const body = await c.req.json<{ sourceUrl?: string }>();
      const sourceUrl = body.sourceUrl?.trim();
      if (!sourceUrl) {
        return c.json({ message: "Provide a valid HTTP(S) image URL." }, 400);
      }
      try {
        const parsedUrl = new URL(sourceUrl);
        if (!["http:", "https:"].includes(parsedUrl.protocol)) throw new Error();
      } catch {
        return c.json({ message: "Provide a valid HTTP(S) image URL." }, 400);
      }
      file = sourceUrl;
    } else {
      const body = await c.req.parseBody();
      const uploadedFile = body.file;
      if (!(uploadedFile instanceof File) || !uploadedFile.type.startsWith("image/")) {
        return c.json({ message: "Choose an image file to upload." }, 400);
      }
      file = uploadedFile;
    }

    const url = await uploadToCloudinary(file);
    return c.json({ url }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to upload the image.";
    return c.json({ message }, cloudinaryConfiguration() ? 502 : 503);
  }
}

// temporary in-memory data until the products table/DB access is wired up
const sampleProducts = [
  { id: "1", name: "RTX 4080", price: 999, category: "GPU" },
  { id: "2", name: "Ryzen 7 7800X3D", price: 379, category: "CPU" },
];

export const listProducts: RouteHandler<typeof listProductsRoute> = (c) => {
  return c.json(sampleProducts);
};

export const listAdminProducts: RouteHandler<
  typeof listAdminProductsRoute
> = async (c) => {
  const { page, pageSize, search, status, categoryId } = c.req.valid("query");
  const filters: SQL[] = [];

  if (search) {
    const pattern = `%${search}%`;
    const searchFilter = or(
        ilike(productTable.name, pattern),
        ilike(productTable.sku, pattern),
        inArray(
          productTable.brandId,
          db.select({ id: brand.id }).from(brand).where(ilike(brand.name, pattern)),
        ),
        inArray(
          productTable.categoryId,
          db
            .select({ id: category.id })
            .from(category)
            .where(ilike(category.name, pattern)),
        ),
      );

    if (searchFilter) filters.push(searchFilter);
  }

  if (status) filters.push(eq(productTable.status, status));
  if (categoryId) filters.push(eq(productTable.categoryId, categoryId));

  const where = filters.length ? and(...filters) : undefined;
  const [filteredCount] = await db
    .select({ value: count() })
    .from(productTable)
    .where(where);
  const total = filteredCount.value;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const resolvedPage = Math.min(page, totalPages);

  const [products, totalCount, activeCount, draftCount, lowStockCount] =
    await Promise.all([
      db.query.product.findMany({
        where,
        with: {
          brand: true,
          category: true,
          images: { orderBy: [asc(productImage.position)] },
        },
        orderBy: [desc(productTable.createdAt)],
        limit: pageSize,
        offset: (resolvedPage - 1) * pageSize,
      }),
      db.select({ value: count() }).from(productTable),
      db
        .select({ value: count() })
        .from(productTable)
        .where(eq(productTable.status, "active")),
      db
        .select({ value: count() })
        .from(productTable)
        .where(eq(productTable.status, "draft")),
      db
        .select({ value: count() })
        .from(productTable)
        .where(lte(productTable.stock, 5)),
    ]);

  return c.json(
    {
      items: products.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        brand: { id: product.brand.id, name: product.brand.name },
        category: { id: product.category.id, name: product.category.name },
        price: Number(product.price),
        discountPrice:
          product.discountPrice === null ? null : Number(product.discountPrice),
        stock: product.stock,
        status: product.status,
        imageUrl: product.images[0]?.url ?? null,
        imageAltText: product.images[0]?.altText ?? null,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      })),
      pagination: {
        page: resolvedPage,
        pageSize,
        total,
        totalPages,
      },
      summary: {
        total: totalCount[0].value,
        active: activeCount[0].value,
        drafts: draftCount[0].value,
        lowStock: lowStockCount[0].value,
      },
    },
    200,
  );
};

export const getProduct: RouteHandler<typeof getProductRoute> = (c) => {
  const { id } = c.req.valid("param");
  const product = sampleProducts.find((p) => p.id === id);

  if (!product) {
    return c.json({ message: "Product not found" }, 404);
  }

  return c.json(product, 200);
};

export const createProduct: RouteHandler<typeof createProductRoute> = async (c) => {
  const body = c.req.valid("json");

  const [savedBrand, savedCategory] = await Promise.all([
    db.query.brand.findFirst({ where: eq(brand.id, body.brandId) }),
    db.query.category.findFirst({
      where: eq(category.id, body.categoryId),
      with: { specificationTemplate: true },
    }),
  ]);

  if (!savedBrand) return c.json({ message: "Brand not found" }, 400);
  if (!savedCategory) return c.json({ message: "Category not found" }, 400);

  const templateKeys = new Set(
    (savedCategory.specificationTemplate?.fields ?? []).map((field) =>
      typeof field === "string"
        ? field
        : typeof field === "object" && field !== null && "key" in field
          ? String(field.key)
          : "",
    ),
  );
  const specificationKeys = Object.keys(body.specifications);
  const invalidSpecification = specificationKeys.find(
    (key) => !templateKeys.has(key),
  );
  const invalidAttribute = body.attributeKeys.find(
    (key) => !templateKeys.has(key) || !(key in body.specifications),
  );

  if (invalidSpecification || invalidAttribute) {
    return c.json(
      {
        message: `Unknown template field: ${invalidSpecification ?? invalidAttribute}`,
      },
      400,
    );
  }

  const created = await db.transaction(async (tx) => {
    const [savedProduct] = await tx
      .insert(productTable)
      .values({
        name: body.name,
        slug: body.slug,
        sku: body.sku,
        brandId: body.brandId,
        categoryId: body.categoryId,
        description: body.description,
        price: body.price.toString(),
        discountPrice: body.discountPrice?.toString() ?? null,
        stock: body.stock,
        status: body.status,
      })
      .returning();

    await tx.insert(productSpecification).values({
      productId: savedProduct.id,
      specifications: body.specifications,
    });

    if (body.images.length) {
      await tx.insert(productImage).values(
        body.images.map((image, position) => ({
          productId: savedProduct.id,
          url: image.url,
          altText: image.altText ?? null,
          position,
        })),
      );
    }

    if (body.attributeKeys.length) {
      await tx.insert(productAttribute).values(
        body.attributeKeys.map((key) => ({
          productId: savedProduct.id,
          attributeName: `${savedCategory.attributePrefix}.${key}`,
          attributeValue: String(body.specifications[key]),
        })),
      );
    }

    return savedProduct;
  });

  return c.json(
    {
      id: created.id,
      name: created.name,
      slug: created.slug,
      sku: created.sku,
      brandId: created.brandId,
      categoryId: created.categoryId,
      status: created.status,
    },
    201,
  );
};

export async function getAdminProduct(c: Context) {
  const id = Number(c.req.param("id"));
  const savedProduct = await db.query.product.findFirst({
    where: eq(productTable.id, id),
    with: { brand: true, category: true, images: { orderBy: [asc(productImage.position)] }, specification: true, attributes: true },
  });
  if (!savedProduct) return c.json({ message: "Product not found" }, 404);

  return c.json({
    id: savedProduct.id, name: savedProduct.name, slug: savedProduct.slug, sku: savedProduct.sku,
    brandId: savedProduct.brandId, categoryId: savedProduct.categoryId, description: savedProduct.description,
    price: Number(savedProduct.price), discountPrice: savedProduct.discountPrice === null ? null : Number(savedProduct.discountPrice),
    stock: savedProduct.stock, status: savedProduct.status,
    images: savedProduct.images.map((image) => ({ url: image.url, altText: image.altText ?? "" })),
    specifications: savedProduct.specification?.specifications ?? {},
    attributeKeys: savedProduct.attributes.map((attribute) => attribute.attributeName.replace(`${savedProduct.category.attributePrefix}.`, "")),
  });
}

export async function updateAdminProduct(c: Context) {
  const id = Number(c.req.param("id"));
  const parsed = createCatalogProductSchema.safeParse(await c.req.json());
  if (!Number.isInteger(id) || id < 1) return c.json({ message: "Product not found" }, 404);
  if (!parsed.success) return c.json({ message: "Invalid product data" }, 400);
  const body = parsed.data;
  const savedCategory = await db.query.category.findFirst({ where: eq(category.id, body.categoryId) });
  if (!savedCategory) return c.json({ message: "Category not found" }, 400);

  const updated = await db.transaction(async (tx) => {
    const [record] = await tx.update(productTable).set({
      name: body.name, slug: body.slug, sku: body.sku, brandId: body.brandId, categoryId: body.categoryId,
      description: body.description, price: body.price.toString(), discountPrice: body.discountPrice?.toString() ?? null,
      stock: body.stock, status: body.status,
    }).where(eq(productTable.id, id)).returning();
    if (!record) return null;
    await tx.delete(productImage).where(eq(productImage.productId, id));
    await tx.delete(productSpecification).where(eq(productSpecification.productId, id));
    await tx.delete(productAttribute).where(eq(productAttribute.productId, id));
    if (body.images.length) await tx.insert(productImage).values(body.images.map((image, position) => ({ productId: id, url: image.url, altText: image.altText ?? null, position })));
    await tx.insert(productSpecification).values({ productId: id, specifications: body.specifications });
    if (body.attributeKeys.length) await tx.insert(productAttribute).values(body.attributeKeys.map((key) => ({ productId: id, attributeName: `${savedCategory.attributePrefix}.${key}`, attributeValue: String(body.specifications[key]) })));
    return record;
  });
  if (!updated) return c.json({ message: "Product not found" }, 404);
  return c.json({ id: updated.id, name: updated.name }, 200);
}

export const updateProduct: RouteHandler<typeof updateProductRoute> = (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  const existing = sampleProducts.find((p) => p.id === id);

  if (!existing) {
    return c.json({ message: "Product not found" }, 404);
  }

  return c.json({ ...existing, ...body }, 200);
};

export const deleteProduct: RouteHandler<typeof deleteProductRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId < 1) {
    return c.json({ message: "Product not found" }, 404);
  }

  const [deleted] = await db
    .delete(productTable)
    .where(eq(productTable.id, productId))
    .returning({ id: productTable.id });

  if (!deleted) return c.json({ message: "Product not found" }, 404);

  return c.json({ message: "Product deleted" }, 200);
};
