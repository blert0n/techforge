import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

import type { AuthVariables } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/auth.middleware";
import { getAdminDashboard } from "./dashboard.controller";
import { adminDashboardSchema } from "./dashboard.schemas";

export const getAdminDashboardRoute = createRoute({
  method: "get",
  path: "/admin",
  tags: ["Dashboard"],
  middleware: requireRole("admin"),
  responses: {
    200: {
      content: { "application/json": { schema: adminDashboardSchema } },
      description: "Summary metrics and recent orders for administration",
    },
  },
});

export const dashboardRouter = new OpenAPIHono<{ Variables: AuthVariables }>();
dashboardRouter.openapi(getAdminDashboardRoute, getAdminDashboard);
