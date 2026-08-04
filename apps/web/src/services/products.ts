import { apiClient } from "../lib/api-client";

export async function getProducts() {
  const { data, error } = await apiClient.GET("/api/products");

  if (error) {
    throw new Error("Failed to fetch products");
  }

  return data;
}
