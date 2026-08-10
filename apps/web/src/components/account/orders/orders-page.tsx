"use client";

import { useEffect, useState } from "react";
import { Box, CheckCircle2, Clock3, Truck } from "lucide-react";
import { useMyOrders } from "@/hooks/use-orders";
import { OrderHistory } from "./order-history";
import { OrderSearch, type OrderFilters } from "./order-search";
import { OrderStats } from "./order-stats";
import type { Order, OrderStatus } from "./types";

const statusLabels = {
  pending: "Pending",
  processing: "Processing",
  shipped: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
} as const satisfies Record<string, OrderStatus>;

const statusIcons = {
  pending: Clock3,
  processing: Box,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: Box,
} as const;

export default function OrdersPage() {
  const [filters, setFilters] = useState<OrderFilters>({
    search: "",
    status: "all",
  });
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedSearch(filters.search.trim()),
      300,
    );
    return () => window.clearTimeout(timeout);
  }, [filters.search]);

  const { data, isError, isLoading } = useMyOrders({
    page,
    pageSize: 10,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(filters.status === "all" ? {} : { status: filters.status }),
  });
  const orders: Order[] = (data?.items ?? []).map((order) => ({
    id: order.orderNumber,
    product: order.items[0]?.productName ?? "Order items",
    itemCount: order.itemCount,
    date: new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
      new Date(order.placedAt),
    ),
    total: new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: order.currency,
    }).format(Number(order.total)),
    status: statusLabels[order.status],
    icon: statusIcons[order.status],
  }));

  return (
    <div className="min-w-0 space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase">Orders</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View, track, and manage all your orders in one place.
          </p>
        </div>
        <OrderSearch
          onChange={(nextFilters) => {
            setFilters(nextFilters);
            setPage(1);
          }}
        />
      </header>
      <OrderStats stats={data?.stats} />
      <OrderHistory
        orders={orders}
        pagination={data?.pagination}
        isLoading={isLoading}
        isError={isError}
        onPageChange={setPage}
      />
    </div>
  );
}
