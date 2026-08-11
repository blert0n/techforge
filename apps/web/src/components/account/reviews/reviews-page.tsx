"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewDialog } from "@/components/reviews/review-dialog";
import {
  useDeleteReview,
  useMyReviews,
  usePendingReviewProducts,
} from "@/hooks/use-reviews";
import { PendingReviews } from "./pending-reviews";
import { ReviewCard } from "./review-card";
import { ReviewsHeader } from "./reviews-header";
import { ReviewStats } from "./review-stats";
import type { PendingReview, Review } from "./types";

export default function ReviewsPage() {
  const [filter, setFilter] = useState<number | "all">("all");
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<PendingReview | null>(
    null,
  );
  const [editing, setEditing] = useState<Review | null>(null);
  const { data: reviewsResponse } = useMyReviews({
    page,
    pageSize: 10,
    ...(filter === "all" ? {} : { rating: filter }),
  });
  const { data: pendingReviewProducts = [] } = usePendingReviewProducts();
  const deleteReview = useDeleteReview();
  const reviews = useMemo<Review[]>(
    () =>
      (reviewsResponse?.items ?? []).map((review) => ({
        id: review.id,
        productId: review.productId,
        category: review.product.category,
        product: review.product.name,
        title: review.title,
        body: review.body,
        rating: review.rating,
        date: new Date(review.createdAt),
        helpful: review.helpfulUpvotes,
      })),
    [reviewsResponse],
  );
  const pending = useMemo<PendingReview[]>(
    () =>
      pendingReviewProducts.map((product) => ({
        productId: product.productId,
        category: product.category,
        product: product.productName,
        purchasedAt: `Purchased ${new Date(product.placedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`,
        orderNumber: product.orderNumber,
      })),
    [pendingReviewProducts],
  );
  const total = reviewsResponse?.stats.total ?? 0;
  const average = reviewsResponse?.stats.averageRating ?? 0;
  const helpful = reviewsResponse?.stats.helpfulVotes ?? 0;
  const totalPages = reviewsResponse?.pagination.totalPages ?? 0;
  return (
    <div className="space-y-8">
      <ReviewsHeader total={total} average={average} />
      <ReviewStats
        total={total}
        average={average}
        helpful={helpful}
        pending={pending.length}
      />
      <PendingReviews reviews={pending} onWrite={setSelectedProduct} />
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold uppercase">My Reviews</h2>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
              {total} published
            </span>
          </div>
          <div className="flex rounded-lg bg-muted p-1">
            {(["all", 5, 4, 3] as const).map((value) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={filter === value ? "secondary" : "ghost"}
                onClick={() => {
                  setFilter(value);
                  setPage(1);
                }}
              >
                {value === "all" ? "All" : `${value} ★`}
              </Button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-border">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onEdit={setEditing}
              onDelete={(id) => deleteReview.mutate(id)}
            />
          ))}
          {!reviews.length && (
            <p className="p-6 text-sm text-muted-foreground">
              You have not published any reviews yet.
            </p>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-border p-6 text-sm text-muted-foreground">
          <p>
            Showing {reviews.length} of {total} reviews
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page === 1}
              onClick={() => setPage((current) => current - 1)}
            >
              <ChevronLeft />
            </Button>
            <Button size="icon-sm">{page}</Button>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </section>
      {(selectedProduct || editing) && (
        <ReviewDialog
          product={
            selectedProduct
              ? { id: selectedProduct.productId, name: selectedProduct.product }
              : { id: editing!.productId, name: editing!.product }
          }
          review={editing ?? undefined}
          onClose={() => {
            setSelectedProduct(null);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
