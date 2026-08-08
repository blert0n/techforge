import { Box, Cpu, Keyboard, MemoryStick, Monitor } from "lucide-react";
import type { PendingReview, Review } from "./types";

export const pendingReviews: PendingReview[] = [
  {
    category: "CPU",
    product: "Intel Core i9-13900K Processor",
    details: "Purchased Oct 24, 2023 · Order #TF-89420-11",
    icon: Cpu,
  },
  {
    category: "Motherboard",
    product: "ASUS ROG Maximus Z790 Hero",
    details: "Purchased Oct 24, 2023 · Order #TF-89420-11",
    icon: Box,
  },
  {
    category: "Monitor",
    product: 'Samsung Odyssey G9 49" DQHD',
    details: "Purchased Sep 12, 2023 · Order #TF-77103-09",
    icon: Monitor,
  },
];
export const publishedReviews: Review[] = [
  {
    id: 1,
    category: "GPU",
    product: "NVIDIA GeForce RTX 4090 24GB Founders Edition",
    title: "Absolute Beast — Worth Every Penny",
    body: "Absolute monster of a GPU. Handles 4K gaming and AI workloads effortlessly. Ray tracing at max settings with no compromises.",
    rating: 5,
    date: "November 2, 2023",
    helpful: 47,
    tags: ["4K Gaming", "AI Workloads", "Ray Tracing"],
    icon: Cpu,
  },
  {
    id: 2,
    category: "RAM",
    product: "Corsair Dominator Platinum RGB 64GB DDR5-6000",
    title: "Perfect DDR5 Kit for High-End Builds",
    body: "Superb DDR5 kit. XMP profile loaded perfectly on first boot, hitting 6000MHz without any tweaking.",
    rating: 5,
    date: "October 5, 2023",
    helpful: 31,
    tags: ["DDR5", "XMP Profile", "RGB"],
    icon: MemoryStick,
  },
  {
    id: 3,
    category: "Peripheral",
    product: "Keychron Q1 Pro QMK Wireless Mechanical Keyboard",
    title: "Exceptional Build, Minor Software Quirks",
    body: "Outstanding build quality and a superb typing feel. Docked one star for the QMK configuration learning curve.",
    rating: 4,
    date: "September 18, 2023",
    helpful: 28,
    tags: ["Mechanical", "QMK", "Wireless"],
    icon: Keyboard,
  },
];
