"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewCard } from "./review-card";
import { ReviewDialog } from "./review-dialog";
import { ReviewsHeader } from "./reviews-header";
import { publishedReviews } from "./reviews.data";
import { ReviewStats } from "./review-stats";
import { PendingReviews } from "./pending-reviews";
import type { Review } from "./types";

export default function ReviewsPage() { const [filter, setFilter] = useState<number | "all">("all"); const [selectedProduct, setSelectedProduct] = useState<string | null>(null); const [editing, setEditing] = useState<Review | null>(null); const visibleReviews = publishedReviews.filter((review) => filter === "all" || review.rating === filter); return <div className="space-y-8"><ReviewsHeader /><ReviewStats /><PendingReviews onWrite={setSelectedProduct} /><section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"><div className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><h2 className="text-lg font-bold uppercase">My Reviews</h2><span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">8 published</span></div><div className="flex rounded-lg bg-muted p-1">{(["all", 5, 4, 3] as const).map((value) => <Button key={value} type="button" size="sm" variant={filter === value ? "secondary" : "ghost"} onClick={() => setFilter(value)}>{value === "all" ? "All" : `${value} ★`}</Button>)}</div></div><div className="divide-y divide-border">{visibleReviews.map((review) => <ReviewCard key={review.id} review={review} onEdit={setEditing} />)}</div><div className="flex items-center justify-between border-t border-border p-6 text-sm text-muted-foreground"><p>Showing {visibleReviews.length} of 8 reviews</p><div className="flex gap-2"><Button variant="outline" size="icon-sm"><ChevronLeft /></Button><Button size="icon-sm">1</Button><Button variant="outline" size="icon-sm">2</Button><Button variant="outline" size="icon-sm"><ChevronRight /></Button></div></div></section>{(selectedProduct || editing) && <ReviewDialog product={selectedProduct ?? editing!.product} review={editing} onClose={() => { setSelectedProduct(null); setEditing(null); }} />}</div>; }
