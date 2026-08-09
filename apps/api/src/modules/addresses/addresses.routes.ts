import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import type { AuthVariables } from "../../middleware/auth.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import {
  createAddress,
  deleteAddress,
  getAddress,
  listAddresses,
  updateAddress,
} from "./addresses.controller";
import {
  addressParamsSchema,
  addressSchema,
  createAddressSchema,
  messageSchema,
  updateAddressSchema,
} from "./addresses.schemas";

export const addressesRouter = new OpenAPIHono<{ Variables: AuthVariables }>();

const unauthorizedResponse = {
  content: { "application/json": { schema: messageSchema } },
  description: "Authentication is required",
};

export const listAddressesRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Addresses"],
  middleware: requireAuth,
  responses: {
    200: {
      content: { "application/json": { schema: addressSchema.array() } },
      description: "The current user's saved addresses",
    },
    401: unauthorizedResponse,
  },
});

export const getAddressRoute = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["Addresses"],
  middleware: requireAuth,
  request: { params: addressParamsSchema },
  responses: {
    200: {
      content: { "application/json": { schema: addressSchema } },
      description: "A saved address",
    },
    401: unauthorizedResponse,
    404: {
      content: { "application/json": { schema: messageSchema } },
      description: "Address not found",
    },
  },
});

export const createAddressRoute = createRoute({
  method: "post",
  path: "/",
  tags: ["Addresses"],
  middleware: requireAuth,
  request: {
    body: { content: { "application/json": { schema: createAddressSchema } } },
  },
  responses: {
    201: {
      content: { "application/json": { schema: addressSchema } },
      description: "Address created",
    },
    401: unauthorizedResponse,
  },
});

export const updateAddressRoute = createRoute({
  method: "patch",
  path: "/{id}",
  tags: ["Addresses"],
  middleware: requireAuth,
  request: {
    params: addressParamsSchema,
    body: { content: { "application/json": { schema: updateAddressSchema } } },
  },
  responses: {
    200: {
      content: { "application/json": { schema: addressSchema } },
      description: "Address updated",
    },
    401: unauthorizedResponse,
    404: {
      content: { "application/json": { schema: messageSchema } },
      description: "Address not found",
    },
  },
});

export const deleteAddressRoute = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["Addresses"],
  middleware: requireAuth,
  request: { params: addressParamsSchema },
  responses: {
    200: {
      content: { "application/json": { schema: messageSchema } },
      description: "Address deleted",
    },
    401: unauthorizedResponse,
    404: {
      content: { "application/json": { schema: messageSchema } },
      description: "Address not found",
    },
  },
});

addressesRouter.openapi(listAddressesRoute, listAddresses);
addressesRouter.openapi(getAddressRoute, getAddress);
addressesRouter.openapi(createAddressRoute, createAddress);
addressesRouter.openapi(updateAddressRoute, updateAddress);
addressesRouter.openapi(deleteAddressRoute, deleteAddress);

export default addressesRouter;
