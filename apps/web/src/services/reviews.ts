import { apiClient } from "@/lib/api-client";
import type { paths } from "@/types/api";

export type MyReview =
  paths["/api/reviews/my-reviews"]["get"]["responses"][200]["content"]["application/json"]["items"][number];
export type MyReviewsFilters = NonNullable<
  paths["/api/reviews/my-reviews"]["get"]["parameters"]["query"]
>;
export type PendingReviewProduct =
  paths["/api/reviews/pending-reviews"]["get"]["responses"][200]["content"]["application/json"][number];
export type ProductReview =
  paths["/api/reviews"]["get"]["responses"][200]["content"]["application/json"][number];
export type AdminReviewsFilters = NonNullable<
  paths["/api/reviews/admin"]["get"]["parameters"]["query"]
>;
export type CreateReviewInput = NonNullable<
  paths["/api/reviews"]["post"]["requestBody"]
>["content"]["application/json"];
export type UpdateReviewInput = NonNullable<
  paths["/api/reviews/{id}"]["patch"]["requestBody"]
>["content"]["application/json"];

function message(error: unknown, fallback: string) {
  return typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
    ? error.message
    : fallback;
}

export async function getMyReviews(filters: MyReviewsFilters = {}) {
  const { data, error } = await apiClient.GET("/api/reviews/my-reviews", {
    params: { query: filters },
  });
  if (error || !data) throw new Error(message(error, "Unable to load reviews"));
  return data;
}

export async function getPendingReviewProducts() {
  const { data, error } = await apiClient.GET("/api/reviews/pending-reviews");
  if (error || !data)
    throw new Error(message(error, "Unable to load pending reviews"));
  return data;
}

export async function getProductReviews(productId: number) {
  const { data, error } = await apiClient.GET("/api/reviews", {
    params: { query: { productId } },
  });
  if (error || !data)
    throw new Error(message(error, "Unable to load product reviews"));
  return data;
}

export async function getAdminReviews(filters: AdminReviewsFilters) {
  const { data, error } = await apiClient.GET("/api/reviews/admin", {
    params: { query: filters },
  });
  if (error || !data) throw new Error(message(error, "Unable to load reviews"));
  return data;
}

export async function voteOnReviewHelpfulness(id: string, vote: "up" | "down") {
  const { data, error } = await apiClient.POST(
    "/api/reviews/{id}/helpfulness",
    { params: { path: { id } }, body: { vote } },
  );
  if (error || !data) throw new Error(message(error, "Unable to vote"));
  return data;
}

export async function createReview(values: CreateReviewInput) {
  const { data, error } = await apiClient.POST("/api/reviews", {
    body: values,
  });
  if (error || !data)
    throw new Error(message(error, "Unable to submit review"));
  return data;
}

export async function updateReview(id: string, values: UpdateReviewInput) {
  const { data, error } = await apiClient.PATCH("/api/reviews/{id}", {
    params: { path: { id } },
    body: values,
  });
  if (error || !data)
    throw new Error(message(error, "Unable to update review"));
  return data;
}

export async function deleteReview(id: string) {
  const { error } = await apiClient.DELETE("/api/reviews/{id}", {
    params: { path: { id } },
  });
  if (error) throw new Error(message(error, "Unable to delete review"));
}
