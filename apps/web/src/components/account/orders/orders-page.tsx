"use client";
import { useState } from "react";
import { OrderHistory } from "./order-history";
import { ActiveOrder } from "./active-order";
import { orders } from "./orders.data";
import { OrderSearch } from "./order-search";
import { OrderStats } from "./order-stats";
import type { OrderStatus } from "./types";
export default function OrdersPage() {
  const [filters, setFilters] = useState<{
    search: string;
    status: "All Orders" | OrderStatus;
  }>({ search: "", status: "All Orders" });
  const visibleOrders = orders.filter(
    (order) =>
      (filters.status === "All Orders" || order.status === filters.status) &&
      `${order.id} ${order.product}`
        .toLowerCase()
        .includes(filters.search.toLowerCase()),
  );
  return (
    <div className="min-w-0 space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase">Orders & Tracking</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View, track, and manage all your orders in one place.
          </p>
        </div>
        <OrderSearch onChange={setFilters} />
      </header>
      <OrderStats />
      <ActiveOrder />
      <OrderHistory orders={visibleOrders} />
    </div>
  );
}
