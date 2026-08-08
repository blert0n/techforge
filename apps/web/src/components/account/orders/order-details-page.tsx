import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CircleCheck,
  CreditCard,
  MapPin,
  Package,
  Receipt,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OrderDetails } from "./order-details.data";

export default function OrderDetailsPage({ order }: { order: OrderDetails }) {
  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/account/orders"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Orders & Tracking
        </Link>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold uppercase">Order #{order.id}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed on {order.date}
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold uppercase text-emerald-600">
            <CircleCheck className="size-4" />
            {order.status}
          </span>
        </div>
      </header>
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <header className="flex flex-col justify-between gap-2 border-b border-border p-6 sm:flex-row sm:items-center">
          <h2 className="flex items-center gap-2 text-base font-bold uppercase">
            <Truck className="size-4 text-primary" />
            Shipment Tracking
          </h2>
          <p className="text-xs text-muted-foreground">
            Tracking #:{" "}
            <b className="text-foreground">{order.trackingNumber}</b>
          </p>
        </header>
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between rounded-lg bg-primary/5 p-4">
            <div>
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Estimated Delivery
              </p>
              <p className="mt-1 font-bold">{order.delivery}</p>
            </div>
            <Truck className="size-7 text-primary" />
          </div>
          <Progress />
          <div className="mt-6 space-y-3 border-t border-border pt-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Tracking History
            </h3>
            {order.history.map(([event, time], index) => (
              <div key={event} className="flex gap-3">
                <span
                  className={`mt-1.5 size-2 rounded-full ${index < 2 ? "bg-primary" : "bg-muted-foreground"}`}
                />
                <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:justify-between">
                  <p
                    className={
                      index < 2
                        ? "text-sm font-medium"
                        : "text-sm text-muted-foreground"
                    }
                  >
                    {event}
                  </p>
                  <time className="text-xs text-muted-foreground">{time}</time>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
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
                key={item.name}
                className="flex items-center justify-between gap-4 p-6"
              >
                <div>
                  <p className="text-xs font-semibold uppercase text-primary">
                    {item.brand}
                  </p>
                  <p className="mt-1 font-semibold">{item.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <b>{item.price}</b>
              </div>
            ))}
          </div>
        </section>
        <aside className="space-y-6">
          <AddressBlock
            icon={MapPin}
            title="Shipping Address"
            address={order.shipping}
          />
          <AddressBlock
            icon={CreditCard}
            title="Billing Address"
            address={order.billing}
          />
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase">
              <Receipt className="size-4 text-primary" />
              Order Summary
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              <Row label="Subtotal" value="$1,389.98" />
              <Row label="Shipping" value="Free" />
              <Row label="Tax" value="$9.65" />
              <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
                <span>Total</span>
                <span>{order.total}</span>
              </div>
            </div>
          </section>
        </aside>
      </div>
      <div className="flex justify-end">
        <Button type="button">
          <Receipt />
          Download invoice
        </Button>
      </div>
    </div>
  );
}
function Progress() {
  const steps = ["Order Placed", "Processing", "Shipped", "Delivered"];
  return (
    <div className="relative">
      <div className="absolute top-4 right-4 left-4 h-0.5 bg-border">
        <div className="h-full w-2/3 bg-primary" />
      </div>
      <div className="relative flex justify-between">
        {steps.map((step, index) => (
          <div
            key={step}
            className="flex w-1/4 flex-col items-center gap-2 text-center"
          >
            <span
              className={`grid size-8 place-items-center rounded-full border-2 ${index < 3 ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}
            >
              <Check className="size-3.5" />
            </span>
            <p
              className={`text-xs font-bold ${index < 3 ? "text-primary" : "text-muted-foreground"}`}
            >
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
function AddressBlock({
  icon: Icon,
  title,
  address,
}: {
  icon: typeof MapPin;
  title: string;
  address: {
    name: string;
    line1: string;
    line2: string;
    country: string;
    phone?: string;
  };
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-bold uppercase">
        <Icon className="size-4 text-primary" />
        {title}
      </h2>
      <div className="mt-4 space-y-1 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">{address.name}</p>
        <p>{address.line1}</p>
        <p>{address.line2}</p>
        <p>{address.country}</p>
        {address.phone && <p>{address.phone}</p>}
      </div>
    </section>
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
