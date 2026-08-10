"use client";

import Link from "next/link";
import { ArrowLeft, CircleCheck, MapPin, Package, Receipt } from "lucide-react";
import { useMyOrder } from "@/hooks/use-orders";

function formatCurrency(value: string, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(Number(value));
}

export default function OrderDetailsPage({ orderId }: { orderId: string }) {
  const { data: order, isLoading, isError } = useMyOrder(orderId);

  if (isLoading) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Loading order...
      </p>
    );
  }
  if (isError || !order) {
    return (
      <p className="py-12 text-center text-sm text-destructive">
        Unable to load this order.
      </p>
    );
  }

  const address = order.shippingAddress;
  const statusLabel = order.status === "shipped" ? "In Transit" : order.status;
  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/account/orders"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Orders
        </Link>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold uppercase">
              Order #{order.orderNumber}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed on{" "}
              {new Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
              }).format(new Date(order.placedAt))}
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold uppercase text-emerald-600">
            <CircleCheck className="size-4" />
            {statusLabel}
          </span>
        </div>
      </header>
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <header className="border-b border-border p-6">
            <h2 className="flex items-center gap-2 text-base font-bold uppercase">
              <Package className="size-4 text-primary" />
              Order Items
            </h2>
          </header>
          <div className="divide-y divide-border">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 p-6"
              >
                <div>
                  <p className="text-xs font-semibold uppercase text-primary">
                    {item.sku}
                  </p>
                  <p className="mt-1 font-semibold">{item.productName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <b>{formatCurrency(item.lineTotal, order.currency)}</b>
              </div>
            ))}
          </div>
        </section>
        <aside className="space-y-6">
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase">
              <MapPin className="size-4 text-primary" />
              Shipping Address
            </h2>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">
                {address.firstName} {address.lastName}
              </p>
              <p>{address.line1}</p>
              {address.line2 && <p>{address.line2}</p>}
              <p>
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p>{address.country}</p>
              <p>{address.phone}</p>
            </div>
          </section>
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase">
              <Receipt className="size-4 text-primary" />
              Order Summary
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              <Row
                label="Subtotal"
                value={formatCurrency(order.subtotal, order.currency)}
              />
              <Row
                label="Shipping"
                value={formatCurrency(order.shippingTotal, order.currency)}
              />
              <Row
                label="Tax"
                value={formatCurrency(order.taxTotal, order.currency)}
              />
              {Number(order.discountTotal) > 0 && (
                <Row
                  label="Discount"
                  value={`-${formatCurrency(order.discountTotal, order.currency)}`}
                />
              )}
              <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
                <span>Total</span>
                <span>{formatCurrency(order.total, order.currency)}</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
