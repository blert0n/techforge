import { Scalar } from "@scalar/hono-api-reference";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { basicAuth } from "hono/basic-auth";
import { auth } from "./lib/auth";
import { env } from "./config/env";
import { productsRouter } from "./modules/products/products.routes";
import { healthRouter } from "./modules/health/health.routes";
import { addressesRouter } from "./modules/addresses/addresses.routes";
import { catalogRouter } from "./modules/catalog/catalog.routes";
import { cartRouter } from "./modules/cart/cart.routes";
import { recentlyViewedRouter } from "./modules/recently-viewed/recently-viewed.routes";
import { reviewsRouter } from "./modules/reviews/reviews.routes";
import { paymentsRouter } from "./modules/payments/payments.routes";
import { handleStripeWebhook } from "./modules/payments/payments.webhook";
import { wishlistRouter } from "./modules/wishlist/wishlist.routes";
import { ordersRouter } from "./modules/orders/orders.routes";
import { usersRouter } from "./modules/users/users.routes";

export const app = new OpenAPIHono();

if (env.API_DOCS_USERNAME && env.API_DOCS_PASSWORD) {
  app.use(
    "/api/docs",
    basicAuth({
      username: env.API_DOCS_USERNAME,
      password: env.API_DOCS_PASSWORD,
    }),
  );
  app.use(
    "/openapi.json",
    basicAuth({
      username: env.API_DOCS_USERNAME,
      password: env.API_DOCS_PASSWORD,
    }),
  );
}

app.use(
  "/api/*",
  cors({
    origin: env.WEB_URL,
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));
app.post("/api/payments/stripe/webhook", (c) => handleStripeWebhook(c.req.raw));

app.route("/api/products", productsRouter);
app.route("/api/addresses", addressesRouter);
app.route("/api/catalog", catalogRouter);
app.route("/api/cart", cartRouter);
app.route("/api/recently-viewed", recentlyViewedRouter);
app.route("/api/reviews", reviewsRouter);
app.route("/api/payments", paymentsRouter);
app.route("/api/wishlist", wishlistRouter);
app.route("/api/orders", ordersRouter);
app.route("/api/users", usersRouter);
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
      { url: "/api/auth/open-api/generate-schema", title: "Auth" },
    ],
  }),
);

export default app;
