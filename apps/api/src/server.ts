import { Hono } from "hono";
import type { Product } from "@techforge/types";

const app = new Hono();

app.get("/", (c) => {
  const sampleProduct: Product = {
    id: "1",
    name: "RTX 4080",
    price: 999,
    category: "GPU",
  };

  return c.json({
    message: "TechForge API is running",
    product: sampleProduct,
  });
});

export default app;
