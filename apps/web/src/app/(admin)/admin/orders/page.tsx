"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminOrders } from "@/hooks/use-orders";
export default function AdminOrdersPage() {
  const params = useSearchParams();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const userId = params.get("userId") ?? "";
  const { data } = useAdminOrders({
    page,
    pageSize: 20,
    ...(status
      ? {
          status: status as
            "pending" | "processing" | "shipped" | "delivered" | "cancelled",
        }
      : {}),
    ...(paymentStatus ? { paymentStatus } : {}),
    ...(orderNumber ? { orderNumber } : {}),
    ...(userId ? { userId } : {}),
  });
  const items = data?.items ?? [];
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Review orders across all customers.
        </p>
      </header>
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex flex-wrap gap-2 p-5">
          <Input
            className="w-56"
            placeholder="Order number"
            value={orderNumber}
            onChange={(e) => {
              setOrderNumber(e.target.value);
              setPage(1);
            }}
          />
          <Select
            value={status || "all"}
            onValueChange={(value) => {
              setStatus(value === "all" ? "" : (value ?? ""));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-44 capitalize">
              <SelectValue>{status || "All order statuses"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All order statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={paymentStatus || "all"}
            onValueChange={(value) => {
              setPaymentStatus(value === "all" ? "" : (value ?? ""));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-44 capitalize">
              <SelectValue>
                {paymentStatus || "All payment statuses"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payment statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 text-left text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="p-4">Order</th>
                <th className="p-4">Status</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Placed</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((order) => (
                <tr className="border-t" key={order.id}>
                  <td className="p-4 font-medium">{order.orderNumber}</td>
                  <td className="p-4">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="p-4">
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="p-4">{order.itemCount}</td>
                  <td className="p-4">
                    {order.currency} {order.total}
                  </td>
                  <td className="p-4">
                    {new Date(order.placedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      nativeButton={false}
                      render={
                        <Link href={`/admin/orders/${order.orderNumber}`} />
                      }
                      size="sm"
                      variant="outline"
                    >
                      View details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data && (
          <footer className="flex justify-between border-t p-4">
            <span>{data.pagination.total} orders</span>
            <div className="flex gap-2">
              <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <Button
                disabled={page >= data.pagination.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </footer>
        )}
      </section>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    processing: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    shipped: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
    delivered: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    cancelled: "bg-destructive/10 text-destructive",
  } as const;
  return (
    <Badge
      className={`capitalize ${styles[status as keyof typeof styles] ?? "bg-muted text-muted-foreground"}`}
    >
      {status}
    </Badge>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      className={`capitalize ${status === "paid" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-amber-500/10 text-amber-700 dark:text-amber-400"}`}
    >
      {status}
    </Badge>
  );
}
