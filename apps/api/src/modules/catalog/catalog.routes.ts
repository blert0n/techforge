import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import type { AuthVariables } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/auth.middleware";
import {
  createCatalogBrand,
  createCatalogCategory,
  deleteCatalogBrand,
  deleteCatalogCategory,
  listCatalogBrands,
  listCatalogCategories,
  updateCategorySpecificationTemplate,
  updateCatalogBrand,
  updateCatalogCategory,
} from "./catalog.controller";
import {
  brandSchema,
  categoryParamsSchema,
  categoryWithTemplateSchema,
  createBrandSchema,
  createCatalogCategorySchema,
  messageSchema,
  updateSpecificationTemplateSchema,
  updateBrandSchema,
  updateCatalogCategorySchema,
} from "./catalog.schemas";

export const catalogRouter = new OpenAPIHono<{ Variables: AuthVariables }>();

const unauthorizedResponse = {
  content: { "application/json": { schema: messageSchema } },
  description: "Authentication is required",
};

const forbiddenResponse = {
  content: { "application/json": { schema: messageSchema } },
  description: "Administrator access is required",
};

export const listCatalogCategoriesRoute = createRoute({
  method: "get",
  path: "/categories",
  tags: ["Catalog"],
  middleware: requireRole("admin"),
  responses: {
    200: {
      content: {
        "application/json": { schema: categoryWithTemplateSchema.array() },
      },
      description: "Categories with their specification templates",
    },
    401: unauthorizedResponse,
    403: forbiddenResponse,
  },
});

export const createCatalogCategoryRoute = createRoute({
  method: "post", path: "/categories", tags: ["Catalog"], middleware: requireRole("admin"),
  request: { body: { content: { "application/json": { schema: createCatalogCategorySchema } } } },
  responses: { 201: { content: { "application/json": { schema: categoryWithTemplateSchema } }, description: "Category created" }, 401: unauthorizedResponse, 403: forbiddenResponse },
});

export const listCatalogBrandsRoute = createRoute({
  method: "get",
  path: "/brands",
  tags: ["Catalog"],
  middleware: requireRole("admin"),
  responses: {
    200: {
      content: { "application/json": { schema: brandSchema.array() } },
      description: "Catalog brands",
    },
    401: unauthorizedResponse,
    403: forbiddenResponse,
  },
});

export const createCatalogBrandRoute = createRoute({
  method: "post",
  path: "/brands",
  tags: ["Catalog"],
  middleware: requireRole("admin"),
  request: {
    body: { content: { "application/json": { schema: createBrandSchema } } },
  },
  responses: {
    201: {
      content: { "application/json": { schema: brandSchema } },
      description: "Brand created",
    },
    401: unauthorizedResponse,
    403: forbiddenResponse,
    409: {
      content: { "application/json": { schema: messageSchema } },
      description: "A brand with this name already exists",
    },
  },
});

export const updateCatalogBrandRoute = createRoute({
  method: "patch",
  path: "/brands/{id}",
  tags: ["Catalog"],
  middleware: requireRole("admin"),
  request: {
    params: categoryParamsSchema,
    body: { content: { "application/json": { schema: updateBrandSchema } } },
  },
  responses: {
    200: {
      content: { "application/json": { schema: brandSchema } },
      description: "Brand updated",
    },
    401: unauthorizedResponse,
    403: forbiddenResponse,
    404: {
      content: { "application/json": { schema: messageSchema } },
      description: "Brand not found",
    },
    409: {
      content: { "application/json": { schema: messageSchema } },
      description: "A brand with this name already exists",
    },
  },
});

export const deleteCatalogBrandRoute = createRoute({
  method: "delete",
  path: "/brands/{id}",
  tags: ["Catalog"],
  middleware: requireRole("admin"),
  request: { params: categoryParamsSchema },
  responses: {
    200: {
      content: { "application/json": { schema: messageSchema } },
      description: "Brand deleted",
    },
    401: unauthorizedResponse,
    403: forbiddenResponse,
    404: {
      content: { "application/json": { schema: messageSchema } },
      description: "Brand not found",
    },
    409: {
      content: { "application/json": { schema: messageSchema } },
      description: "Brand is in use by products",
    },
  },
});

export const updateCategorySpecificationTemplateRoute = createRoute({
  method: "patch",
  path: "/categories/{id}/specification-template",
  tags: ["Catalog"],
  middleware: requireRole("admin"),
  request: {
    params: categoryParamsSchema,
    body: {
      content: {
        "application/json": { schema: updateSpecificationTemplateSchema },
      },
    },
  },
  responses: {
    200: {
      content: { "application/json": { schema: categoryWithTemplateSchema } },
      description:
        "Category with its created or updated specification template",
    },
    401: unauthorizedResponse,
    403: forbiddenResponse,
    404: {
      content: { "application/json": { schema: messageSchema } },
      description: "Category not found",
    },
  },
});

export const updateCatalogCategoryRoute = createRoute({
  method: "patch",
  path: "/categories/{id}",
  tags: ["Catalog"],
  middleware: requireRole("admin"),
  request: {
    params: categoryParamsSchema,
    body: { content: { "application/json": { schema: updateCatalogCategorySchema } } },
  },
  responses: {
    200: {
      content: { "application/json": { schema: categoryWithTemplateSchema } },
      description: "Category updated",
    },
    401: unauthorizedResponse,
    403: forbiddenResponse,
    404: { content: { "application/json": { schema: messageSchema } }, description: "Category not found" },
  },
});

export const deleteCatalogCategoryRoute = createRoute({
  method: "delete",
  path: "/categories/{id}",
  tags: ["Catalog"],
  middleware: requireRole("admin"),
  request: { params: categoryParamsSchema },
  responses: {
    200: {
      content: { "application/json": { schema: messageSchema } },
      description: "Category deleted",
    },
    401: unauthorizedResponse,
    403: forbiddenResponse,
    404: { content: { "application/json": { schema: messageSchema } }, description: "Category not found" },
    409: { content: { "application/json": { schema: messageSchema } }, description: "Category is in use by products" },
  },
});

catalogRouter.openapi(listCatalogCategoriesRoute, listCatalogCategories);
catalogRouter.openapi(createCatalogCategoryRoute, createCatalogCategory);
catalogRouter.openapi(updateCatalogCategoryRoute, updateCatalogCategory);
catalogRouter.openapi(deleteCatalogCategoryRoute, deleteCatalogCategory);
catalogRouter.openapi(listCatalogBrandsRoute, listCatalogBrands);
catalogRouter.openapi(createCatalogBrandRoute, createCatalogBrand);
catalogRouter.openapi(updateCatalogBrandRoute, updateCatalogBrand);
catalogRouter.openapi(deleteCatalogBrandRoute, deleteCatalogBrand);
catalogRouter.openapi(
  updateCategorySpecificationTemplateRoute,
  updateCategorySpecificationTemplate,
);

export default catalogRouter;
