import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyOrder,
  getMyOrders,
  getAdminOrders,
  type AdminOrdersFilters,
  type MyOrdersFilters,
  updateOrderStatus,
} from "@/services/orders";

export const ordersQueryKey = ["orders"] as const;

export function useMyOrders(filters: MyOrdersFilters = {}) {
  return useQuery({
    queryKey: [...ordersQueryKey, filters],
    queryFn: () => getMyOrders(filters),
  });
}

export function useMyOrder(orderNumber: string) {
  return useQuery({
    queryKey: [...ordersQueryKey, orderNumber],
    queryFn: () => getMyOrder(orderNumber),
  });
}

export function useAdminOrders(filters: AdminOrdersFilters) {
  return useQuery({
    queryKey: [...ordersQueryKey, "admin", filters],
    queryFn: () => getAdminOrders(filters),
  });
}
export function useUpdateOrderStatus(orderNumber: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: Parameters<typeof updateOrderStatus>[1]) =>
      updateOrderStatus(orderNumber, status),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ordersQueryKey }),
  });
}
