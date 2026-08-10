"use client";

import Link from "next/link";
import { useMyOrders } from "@/hooks/use-orders";
import OrderImages from "./order-images";

function formatCurrency(value: string, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(Number(value));
}

export default function RecentOrders() {
  const { data } = useMyOrders({ pageSize: 1 });
  const order = data?.items[0];

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border p-6">
        <h2 className="text-xl font-bold uppercase tracking-wider">
          Recent Orders
        </h2>
        <Link
          href="/account/orders"
          className="text-sm font-medium text-primary hover:underline"
        >
          View All Orders
        </Link>
      </div>
      <div className="p-6">
        {!order ? (
          <p className="text-sm text-muted-foreground">
            You have not placed any orders yet.
          </p>
        ) : (
          <div className="rounded-lg border border-border p-4">
            <div className="flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Order #{order.orderNumber}
                </p>
                <p className="text-sm font-medium">
                  Placed on{" "}
                  {new Intl.DateTimeFormat(undefined, {
                    dateStyle: "medium",
                  }).format(new Date(order.placedAt))}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                  {order.status === "shipped" ? "In Transit" : order.status}
                </span>
                <span className="text-sm font-bold">
                  {formatCurrency(order.total, order.currency)}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-6 pt-4 md:flex-row">
              <OrderImages items={order.items} />
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold">
                    {order.items
                      .slice(0, 2)
                      .map((item) => item.productName)
                      .join(" & ")}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {order.itemCount} item{order.itemCount === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col justify-center gap-2">
                <Link
                  href={`/account/orders/${order.orderNumber}`}
                  className="rounded border border-border px-4 py-2 text-center text-sm font-bold uppercase tracking-wider hover:bg-muted"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
