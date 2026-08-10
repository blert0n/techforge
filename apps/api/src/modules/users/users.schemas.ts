import { z } from "@hono/zod-openapi";

export const avatarUploadSchema = z.object({ file: z.any() });
export const avatarUploadResponseSchema = z.object({ url: z.string().url() });
export const usersMessageSchema = z.object({ message: z.string() });
