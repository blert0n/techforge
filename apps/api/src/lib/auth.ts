import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI } from "better-auth/plugins";
import { db } from "../db/client";
import { env } from "../config/env";
import * as schema from "../db/schema/index";
import {
  GUEST_CART_COOKIE,
  guestCartCookieOptions,
} from "../modules/cart/cart.constants";
import {
  isGuestCartToken,
  mergeGuestCartIntoUser,
} from "../modules/cart/cart.service";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.WEB_URL],
  emailAndPassword: {
    enabled: true,
  },
  user: {
    changeEmail: {
      enabled: true,
    },
  },
  advanced: {
    crossSubDomainCookies: {
      enabled: Boolean(env.COOKIE_DOMAIN),
      ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {}),
    },
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for"],
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const newSession = ctx.context.newSession;
      const guestToken = ctx.getCookie(GUEST_CART_COOKIE);
      if (
        !newSession ||
        !isGuestCartToken(guestToken) ||
        ctx.path.includes("impersonate")
      ) {
        return;
      }

      try {
        await mergeGuestCartIntoUser(guestToken, newSession.user.id);
        ctx.setCookie(GUEST_CART_COOKIE, "", {
          ...guestCartCookieOptions,
          maxAge: 0,
        });
      } catch (error) {
        console.error("Unable to merge guest cart after authentication", error);
      }
    }),
  },
  plugins: [openAPI(), admin()],
});
