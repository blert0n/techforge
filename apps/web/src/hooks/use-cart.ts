import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addCartItem,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/services/cart";

export const cartQueryKey = ["cart"] as const;

export function useCart() {
  return useQuery({ queryKey: cartQueryKey, queryFn: getCart });
}

export function useAddCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCartItem,
    onSuccess: (cart) => queryClient.setQueryData(cartQueryKey, cart),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: number;
      quantity: number;
    }) => updateCartItem(productId, quantity),
    onSuccess: (cart) => queryClient.setQueryData(cartQueryKey, cart),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: (cart) => queryClient.setQueryData(cartQueryKey, cart),
  });
}
