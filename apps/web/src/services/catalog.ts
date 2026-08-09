import { apiClient } from "@/lib/api-client";
import type { paths } from "@/types/api";

export type CatalogCategory =
  paths["/api/catalog/categories"]["get"]["responses"][200]["content"]["application/json"][number];

export type SpecificationTemplateField = NonNullable<
  CatalogCategory["specificationTemplate"]
>["fields"][number];

export type CatalogBrand =
  paths["/api/catalog/brands"]["get"]["responses"][200]["content"]["application/json"][number];

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

export async function getCatalogCategories() {
  const { data, error } = await apiClient.GET("/api/catalog/categories");

  if (error || !data) {
    throw new Error("Failed to load catalog categories");
  }

  return data;
}

export async function updateSpecificationTemplate(
  categoryId: number,
  fields: SpecificationTemplateField[],
) {
  const { data, error } = await apiClient.PATCH(
    "/api/catalog/categories/{id}/specification-template",
    {
      params: { path: { id: categoryId } },
      body: { fields },
    },
  );

  if (error || !data) {
    throw new Error("Failed to save specification template");
  }

  return data;
}

export async function getCatalogBrands() {
  const { data, error } = await apiClient.GET("/api/catalog/brands");

  if (error || !data) {
    throw new Error("Failed to load catalog brands");
  }

  return data;
}

export async function createCatalogBrand(name: string) {
  const { data, error } = await apiClient.POST("/api/catalog/brands", {
    body: { name },
  });

  if (error || !data) {
    throw new Error(getErrorMessage(error, "Failed to create brand"));
  }

  return data;
}

export async function updateCatalogBrand(id: number, name: string) {
  const { data, error } = await apiClient.PATCH("/api/catalog/brands/{id}", {
    params: { path: { id } },
    body: { name },
  });

  if (error || !data) {
    throw new Error(getErrorMessage(error, "Failed to update brand"));
  }

  return data;
}

export async function deleteCatalogBrand(id: number) {
  const { error } = await apiClient.DELETE("/api/catalog/brands/{id}", {
    params: { path: { id } },
  });

  if (error) {
    throw new Error(getErrorMessage(error, "Failed to delete brand"));
  }
}

export type UpdateCatalogCategoryInput = NonNullable<
  paths["/api/catalog/categories/{id}"]["patch"]["requestBody"]
>["content"]["application/json"];

export async function updateCatalogCategory(
  id: number,
  values: UpdateCatalogCategoryInput,
) {
  const { data, error } = await apiClient.PATCH("/api/catalog/categories/{id}", {
    params: { path: { id } },
    body: values,
  });

  if (error || !data) throw new Error("Failed to update category");
  return data;
}

export async function deleteCatalogCategory(id: number) {
  const { error } = await apiClient.DELETE("/api/catalog/categories/{id}", {
    params: { path: { id } },
  });

  if (error) throw new Error("Failed to delete category");
}

export async function createCatalogCategory(values: UpdateCatalogCategoryInput) {
  const { data, error } = await apiClient.POST("/api/catalog/categories", { body: values });
  if (error || !data) throw new Error("Failed to create category");
  return data;
}
