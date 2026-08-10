import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
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
  storefrontProductListQuerySchema,
  storefrontProductListSchema,
  productSlugParamsSchema,
  storefrontProductDetailSchema,
  adminProductParamsSchema,
  editableProductSchema,
  productMediaResponseSchema,
  productMediaUploadSchema,
  productMediaUrlSchema,
} from "./products.schemas";
import {
  listProducts,
  getStorefrontProduct,
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
  request: { query: storefrontProductListQuerySchema },
  responses: {
    200: {
      content: { "application/json": { schema: storefrontProductListSchema } },
      description:
        "Active storefront products, optionally including a category's descendants",
    },
    404: {
      content: { "application/json": { schema: messageSchema } },
      description: "Category not found",
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

export const getStorefrontProductRoute = createRoute({
  method: "get",
  path: "/by-slug/{slug}",
  tags: ["Products"],
  request: { params: productSlugParamsSchema },
  responses: {
    200: {
      content: {
        "application/json": { schema: storefrontProductDetailSchema },
      },
      description: "An active storefront product",
    },
    404: {
      content: { "application/json": { schema: messageSchema } },
      description: "Product not found",
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

export const getAdminProductRoute = createRoute({
  method: "get",
  path: "/admin/{id}",
  tags: ["Products"],
  middleware: requireRole("admin"),
  request: { params: adminProductParamsSchema },
  responses: {
    200: {
      content: { "application/json": { schema: editableProductSchema } },
      description: "Product for editing",
    },
    404: {
      content: { "application/json": { schema: messageSchema } },
      description: "Product not found",
    },
  },
});

export const updateAdminProductRoute = createRoute({
  method: "put",
  path: "/admin/{id}",
  tags: ["Products"],
  middleware: requireRole("admin"),
  request: {
    params: adminProductParamsSchema,
    body: {
      content: { "application/json": { schema: createCatalogProductSchema } },
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({ id: z.number().int(), name: z.string() }),
        },
      },
      description: "Product updated",
    },
    400: {
      content: { "application/json": { schema: messageSchema } },
      description: "Invalid product data",
    },
    404: {
      content: { "application/json": { schema: messageSchema } },
      description: "Product not found",
    },
  },
});

export const uploadProductMediaRoute = createRoute({
  method: "post",
  path: "/media",
  tags: ["Products"],
  middleware: requireRole("admin"),
  request: {
    body: {
      content: {
        "application/json": { schema: productMediaUrlSchema },
        "multipart/form-data": { schema: productMediaUploadSchema },
      },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: productMediaResponseSchema } },
      description: "Image uploaded",
    },
    400: {
      content: { "application/json": { schema: messageSchema } },
      description: "Invalid image input",
    },
    502: {
      content: { "application/json": { schema: messageSchema } },
      description: "Image hosting error",
    },
    503: {
      content: { "application/json": { schema: messageSchema } },
      description: "Image hosting is not configured",
    },
  },
});

productsRouter.openapi(listProductsRoute, listProducts);
productsRouter.openapi(getStorefrontProductRoute, getStorefrontProduct);
productsRouter.openapi(listAdminProductsRoute, listAdminProducts);
productsRouter.openapi(getProductRoute, getProduct);
productsRouter.openapi(createProductRoute, createProduct);
productsRouter.openapi(updateProductRoute, updateProduct);
productsRouter.openapi(deleteProductRoute, deleteProduct);
productsRouter.openapi(getAdminProductRoute, getAdminProduct);
productsRouter.openapi(updateAdminProductRoute, updateAdminProduct);
productsRouter.openapi(uploadProductMediaRoute, uploadProductMedia);

export default productsRouter;
