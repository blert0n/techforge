import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import {
  productSchema,
  createProductSchema,
  updateProductSchema,
  productParamsSchema,
  messageSchema,
} from "./products.schemas.js";
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./products.controller";
import { requireRole } from "../../middleware/auth.middleware.js";

export const productsRouter = new OpenAPIHono();

export const listProductsRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Products"],
  responses: {
    200: {
      content: { "application/json": { schema: productSchema.array() } },
      description: "List all products",
    },
  },
});

export const getProductRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Products"],
  request: { params: productParamsSchema },
  responses: {
    200: {
      content: { "application/json": { schema: productSchema } },
      description: "A single product",
    },
    404: {
      content: { "application/json": { schema: messageSchema } },
      description: "Product not found",
    },
  },
});

export const createProductRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Products"],
  middleware: requireRole("admin"),
  request: {
    body: { content: { "application/json": { schema: createProductSchema } } },
  },
  responses: {
    201: {
      content: { "application/json": { schema: productSchema } },
      description: "Product created",
    },
  },
});

export const updateProductRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Products"],
  middleware: requireRole("admin"),
  request: {
    params: productParamsSchema,
    body: { content: { "application/json": { schema: updateProductSchema } } },
  },
  responses: {
    200: {
      content: { "application/json": { schema: productSchema } },
      description: "Product updated",
    },
    404: {
      content: { "application/json": { schema: messageSchema } },
      description: "Product not found",
    },
  },
});

export const deleteProductRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Products"],
  middleware: requireRole("admin"),
  request: { params: productParamsSchema },
  responses: {
    200: {
      content: { "application/json": { schema: messageSchema } },
      description: "Product deleted",
    },
    404: {
      content: { "application/json": { schema: messageSchema } },
      description: "Product not found",
    },
  },
});

productsRouter.openapi(listProductsRoute, listProducts);
productsRouter.openapi(getProductRoute, getProduct);
productsRouter.openapi(createProductRoute, createProduct);
productsRouter.openapi(updateProductRoute, updateProduct);
productsRouter.openapi(deleteProductRoute, deleteProduct);

export default productsRouter;
