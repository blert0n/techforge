import { useQuery } from "@tanstack/react-query";
import {
  getMyOrder,
  getMyOrders,
  type MyOrdersFilters,
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
