import Link from "next/link";
import OrderImages from "./order-images";
import { recentOrder } from "../data/account.mock";

export default function RecentOrders() {
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
        <div className="rounded-lg border border-border p-4">
          <div className="flex flex-col gap-4 border-b border-border pb-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Order #{recentOrder.id}
              </p>

              <p className="text-sm font-medium">
                Placed on {recentOrder.placedAt}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                {recentOrder.status}
              </span>

              <span className="text-sm font-bold">{recentOrder.total}</span>
            </div>
          </div>

          <div className="flex flex-col gap-6 pt-4 md:flex-row">
            <OrderImages items={recentOrder.items} />

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-sm font-semibold">{recentOrder.title}</h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  {recentOrder.itemCount} items
                </p>
              </div>

              <div className="relative pt-2">
                <div className="mb-4 flex h-2 overflow-hidden rounded bg-muted">
                  <div
                    className="bg-primary"
                    style={{ width: `${recentOrder.progress}%` }}
                  />
                </div>

                <div className="flex justify-between px-1 text-xs font-medium text-muted-foreground">
                  <span className="text-primary">Ordered</span>
                  <span className="text-primary">Shipped</span>
                  <span>Delivered</span>
                </div>

                <p className="mt-3 text-xs font-medium">
                  <i className="fa-solid fa-truck-fast mr-2 text-primary" />
                  Arriving Tomorrow by 8 PM
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col justify-center gap-2">
              <Link
                href={`/account/orders/${recentOrder.id}/track`}
                className="rounded bg-primary px-4 py-2 text-center text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
              >
                Track Package
              </Link>

              <Link
                href={`/account/orders/${recentOrder.id}`}
                className="rounded border border-border px-4 py-2 text-center text-sm font-bold uppercase tracking-wider hover:bg-muted"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
