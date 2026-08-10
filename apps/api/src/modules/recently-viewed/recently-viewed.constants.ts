export const GUEST_RECENTLY_VIEWED_COOKIE = "techforge_recently_viewed";
export const GUEST_RECENTLY_VIEWED_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export const guestRecentlyViewedCookieOptions = {
  httpOnly: true,
  sameSite: "Lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: GUEST_RECENTLY_VIEWED_MAX_AGE_SECONDS,
};
