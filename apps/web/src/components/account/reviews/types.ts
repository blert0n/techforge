import type { LucideIcon } from "lucide-react";

export type Review = { id: number; category: string; product: string; title: string; body: string; rating: number; date: string; helpful: number; tags: string[]; icon: LucideIcon };
export type PendingReview = { category: string; product: string; details: string; icon: LucideIcon };
