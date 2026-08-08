import { Scalar } from "@scalar/hono-api-reference";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { auth } from "./lib/auth.js";
import { env } from "./config/env.js";
import { productsRouter } from "./modules/products/products.routes.js";
import { healthRouter } from "./modules/health/health.routes.js";
import { addressesRouter } from "./modules/addresses/addresses.routes.js";

export const app = new OpenAPIHono();

app.use(
  "/api/*",
  cors({
    origin: env.WEB_URL,
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.route("/api/products", productsRouter);
app.route("/api/addresses", addressesRouter);
app.route("/api/health", healthRouter);

app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: { title: "TechForge API", version: "1.0.0" },
});

app.get(
  "/api/docs",
  Scalar({
    pageTitle: "TechForge API Documentation",
    sources: [
      { url: "/openapi.json", title: "API" },
      // Better Auth's own generated schema (requires the openAPI() plugin in lib/auth.ts)
      { url: "/api/auth/open-api/generate-schema", title: "Auth" },
    ],
  }),
);

export default app;
