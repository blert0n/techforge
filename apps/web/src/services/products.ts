import { apiClient } from "../lib/api-client";
import type { paths } from "@/types/api";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type CreateProductInput =
  NonNullable<
    paths["/api/products"]["post"]["requestBody"]
  >["content"]["application/json"];

export type AdminProductsResponse =
  paths["/api/products/admin"]["get"]["responses"][200]["content"]["application/json"];

export type AdminProduct = AdminProductsResponse["items"][number];

export type AdminProductFilters = NonNullable<
  paths["/api/products/admin"]["get"]["parameters"]["query"]
>;

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

export async function getProducts() {
  const { data, error } = await apiClient.GET("/api/products");

  if (error) {
    throw new Error("Failed to fetch products");
  }

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
  const formData = new FormData();
  if (source instanceof File) formData.set("file", source);

  const response = await fetch(`${apiBaseUrl}/api/products/media`, {
    method: "POST",
    credentials: "include",
    headers: typeof source === "string" ? { "Content-Type": "application/json" } : undefined,
    body: typeof source === "string" ? JSON.stringify({ sourceUrl: source }) : formData,
  });
  const payload = (await response.json()) as { url?: string; message?: string };

  if (!response.ok || !payload.url) {
    throw new Error(payload.message ?? "Unable to upload the image.");
  }

  return payload.url;
}

export type EditableProduct = {
  id: number; name: string; slug: string; sku: string; brandId: number; categoryId: number;
  description: string; price: number; discountPrice: number | null; stock: number; status: "draft" | "active";
  images: { url: string; altText: string }[]; specifications: Record<string, string | number | boolean>; attributeKeys: string[];
};

export async function getEditableProduct(id: number) {
  const response = await fetch(`${apiBaseUrl}/api/products/admin/${id}`, { credentials: "include" });
  const payload = (await response.json()) as EditableProduct & { message?: string };
  if (!response.ok) throw new Error(payload.message ?? "Failed to load product.");
  return payload;
}

export async function updateProduct(id: number, values: CreateProductInput) {
  const response = await fetch(`${apiBaseUrl}/api/products/admin/${id}`, {
    method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values),
  });
  const payload = (await response.json()) as { message?: string };
  if (!response.ok) throw new Error(payload.message ?? "Failed to update product.");
}
