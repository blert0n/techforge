import { apiClient } from "@/lib/api-client";
import type { paths } from "@/types/api";

export type Wishlist =
  paths["/api/wishlist"]["get"]["responses"][200]["content"]["application/json"];

export type WishlistToggleResult =
  paths["/api/wishlist/toggle"]["post"]["responses"][200]["content"]["application/json"];

export type WishlistFilters = NonNullable<
  paths["/api/wishlist"]["get"]["parameters"]["query"]
>;

function getErrorMessage(error: unknown, fallback: string) {
  return typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
    ? error.message
    : fallback;
}

export async function getWishlist(filters: WishlistFilters = {}) {
  const { data, error } = await apiClient.GET("/api/wishlist", {
    params: { query: filters },
  });
  if (error || !data) {
    throw new Error(getErrorMessage(error, "Unable to load wishlist"));
  }
  return data;
}

export async function toggleWishlistProduct(productId: number) {
  const { data, error } = await apiClient.POST("/api/wishlist/toggle", {
    body: { productId },
  });
  if (error || !data) {
    throw new Error(getErrorMessage(error, "Unable to update wishlist"));
  }
  return data;
}
