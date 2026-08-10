import { Box, CheckCircle2, Clock3, Truck } from "lucide-react";
import type { MyOrders } from "@/services/orders";
export function OrderStats({ stats }: { stats?: MyOrders["stats"] }) {
  const statCards = [
    [Box, "Total Orders", stats?.total ?? 0, "text-primary bg-primary/10"],
    [
      Clock3,
      "Processing",
      (stats?.pending ?? 0) + (stats?.processing ?? 0),
      "text-amber-600 bg-amber-400/10",
    ],
    [Truck, "In Transit", stats?.shipped ?? 0, "text-blue-500 bg-blue-100"],
    [
      CheckCircle2,
      "Delivered",
      stats?.delivered ?? 0,
      "text-emerald-600 bg-emerald-500/10",
    ],
  ] as const;
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {statCards.map(([Icon, label, value, color]) => (
        <div
          key={label}
          className="rounded-xl border border-border bg-card p-4 shadow-sm"
        >
          <div className="mb-2 flex items-center gap-3">
            <span
              className={`grid size-9 place-items-center rounded-lg ${color}`}
            >
              <Icon className="size-4" />
            </span>
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              {label}
            </span>
          </div>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      ))}
    </div>
  );
}
