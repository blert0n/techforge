import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { sql } from "drizzle-orm";
import { db } from "../../db/client.js";

export const healthRouter = new OpenAPIHono();

healthRouter.openapi(
  createRoute({
    method: "get",
    path: "/db",
    tags: ["Health"],
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.object({ database: z.enum(["up", "down"]) }),
          },
        },
        description: "Database connectivity check",
      },
    },
  }),
  async (c) => {
    const result = await db.execute(sql`select 1 as ok`);
    const row = result.rows[0] as { ok: number } | undefined;

    return c.json({
      database: row?.ok === 1 ? ("up" as const) : ("down" as const),
    });
  },
);

export default healthRouter;
