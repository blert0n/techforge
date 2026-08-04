import type { RouteHandler } from "@hono/zod-openapi";
import type {
  listProductsRoute,
  getProductRoute,
  createProductRoute,
  updateProductRoute,
  deleteProductRoute,
} from "./products.routes.js";

// temporary in-memory data until the products table/DB access is wired up
const sampleProducts = [
  { id: "1", name: "RTX 4080", price: 999, category: "GPU" },
  { id: "2", name: "Ryzen 7 7800X3D", price: 379, category: "CPU" },
];

export const listProducts: RouteHandler<typeof listProductsRoute> = (c) => {
  return c.json(sampleProducts);
};

export const getProduct: RouteHandler<typeof getProductRoute> = (c) => {
  const { id } = c.req.valid("param");
  const product = sampleProducts.find((p) => p.id === id);

  if (!product) {
    return c.json({ message: "Product not found" }, 404);
  }

  return c.json(product, 200);
};

export const createProduct: RouteHandler<typeof createProductRoute> = (c) => {
  const body = c.req.valid("json");

  return c.json({ id: "stub-id", ...body }, 201);
};

export const updateProduct: RouteHandler<typeof updateProductRoute> = (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  const existing = sampleProducts.find((p) => p.id === id);

  if (!existing) {
    return c.json({ message: "Product not found" }, 404);
  }

  return c.json({ ...existing, ...body }, 200);
};

export const deleteProduct: RouteHandler<typeof deleteProductRoute> = (c) => {
  const { id } = c.req.valid("param");
  const existing = sampleProducts.find((p) => p.id === id);

  if (!existing) {
    return c.json({ message: "Product not found" }, 404);
  }

  return c.json({ message: "Product deleted" }, 200);
};
