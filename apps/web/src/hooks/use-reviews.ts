import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReview,
  deleteReview,
  getMyReviews,
  getAdminReviews,
  getProductReviews,
  getPendingReviewProducts,
  type MyReviewsFilters,
  type AdminReviewsFilters,
  updateReview,
  voteOnReviewHelpfulness,
} from "@/services/reviews";

export const myReviewsQueryKey = ["reviews", "mine"] as const;
export const pendingReviewProductsQueryKey = ["reviews", "pending"] as const;

export function useMyReviews(filters: MyReviewsFilters = {}) {
  return useQuery({
    queryKey: [...myReviewsQueryKey, filters],
    queryFn: () => getMyReviews(filters),
  });
}

export function usePendingReviewProducts() {
  return useQuery({
    queryKey: pendingReviewProductsQueryKey,
    queryFn: getPendingReviewProducts,
  });
}

export function useProductReviews(productId: number) {
  return useQuery({
    queryKey: ["reviews", "product", productId],
    queryFn: () => getProductReviews(productId),
  });
}

export function useAdminReviews(filters: AdminReviewsFilters) {
  return useQuery({
    queryKey: ["reviews", "admin", filters],
    queryFn: () => getAdminReviews(filters),
  });
}

export function useVoteOnReviewHelpfulness(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, vote }: { id: string; vote: "up" | "down" }) =>
      voteOnReviewHelpfulness(id, vote),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["reviews", "product", productId],
      }),
  });
}

function useInvalidateReviews() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["reviews"] });
}

export function useCreateReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({ mutationFn: createReview, onSuccess: invalidate });
}

export function useUpdateReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: Parameters<typeof updateReview>[1];
    }) => updateReview(id, values),
    onSuccess: invalidate,
  });
}

export function useDeleteReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({ mutationFn: deleteReview, onSuccess: invalidate });
}
