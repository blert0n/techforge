import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Order } from "./types";
export function OrderHistory({ orders }: { orders: Order[] }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="text-base font-bold uppercase">Order History</h2>
        <span className="text-xs text-muted-foreground">
          Showing {orders.length} orders
        </span>
      </header>
      <div className="divide-y divide-border">
        {orders.map((order) => (
          <OrderRow key={order.id} order={order} />
        ))}
        {orders.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">
            No orders match your search.
          </p>
        )}
      </div>
      <footer className="flex items-center justify-between border-t border-border px-6 py-4">
        <p className="text-xs text-muted-foreground">
          Showing 1–{orders.length} of 13 orders
        </p>
        <div className="flex gap-1">
          <Button variant="outline" size="icon-sm">
            <ChevronLeft />
          </Button>
          <Button size="icon-sm">1</Button>
          <Button variant="outline" size="icon-sm">
            2
          </Button>
          <Button variant="outline" size="icon-sm">
            3
          </Button>
          <Button variant="outline" size="icon-sm">
            <ChevronRight />
          </Button>
        </div>
      </footer>
    </section>
  );
}
function OrderRow({ order }: { order: Order }) {
  const Icon = order.icon;
  const badge = {
    Delivered: "bg-emerald-500/10 text-emerald-600",
    Processing: "bg-amber-400/10 text-amber-600",
    "In Transit": "bg-blue-100 text-blue-600",
    Cancelled: "bg-destructive/10 text-destructive",
  }[order.status];
  const action =
    order.status === "Processing"
      ? "Cancel"
      : order.status === "Delivered"
        ? "Reorder"
        : "View";
  return (
    <article className="p-5 transition-colors hover:bg-muted/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <span className="grid size-12 place-items-center rounded-lg border border-border bg-muted text-muted-foreground">
            <Icon className="size-5" />
          </span>
          <div className="min-w-0">
            <div className="mb-0.5 flex items-center gap-2">
              <p className="text-xs font-bold uppercase text-muted-foreground">
                #{order.id}
              </p>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${badge}`}
              >
                {order.status}
              </span>
            </div>
            <p className="truncate text-sm font-semibold">{order.product}</p>
            <p className="text-xs text-muted-foreground">
              {order.itemCount} item{order.itemCount > 1 ? "s" : ""} ·{" "}
              {order.date}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <b
            className={
              order.status === "Cancelled"
                ? "text-muted-foreground line-through"
                : ""
            }
          >
            {order.total}
          </b>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm">
              View
            </Button>
            <Button
              type="button"
              variant={action === "Cancel" ? "destructive" : "outline"}
              size="sm"
            >
              {action}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
