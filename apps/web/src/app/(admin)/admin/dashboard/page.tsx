"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminDashboard } from "@/hooks/use-dashboard";
import {
  AlertTriangle,
  ArrowRight,
  CircleDollarSign,
  MoreHorizontal,
  ShoppingCart,
  Users,
} from "lucide-react";
import Link from "next/link";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const avatarClassNames = [
  "bg-primary/15 text-primary",
  "bg-violet-100 text-violet-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
];

const statusClassNames = {
  pending: "border-amber-200 bg-amber-100 text-amber-800",
  processing: "border-blue-200 bg-blue-100 text-blue-800",
  shipped: "border-violet-200 bg-violet-100 text-violet-800",
  delivered: "border-emerald-200 bg-emerald-100 text-emerald-800",
  cancelled: "border-destructive/30 bg-destructive/10 text-destructive",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function AdminDashboardPage() {
  const { data } = useAdminDashboard();
  const metrics = [
    {
      label: "Total Revenue",
      value: currencyFormatter.format(Number(data?.metrics.totalRevenue ?? 0)),
      icon: CircleDollarSign,
      href: "/admin/orders",
      linkLabel: "Review revenue",
      iconClassName: "bg-primary/10 text-primary",
    },
    {
      label: "Total Orders",
      value: (data?.metrics.totalOrders ?? 0).toLocaleString(),
      icon: ShoppingCart,
      href: "/admin/orders",
      linkLabel: "Review orders",
      iconClassName: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Active Customers",
      value: (data?.metrics.activeCustomers ?? 0).toLocaleString(),
      icon: Users,
      href: "/admin/customers",
      linkLabel: "Review customers",
      iconClassName: "bg-violet-500/10 text-violet-600",
    },
  ];
  const orders = data?.recentOrders ?? [];

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Dashboard Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor your store&apos;s performance and activity.
          </p>
        </div>
      </header>

      <section
        aria-label="Store metrics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <article
              key={metric.label}
              className="flex min-h-40 flex-col rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {metric.value}
                  </p>
                </div>
                <span
                  className={`flex size-10 items-center justify-center rounded-full ${metric.iconClassName}`}
                >
                  <Icon className="size-5" />
                </span>
              </div>
              <Link
                href={metric.href}
                className="mt-auto flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                {metric.linkLabel} <ArrowRight className="size-3.5" />
              </Link>
            </article>
          );
        })}

        <article className="flex min-h-40 flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Low Stock Items
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {data?.metrics.lowStockItems ?? 0}
              </p>
            </div>
            <span className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </span>
          </div>
          <Link
            href="/admin/products"
            className="mt-auto flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Review inventory <ArrowRight className="size-3.5" />
          </Link>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="text-lg font-bold text-foreground">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm font-medium text-primary hover:underline"
          >
            View all orders
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order, index) => (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${avatarClassNames[index % avatarClassNames.length]}`}
                      >
                        {getInitials(order.customerName)}
                      </span>
                      {order.customerName}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                    {new Date(order.placedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: order.currency,
                    }).format(Number(order.total))}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={statusClassNames[order.status]}
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      aria-label={`Actions for ${order.orderNumber}`}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <MoreHorizontal />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
