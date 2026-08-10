import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import type { AuthVariables } from "../../middleware/auth.middleware";
import { requireAuth } from "../../middleware/auth.middleware";
import { uploadUserAvatarMedia } from "../products/products.media.controller";
import {
  avatarUploadResponseSchema,
  avatarUploadSchema,
  usersMessageSchema,
} from "./users.schemas";

export const uploadAvatarRoute = createRoute({
  method: "post",
  path: "/avatar",
  tags: ["Users"],
  middleware: requireAuth,
  request: {
    body: {
      content: { "multipart/form-data": { schema: avatarUploadSchema } },
    },
  },
  responses: {
    201: {
      content: { "application/json": { schema: avatarUploadResponseSchema } },
      description: "Avatar uploaded",
    },
    400: {
      content: { "application/json": { schema: usersMessageSchema } },
      description: "Invalid image input",
    },
    401: {
      content: { "application/json": { schema: usersMessageSchema } },
      description: "Authentication is required",
    },
    502: {
      content: { "application/json": { schema: usersMessageSchema } },
      description: "Avatar upload failed",
    },
    503: {
      content: { "application/json": { schema: usersMessageSchema } },
      description: "Avatar storage is not configured",
    },
  },
});

export const usersRouter = new OpenAPIHono<{ Variables: AuthVariables }>();
usersRouter.openapi(uploadAvatarRoute, uploadUserAvatarMedia);
