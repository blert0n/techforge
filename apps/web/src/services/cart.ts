import { apiClient } from "@/lib/api-client";
import type { paths } from "@/types/api";

export type Cart =
  paths["/api/cart"]["get"]["responses"][200]["content"]["application/json"];

function errorMessage(error: unknown, fallback: string) {
  return typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
    ? error.message
    : fallback;
}

export async function getCart() {
  const { data, error } = await apiClient.GET("/api/cart");
  if (error || !data)
    throw new Error(errorMessage(error, "Unable to load cart"));
  return data;
}

export async function addCartItem({
  productId,
  quantity = 1,
}: {
  productId: number;
  quantity?: number;
}) {
  const { data, error } = await apiClient.POST("/api/cart/items", {
    body: { productId, quantity },
  });
  if (error || !data)
    throw new Error(errorMessage(error, "Unable to add item to cart"));
  return data;
}

export async function updateCartItem(productId: number, quantity: number) {
  const { data, error } = await apiClient.PATCH("/api/cart/items/{productId}", {
    params: { path: { productId } },
    body: { quantity },
  });
  if (error || !data)
    throw new Error(errorMessage(error, "Unable to update cart item"));
  return data;
}

export async function removeCartItem(productId: number) {
  const { data, error } = await apiClient.DELETE(
    "/api/cart/items/{productId}",
    {
      params: { path: { productId } },
    },
  );
  if (error || !data)
    throw new Error(errorMessage(error, "Unable to remove cart item"));
  return data;
}
