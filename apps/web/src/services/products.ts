import { apiClient } from "../lib/api-client";
import type { paths } from "@/types/api";

export type CreateProductInput = NonNullable<
  paths["/api/products"]["post"]["requestBody"]
>["content"]["application/json"];

export type AdminProductsResponse =
  paths["/api/products/admin"]["get"]["responses"][200]["content"]["application/json"];

export type AdminProduct = AdminProductsResponse["items"][number];

export type AdminProductFilters = NonNullable<
  paths["/api/products/admin"]["get"]["parameters"]["query"]
>;

export type StorefrontProductsResponse =
  paths["/api/products"]["get"]["responses"][200]["content"]["application/json"];

export type StorefrontProductFilters = NonNullable<
  paths["/api/products"]["get"]["parameters"]["query"]
>;

export type StorefrontProduct = StorefrontProductsResponse["items"][number];

export type StorefrontProductDetail =
  paths["/api/products/by-slug/{slug}"]["get"]["responses"][200]["content"]["application/json"];

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
}

export async function getProducts(filters: StorefrontProductFilters = {}) {
  const { data, error } = await apiClient.GET("/api/products", {
    params: { query: filters },
  });

  if (error || !data) {
    return null;
  }

  return data;
}

export async function recordRecentlyViewedProduct(productId: number) {
  const { error } = await apiClient.POST("/api/recently-viewed", {
    body: { productId },
  });
  if (error) throw new Error("Unable to record recently viewed product");
  return true;
}

export type RecentlyViewedProductsResponse =
  paths["/api/recently-viewed"]["get"]["responses"][200]["content"]["application/json"];

export async function getRecentlyViewedProducts() {
  const { data, error } = await apiClient.GET("/api/recently-viewed");
  if (error || !data) {
    throw new Error(
      getErrorMessage(error, "Unable to load recently viewed products"),
    );
  }
  return data;
}

export async function getStorefrontProduct(slug: string) {
  const { data, error } = await apiClient.GET("/api/products/by-slug/{slug}", {
    params: { path: { slug } },
  });
  if (error || !data) return null;
  return data;
}

export async function createProduct(values: CreateProductInput) {
  const { data, error } = await apiClient.POST("/api/products", {
    body: values,
  });

  if (error || !data) {
    throw new Error("Failed to create product");
  }

  return data;
}

export async function getAdminProducts(filters: AdminProductFilters) {
  const { data, error } = await apiClient.GET("/api/products/admin", {
    params: { query: filters },
  });

  if (error || !data) {
    throw new Error(getErrorMessage(error, "Failed to load products"));
  }

  return data;
}

export async function deleteProduct(id: number) {
  const { error } = await apiClient.DELETE("/api/products/{id}", {
    params: { path: { id: id.toString() } },
  });

  if (error) {
    throw new Error(getErrorMessage(error, "Failed to delete product"));
  }
}

export async function uploadProductImage(source: string | File) {
  let response;
  if (typeof source === "string") {
    response = await apiClient.POST("/api/products/media", {
      body: { sourceUrl: source },
    });
  } else {
    const formData = new FormData();
    formData.set("file", source);
    response = await apiClient.POST("/api/products/media", {
      body: { file: source },
      bodySerializer: () => formData,
    });
  }

  if (response.error || !response.data) {
    throw new Error(
      getErrorMessage(response.error, "Unable to upload the image."),
    );
  }
  return response.data.url;
}

export type EditableProduct =
  paths["/api/products/admin/{id}"]["get"]["responses"][200]["content"]["application/json"];

export async function getEditableProduct(id: number) {
  const { data, error } = await apiClient.GET("/api/products/admin/{id}", {
    params: { path: { id } },
  });
  if (error || !data)
    throw new Error(getErrorMessage(error, "Failed to load product."));
  return data;
}

export async function updateProduct(id: number, values: CreateProductInput) {
  const { error } = await apiClient.PUT("/api/products/admin/{id}", {
    params: { path: { id } },
    body: values,
  });
  if (error)
    throw new Error(getErrorMessage(error, "Failed to update product."));
}
