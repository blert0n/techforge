import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import {
  productSchema,
  adminProductListQuerySchema,
  adminProductListSchema,
  createProductSchema,
  createCatalogProductSchema,
  createdCatalogProductSchema,
  updateProductSchema,
  productParamsSchema,
  messageSchema,
} from "./products.schemas";
import {
  listProducts,
  listAdminProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductMedia,
  getAdminProduct,
  updateAdminProduct,
} from "./products.controller";
import { requireRole } from "../../middleware/auth.middleware";

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

export const listAdminProductsRoute = createRoute({
  method: "get",
  path: "/admin",
  tags: ["Products"],
  middleware: requireRole("admin"),
  request: { query: adminProductListQuerySchema },
  responses: {
    200: {
      content: {
        "application/json": { schema: adminProductListSchema },
      },
      description: "Products for catalog administration",
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
    body: {
      content: { "application/json": { schema: createCatalogProductSchema } },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: createdCatalogProductSchema } },
      description: "Product created",
    },
    400: {
      content: { "application/json": { schema: messageSchema } },
      description: "Invalid product data for the selected category template",
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
productsRouter.openapi(listAdminProductsRoute, listAdminProducts);
productsRouter.openapi(getProductRoute, getProduct);
productsRouter.openapi(createProductRoute, createProduct);
productsRouter.openapi(updateProductRoute, updateProduct);
productsRouter.openapi(deleteProductRoute, deleteProduct);
productsRouter.get("/admin/:id", requireRole("admin"), getAdminProduct);
productsRouter.put("/admin/:id", requireRole("admin"), updateAdminProduct);
productsRouter.post("/media", requireRole("admin"), uploadProductMedia);

export default productsRouter;
