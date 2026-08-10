"use client";

import { useState } from "react";
import { PenLine, Star, StarHalf, ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReviewDialog } from "@/components/reviews/review-dialog";
import { TechnicalSpecifications } from "./technical-specifications";

export function ProductTabs() {
  const [tab, setTab] = useState("Technical Specs");
  const [writingReview, setWritingReview] = useState(false);
  const tabs = [
    "Technical Specs",
    "Description",
    "Reviews (128)",
    "Compatibility",
  ];
  return (
    <section id="reviews" className="border-t border-border pt-6">
      <div className="mb-8 flex gap-8 overflow-x-auto border-b border-border">
        {tabs.map((label) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            className={`rounded-none border-b-2 px-0 ${tab === label ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
            onClick={() => setTab(label)}
          >
            {label}
          </Button>
        ))}
      </div>
      {tab === "Technical Specs" ? (
        <TechnicalSpecifications />
      ) : tab === "Reviews (128)" ? (
        <Reviews onWrite={() => setWritingReview(true)} />
      ) : (
        <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
          {tab} information for the GeForce RTX 4090 Founders Edition.
        </div>
      )}
      {writingReview && (
        <ReviewDialog
          product="GeForce RTX 4090 Founders Edition 24GB GDDR6X"
          onClose={() => setWritingReview(false)}
        />
      )}
    </section>
  );
}
function Reviews({ onWrite }: { onWrite: () => void }) {
  const [filter, setFilter] = useState("All (128)");
  const filters = [
    "All (128)",
    "5★ (100)",
    "4★ (18)",
    "3★ (6)",
    "Critical (4)",
  ];
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-center">
        <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl border border-border bg-card p-8">
          <span className="text-7xl font-extrabold">4.8</span>
          <Stars size="size-5" />
          <span className="text-sm text-muted-foreground">
            Based on 128 reviews
          </span>
          <div className="w-full space-y-1.5">
            {[
              [5, 78],
              [4, 14],
              [3, 5],
              [2, 2],
              [1, 1],
            ].map(([rating, percent]) => (
              <div key={rating} className="flex items-center gap-2 text-xs">
                <span>{rating}</span>
                <Star className="size-3 fill-yellow-400 text-yellow-400" />
                <div className="h-2 flex-1 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-yellow-400"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span>{percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={filter === item ? "default" : "secondary"}
              className="rounded-full"
              onClick={() => setFilter(item)}
            >
              {item}
            </Button>
          ))}
        </div>
        <div className="flex gap-3">
          <Select defaultValue="Most Recent">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Most Recent">Most Recent</SelectItem>
              <SelectItem value="Most Helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={onWrite}>
            <PenLine />
            Write a Review
          </Button>
        </div>
      </div>
      <ReviewCard
        name="Alex M."
        title="Absolutely the best GPU on the market — worth every penny"
        helpful="84"
      />
      <ReviewCard
        name="Sarah K."
        title="Game-changer for 3D rendering and video production"
        helpful="61"
      />
      <Button variant="outline" className="mx-auto">
        Load More Reviews
      </Button>
    </div>
  );
}
function Stars({ size = "size-3" }: { size?: string }) {
  return (
    <div className="flex text-yellow-400">
      {[1, 2, 3, 4].map((item) => (
        <Star key={item} className={`${size} fill-current`} />
      ))}
      <StarHalf className={`${size} fill-current`} />
    </div>
  );
}
function ReviewCard({
  name,
  title,
  helpful,
}: {
  name: string;
  title: string;
  helpful: string;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-3 flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-muted font-semibold">
          {name[0]}
        </span>
        <div>
          <b className="text-sm">{name}</b>
          <div className="flex items-center gap-2">
            <Stars />
            <span className="text-xs text-muted-foreground">
              December 14, 2024
            </span>
          </div>
        </div>
      </div>
      <h3 className="mb-2 font-bold">{title}</h3>
      <p className="text-sm text-muted-foreground">
        Performance is exceptional for gaming and creative workloads. The card
        stays quiet under load and makes demanding 4K experiences feel
        effortless.
      </p>
      <div className="mt-4 flex gap-2">
        <Button variant="secondary" size="sm">
          <ThumbsUp />
          Yes ({helpful})
        </Button>
        <Button variant="secondary" size="sm">
          <ThumbsDown />
          No (3)
        </Button>
      </div>
    </article>
  );
}
