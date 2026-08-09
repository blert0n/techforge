import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().positive().default(3001),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url().default("http://localhost:3001"),
  WEB_URL: z.string().url().default("http://localhost:3000"),
  COOKIE_DOMAIN: z.string().min(1).optional(),
  API_DOCS_USERNAME: z.string().min(1).optional(),
  API_DOCS_PASSWORD: z.string().min(12).optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
}).refine(
  (value) => Boolean(value.API_DOCS_USERNAME) === Boolean(value.API_DOCS_PASSWORD),
  "API_DOCS_USERNAME and API_DOCS_PASSWORD must be set together",
);

export const env = envSchema.parse(process.env);
