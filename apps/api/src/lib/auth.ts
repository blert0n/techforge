import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, openAPI } from "better-auth/plugins";
import { db } from "../db/client";
import { env } from "../config/env";
import { isGuestToken } from "./guest-token";
import * as schema from "../db/schema/index";
import {
  GUEST_CART_COOKIE,
  guestCartCookieOptions,
} from "../modules/cart/cart.constants";
import { mergeGuestCartIntoUser } from "../modules/cart/cart.service";
import { GUEST_RECENTLY_VIEWED_COOKIE } from "../modules/recently-viewed/recently-viewed.constants";
import { mergeGuestRecentlyViewedProducts } from "../modules/recently-viewed/recently-viewed.service";

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
      if (!newSession || ctx.path.includes("impersonate")) return;

      const guestCartToken = ctx.getCookie(GUEST_CART_COOKIE);
      if (isGuestToken(guestCartToken)) {
        try {
          await mergeGuestCartIntoUser(guestCartToken, newSession.user.id);
          ctx.setCookie(GUEST_CART_COOKIE, "", {
            ...guestCartCookieOptions,
            maxAge: 0,
          });
        } catch (error) {
          console.error(
            "Unable to merge guest cart after authentication",
            error,
          );
        }
      }

      const guestRecentlyViewedToken = ctx.getCookie(
        GUEST_RECENTLY_VIEWED_COOKIE,
      );
      if (isGuestToken(guestRecentlyViewedToken)) {
        try {
          await mergeGuestRecentlyViewedProducts(
            guestRecentlyViewedToken,
            newSession.user.id,
          );
        } catch (error) {
          console.error(
            "Unable to merge recently viewed products after authentication",
            error,
          );
        }
      }
    }),
  },
  plugins: [openAPI(), admin()],
});
