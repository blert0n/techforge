import type { RouteHandler } from "@hono/zod-openapi";
import { getCookie, setCookie } from "hono/cookie";
import { auth } from "../../lib/auth";
import { createGuestToken, isGuestToken } from "../../lib/guest-token";
import {
  GUEST_RECENTLY_VIEWED_COOKIE,
  guestRecentlyViewedCookieOptions,
} from "./recently-viewed.constants";
import type {
  getRecentlyViewedProductsRoute,
  recordRecentlyViewedProductRoute,
} from "./recently-viewed.routes";
import {
  getRecentlyViewedProducts as getProducts,
  recordRecentlyViewedProduct as recordProduct,
} from "./recently-viewed.service";

export const getRecentlyViewedProducts: RouteHandler<
  typeof getRecentlyViewedProductsRoute
> = async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (session) {
    return c.json(
      { owner: "user", items: await getProducts({ userId: session.user.id }) },
      200,
    );
  }

  const guestToken = getCookie(c, GUEST_RECENTLY_VIEWED_COOKIE);
  return c.json(
    {
      owner: "guest",
      items: await getProducts({
        guestToken: isGuestToken(guestToken) ? guestToken : undefined,
      }),
    },
    200,
  );
};

export const recordRecentlyViewedProduct: RouteHandler<
  typeof recordRecentlyViewedProductRoute
> = async (c) => {
  const { productId } = c.req.valid("json");
  const cookieToken = getCookie(c, GUEST_RECENTLY_VIEWED_COOKIE);
  const guestToken = isGuestToken(cookieToken)
    ? cookieToken
    : createGuestToken();
  if (guestToken !== cookieToken) {
    setCookie(
      c,
      GUEST_RECENTLY_VIEWED_COOKIE,
      guestToken,
      guestRecentlyViewedCookieOptions,
    );
  }

  await recordProduct({ productId, guestToken });

  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (session) {
    await recordProduct({ productId, userId: session.user.id });
  }

  return c.body(null, 204);
};
