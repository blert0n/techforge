import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { auth } from "../lib/auth";

export type AuthUser = typeof auth.$Infer.Session.user;
export type AuthSession = typeof auth.$Infer.Session.session;

export type AuthVariables = {
  user: AuthUser;
  session: AuthSession;
};

/** Rejects the request with 401 unless a valid Better Auth session cookie is present. */
export const requireAuth = createMiddleware<{ Variables: AuthVariables }>(
  async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    c.set("user", session.user);
    c.set("session", session.session);

    await next();
  },
);

/** Rejects with 401 if unauthenticated, or 403 if the session's user role isn't in `roles`. */
export const requireRole = (...roles: string[]) =>
  createMiddleware<{ Variables: AuthVariables }>(async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    if (!roles.includes(session.user.role)) {
      throw new HTTPException(403, { message: "Forbidden" });
    }

    c.set("user", session.user);
    c.set("session", session.session);

    await next();
  });
