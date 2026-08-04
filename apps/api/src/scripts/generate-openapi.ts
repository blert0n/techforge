import { writeFileSync } from "node:fs";
import { app } from "../app.js";

const doc = app.getOpenAPIDocument({
  openapi: "3.0.0",
  info: { title: "TechForge API", version: "1.0.0" },
});

writeFileSync("openapi.json", JSON.stringify(doc, null, 2));
console.log("Wrote openapi.json");
