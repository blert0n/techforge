import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCatalogBrand,
  createCatalogCategory,
  deleteCatalogBrand,
  deleteCatalogCategory,
  getCatalogBrands,
  getCatalogCategories,
  updateSpecificationTemplate,
  updateCatalogBrand,
  updateCatalogCategory,
  type UpdateCatalogCategoryInput,
  type SpecificationTemplateField,
} from "@/services/catalog";

export const catalogCategoriesQueryKey = ["catalog", "categories"] as const;
export const catalogBrandsQueryKey = ["catalog", "brands"] as const;

export function useCatalogCategories() {
  return useQuery({
    queryKey: catalogCategoriesQueryKey,
    queryFn: getCatalogCategories,
  });
}

export function useUpdateSpecificationTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      categoryId,
      fields,
    }: {
      categoryId: number;
      fields: SpecificationTemplateField[];
    }) => updateSpecificationTemplate(categoryId, fields),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: catalogCategoriesQueryKey }),
  });
}

export function useCatalogBrands() {
  return useQuery({
    queryKey: catalogBrandsQueryKey,
    queryFn: getCatalogBrands,
  });
}

export function useCreateCatalogBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCatalogBrand,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: catalogBrandsQueryKey }),
  });
}

export function useUpdateCatalogBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateCatalogBrand(id, name),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: catalogBrandsQueryKey }),
  });
}

export function useDeleteCatalogBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCatalogBrand,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: catalogBrandsQueryKey }),
  });
}

export function useUpdateCatalogCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: UpdateCatalogCategoryInput }) =>
      updateCatalogCategory(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: catalogCategoriesQueryKey }),
  });
}

export function useDeleteCatalogCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCatalogCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: catalogCategoriesQueryKey }),
  });
}

export function useCreateCatalogCategory() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: createCatalogCategory, onSuccess: () => queryClient.invalidateQueries({ queryKey: catalogCategoriesQueryKey }) });
}
