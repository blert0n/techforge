import type { LucideIcon } from "lucide-react";
export type OrderStatus =
  "Processing" | "In Transit" | "Delivered" | "Cancelled";
export type Order = {
  id: string;
  product: string;
  itemCount: number;
  date: string;
  total: string;
  status: OrderStatus;
  icon: LucideIcon;
};
