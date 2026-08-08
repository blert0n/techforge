import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  ArrowRight,
  CircleDollarSign,
  Download,
  MoreHorizontal,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

const metrics = [
  {
    label: "Total Revenue",
    value: "$124,563.00",
    change: "+12.5%",
    icon: CircleDollarSign,
    iconClassName: "bg-primary/10 text-primary",
  },
  {
    label: "Total Orders",
    value: "1,234",
    change: "+8.2%",
    icon: ShoppingCart,
    iconClassName: "bg-blue-500/10 text-blue-600",
  },
  {
    label: "Active Customers",
    value: "8,432",
    change: "+14.1%",
    icon: Users,
    iconClassName: "bg-violet-500/10 text-violet-600",
  },
];

const orders = [
  {
    id: "#ORD-0921",
    customer: "Alex Smith",
    initials: "AS",
    date: "Today, 10:45 AM",
    total: "$1,262.58",
    status: "Processing",
    avatarClassName: "bg-primary/15 text-primary",
    statusClassName: "border-blue-200 bg-blue-100 text-blue-800",
  },
  {
    id: "#ORD-0920",
    customer: "Jane Doe",
    initials: "JD",
    date: "Today, 09:12 AM",
    total: "$450.00",
    status: "Shipped",
    avatarClassName: "bg-violet-100 text-violet-700",
    statusClassName: "border-emerald-200 bg-emerald-100 text-emerald-800",
  },
  {
    id: "#ORD-0919",
    customer: "Michael Ross",
    initials: "MR",
    date: "Yesterday, 2:30 PM",
    total: "$2,199.99",
    status: "Delivered",
    avatarClassName: "bg-orange-100 text-orange-700",
    statusClassName: "border-emerald-200 bg-emerald-100 text-emerald-800",
  },
  {
    id: "#ORD-0918",
    customer: "Sarah Jenkins",
    initials: "SJ",
    date: "Yesterday, 11:20 AM",
    total: "$89.50",
    status: "Pending",
    avatarClassName: "bg-pink-100 text-pink-700",
    statusClassName: "border-amber-200 bg-amber-100 text-amber-800",
  },
];

export default function AdminDashboardPage() {
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

        <div className="flex items-center gap-2">
          <Select defaultValue="30-days">
            <SelectTrigger className="h-9 min-w-32 bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7-days">Last 7 days</SelectItem>
              <SelectItem value="30-days">Last 30 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button size="lg">
            <Download />
            Export
          </Button>
        </div>
      </header>

      <section aria-label="Store metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
                <span className={`flex size-10 items-center justify-center rounded-full ${metric.iconClassName}`}>
                  <Icon className="size-5" />
                </span>
              </div>
              <div className="mt-auto flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1 font-medium text-emerald-600">
                  <TrendingUp className="size-4" />
                  {metric.change}
                </span>
                <span className="text-xs text-muted-foreground">vs last period</span>
              </div>
            </article>
          );
        })}

        <article className="flex min-h-40 flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
              <p className="mt-1 text-2xl font-bold text-foreground">24</p>
            </div>
            <span className="flex size-10 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="size-5" />
            </span>
          </div>
          <Link
            href="/admin/inventory"
            className="mt-auto flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Review inventory <ArrowRight className="size-3.5" />
          </Link>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="text-lg font-bold text-foreground">Revenue Overview</h2>
            <div className="flex gap-1 rounded-lg bg-muted p-1">
              <Button size="xs" variant="secondary">Daily</Button>
              <Button size="xs" variant="ghost">Weekly</Button>
            </div>
          </div>
          <div className="h-75 p-5">
            <svg
              aria-label="Revenue rose across the last seven days"
              className="size-full overflow-visible"
              viewBox="0 0 680 260"
              role="img"
            >
              <defs>
                <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[40, 95, 150, 205].map((y) => (
                <line key={y} x1="0" x2="680" y1={y} y2={y} stroke="currentColor" className="text-border" strokeDasharray="4 6" />
              ))}
              <path d="M0 215 C45 194 55 205 95 180 S155 155 190 171 S250 115 290 135 S350 95 388 113 S455 55 492 81 S555 54 590 63 S642 17 680 31 L680 260 L0 260 Z" className="text-primary" fill="url(#revenue-fill)" />
              <path d="M0 215 C45 194 55 205 95 180 S155 155 190 171 S250 115 290 135 S350 95 388 113 S455 55 492 81 S555 54 590 63 S642 17 680 31" className="text-primary" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4" />
            </svg>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Jul 1</span><span>Jul 7</span><span>Jul 14</span><span>Jul 21</span><span>Jul 30</span>
            </div>
          </div>
        </article>

        <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-5">
            <h2 className="text-lg font-bold text-foreground">Sales by Category</h2>
          </div>
          <div className="flex min-h-75 flex-col items-center justify-center gap-5 p-5">
            <div className="relative size-40 rounded-full" style={{ background: "conic-gradient(var(--primary) 0 42%, #8b5cf6 42% 70%, #06b6d4 70% 88%, var(--muted) 88% 100%)" }}>
              <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-card">
                <span className="text-xs text-muted-foreground">Sales</span>
                <span className="text-lg font-bold text-foreground">$124.6k</span>
              </div>
            </div>
            <div className="grid w-full grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span><i className="mr-1.5 inline-block size-2 rounded-full bg-primary" />Graphics cards</span>
              <span><i className="mr-1.5 inline-block size-2 rounded-full bg-violet-500" />Processors</span>
              <span><i className="mr-1.5 inline-block size-2 rounded-full bg-cyan-500" />Monitors</span>
              <span><i className="mr-1.5 inline-block size-2 rounded-full bg-muted-foreground" />Other</span>
            </div>
          </div>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="text-lg font-bold text-foreground">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-primary hover:underline">
            View all orders
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Order ID</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Total</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-muted/30">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-foreground">{order.id}</td>
                  <td className="px-6 py-4 text-foreground"><div className="flex items-center gap-2"><span className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${order.avatarClassName}`}>{order.initials}</span>{order.customer}</div></td>
                  <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{order.date}</td>
                  <td className="px-6 py-4 font-medium text-foreground">{order.total}</td>
                  <td className="px-6 py-4"><Badge variant="outline" className={order.statusClassName}>{order.status}</Badge></td>
                  <td className="px-6 py-4 text-right"><Button aria-label={`Actions for ${order.id}`} size="icon-sm" variant="ghost"><MoreHorizontal /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
