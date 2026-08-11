"use client";

import { Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/account/reviews/star-rating";
import {
  useProductReviews,
  useVoteOnReviewHelpfulness,
} from "@/hooks/use-reviews";
import type { ProductReview } from "@/services/reviews";

export function ProductDetailTabs({
  productId,
  specifications,
  description,
}: {
  productId: number;
  specifications: { key: string; label: string; value: string }[];
  description: string;
}) {
  const { data: reviews = [] } = useProductReviews(productId);
  const vote = useVoteOnReviewHelpfulness(productId);
  return (
    <section className="border-t border-border pt-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <Tabs defaultValue="description">
          <TabsList variant="line" className="mb-6">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Technical specs</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description">
            <div className="whitespace-pre-line text-sm text-muted-foreground">
              {description}
            </div>
          </TabsContent>
          <TabsContent value="specifications">
            <div className="grid gap-x-8 md:grid-cols-2">
              {specifications.map((specification) => (
                <div
                  key={specification.key}
                  className="grid grid-cols-2 border-b border-border py-3 text-sm"
                >
                  <span className="text-muted-foreground">
                    {specification.label}
                  </span>
                  <span>{specification.value}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="reviews">
            {reviews.length ? (
              <div className="divide-y divide-border">
                {reviews.map((review) => (
                  <ProductReviewCard
                    key={review.id}
                    review={review}
                    onVote={(direction) =>
                      vote.mutate({ id: review.id, vote: direction })
                    }
                    voting={vote.isPending}
                  />
                ))}
              </div>
            ) : (
              <div className="flex min-h-48 flex-col items-center justify-center text-center">
                <Star className="mb-3 size-8 text-muted-foreground" />
                <p className="font-medium">No reviews yet</p>
                <p className="text-sm text-muted-foreground">
                  Be the first to review this product.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

function ProductReviewCard({
  review,
  onVote,
  voting,
}: {
  review: ProductReview;
  onVote: (vote: "up" | "down") => void;
  voting: boolean;
}) {
  const date = new Date(review.createdAt).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return (
    <article className="py-6 first:pt-0 last:pb-0">
      <div className="flex gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-full bg-muted font-semibold text-muted-foreground">
          {review.author.name.slice(0, 1).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="font-bold">{review.author.name}</p>
            <span className="text-xs text-muted-foreground">{date}</span>
          </div>
          <div className="my-2 flex items-center gap-2">
            <StarRating rating={review.rating} />
            <b className="text-xs">{review.rating}.0</b>
          </div>
          <h3 className="font-semibold">{review.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {review.body}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            <span>Was this helpful?</span>
            <Button
              variant="outline"
              size="sm"
              disabled={voting}
              onClick={() => onVote("up")}
            >
              <ThumbsUp /> Yes ({review.helpfulUpvotes})
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={voting}
              onClick={() => onVote("down")}
            >
              <ThumbsDown /> No ({review.helpfulDownvotes})
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
