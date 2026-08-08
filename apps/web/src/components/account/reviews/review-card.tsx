import { Edit3, ThumbsUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "./star-rating";
import type { Review } from "./types";
export function ReviewCard({
  review,
  onEdit,
}: {
  review: Review;
  onEdit: (review: Review) => void;
}) {
  const Icon = review.icon;
  return (
    <article className="p-6">
      <div className="flex gap-4">
        <div className="grid size-16 shrink-0 place-items-center rounded-xl border border-border bg-muted text-muted-foreground">
          <Icon className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                {review.category}
              </p>
              <h3 className="font-bold">{review.product}</h3>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => onEdit(review)}
              >
                <Edit3 />
                <span className="sr-only">Edit review</span>
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                className="text-destructive"
              >
                <Trash2 />
                <span className="sr-only">Delete review</span>
              </Button>
            </div>
          </div>
          <div className="my-3 flex flex-wrap items-center gap-2">
            <StarRating rating={review.rating} />
            <b className="text-xs">{review.rating}.0</b>
            <span className="text-xs text-muted-foreground">
              · {review.date}
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-600">
              Verified purchase
            </span>
          </div>
          <h4 className="font-semibold">{review.title}</h4>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {review.body}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {review.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4 flex gap-3 border-t border-border/60 pt-4 text-xs text-muted-foreground">
            <span>Was this helpful?</span>
            <span className="flex items-center gap-1 text-emerald-600">
              <ThumbsUp className="size-3.5" />
              {review.helpful} found this helpful
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
