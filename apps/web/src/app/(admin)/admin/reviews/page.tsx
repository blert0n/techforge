"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminReviews, useDeleteReview } from "@/hooks/use-reviews";

const PAGE_SIZE = 20;

export default function AdminReviewsPage() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState("all");
  const [productId, setProductId] = useState(
    searchParams.get("productId") ?? "",
  );
  const productFilter = Number(productId);
  const { data, isLoading } = useAdminReviews({
    page,
    pageSize: PAGE_SIZE,
    ...(rating === "all" ? {} : { rating: Number(rating) }),
    ...(Number.isInteger(productFilter) && productFilter > 0
      ? { productId: productFilter }
      : {}),
  });
  const reviews = data?.items ?? [];
  const pagination = data?.pagination;
  const deleteReview = useDeleteReview();

  async function removeReview(id: string) {
    if (!window.confirm("Delete this review? This cannot be undone.")) return;
    await deleteReview.mutateAsync(id);
  }
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold">Reviews</h1>
        <p className="text-sm text-muted-foreground">
          Moderate customer feedback across the catalog.
        </p>
      </header>
      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row">
          <Select
            value={rating}
            onValueChange={(value) => {
              setRating(value ?? "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="sm:w-44">
              <SelectValue>
                {rating === "all" ? "All ratings" : `${rating} stars`}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ratings</SelectItem>
              {[5, 4, 3, 2, 1].map((value) => (
                <SelectItem key={value} value={String(value)}>
                  {value} stars
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading reviews…</p>
        ) : reviews.length ? (
          <div className="divide-y divide-border">
            {reviews.map((review) => (
              <article key={review.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{review.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {review.product.category} · Product #{review.productId}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-right">
                    <div>
                      <p className="font-medium">{review.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      aria-label={`Delete review by ${review.author.name}`}
                      disabled={deleteReview.isPending}
                      onClick={() => void removeReview(review.id)}
                      size="icon-sm"
                      type="button"
                      variant="ghost"
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1 text-yellow-500">
                  {Array.from({ length: review.rating }, (_, index) => (
                    <Star key={index} className="size-4 fill-current" />
                  ))}
                  <span className="ml-2 text-xs font-semibold text-foreground">
                    {review.rating}.0
                  </span>
                </div>
                <h2 className="mt-3 font-semibold">{review.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {review.body}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Helpful: {review.helpfulUpvotes} yes ·{" "}
                  {review.helpfulDownvotes} no
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="p-12 text-center text-sm text-muted-foreground">
            No reviews match these filters.
          </p>
        )}
        {pagination && (
          <footer className="flex items-center justify-between border-t border-border p-4 text-sm text-muted-foreground">
            <p>
              Showing {reviews.length} of {pagination.total} reviews
            </p>
            <div className="flex gap-2">
              <Button
                size="icon-sm"
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => setPage(pagination.page - 1)}
              >
                <ChevronLeft />
              </Button>
              <span className="grid min-w-20 place-items-center">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                size="icon-sm"
                variant="outline"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPage(pagination.page + 1)}
              >
                <ChevronRight />
              </Button>
            </div>
          </footer>
        )}
      </section>
    </div>
  );
}
