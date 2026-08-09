export const GUEST_CART_COOKIE = "techforge_guest_cart";
export const GUEST_CART_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export const guestCartCookieOptions = {
  httpOnly: true,
  sameSite: "Lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: GUEST_CART_MAX_AGE_SECONDS,
};
