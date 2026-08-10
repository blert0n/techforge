import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getWishlist,
  toggleWishlistProduct,
  type WishlistFilters,
} from "@/services/wishlist";

export const wishlistQueryKey = ["wishlist"] as const;

export function useWishlist(filters: WishlistFilters = {}) {
  return useQuery({
    queryKey: [...wishlistQueryKey, filters],
    queryFn: () => getWishlist(filters),
  });
}

export function useToggleWishlistProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleWishlistProduct,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: wishlistQueryKey }),
  });
}
