import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  getProducts,
  updateProduct,
  type AdminProductFilters,
} from "../services/products";

const productsQueryKey = ["products"] as const;
const adminProductsQueryKey = ["products", "admin"] as const;

export function useProducts() {
  return useQuery({
    queryKey: productsQueryKey,
    queryFn: () => getProducts(),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productsQueryKey }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: Parameters<typeof updateProduct>[1] }) => updateProduct(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productsQueryKey }),
  });
}

export function useAdminProducts(filters: AdminProductFilters) {
  return useQuery({
    queryKey: [...adminProductsQueryKey, filters],
    queryFn: () => getAdminProducts(filters),
    placeholderData: keepPreviousData,
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: productsQueryKey }),
        queryClient.invalidateQueries({ queryKey: adminProductsQueryKey }),
      ]);
    },
  });
}
