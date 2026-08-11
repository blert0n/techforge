import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PendingReview } from "./types";

export function PendingReviews({
  onWrite,
  reviews,
}: {
  onWrite: (product: PendingReview) => void;
  reviews: PendingReview[];
}) {
  if (!reviews.length) return null;
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-3 border-b border-border p-6">
        <span className="size-2 rounded-full bg-orange-400" />
        <h2 className="text-lg font-bold uppercase">Awaiting Your Review</h2>
        <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-600">
          {reviews.length} products
        </span>
      </div>
      <div className="filter-scrollbar flex gap-4 overflow-x-auto p-6 pt-4">
        {reviews.map((review) => (
          <div
            key={review.productId}
            className="flex w-72 shrink-0 flex-col gap-3 rounded-lg border border-border p-4"
          >
            <div className="flex items-start gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                <Package className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  {review.category}
                </p>
                <p className="truncate font-medium">{review.product}</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>{review.purchasedAt}</p>
              <p>Order #{review.orderNumber}</p>
            </div>
            <Button type="button" size="sm" onClick={() => onWrite(review)}>
              Write review
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
