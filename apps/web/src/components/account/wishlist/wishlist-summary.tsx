import { Bell, Percent, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
export function WishlistSummary({
  products,
}: {
  products: { price: number; oldPrice?: number }[];
}) {
  const total = products.reduce((sum, product) => sum + product.price, 0);
  const savings = products.reduce(
    (sum, product) =>
      sum + (product.oldPrice ? product.oldPrice - product.price : 0),
    0,
  );
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <Summary
        icon={Tag}
        label="Total Wishlist Value"
        value={`$${total.toFixed(2)}`}
      />
      <Summary
        icon={Percent}
        label="Total Savings"
        value={`$${savings.toFixed(2)}`}
        danger
      />
      <div className="flex items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-5 shadow-sm">
        <span className="grid size-12 place-items-center rounded-xl bg-primary/15 text-primary">
          <Bell />
        </span>
        <div>
          <p className="text-xs font-bold uppercase text-primary">
            Price Drop Alerts
          </p>
          <p className="mt-0.5 text-sm font-semibold">
            Get notified on price drops
          </p>
          <Button variant="link" size="sm">
            Enable alerts →
          </Button>
        </div>
      </div>
    </section>
  );
}
function Summary({
  icon: Icon,
  label,
  value,
  danger = false,
}: {
  icon: typeof Tag;
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <span
        className={`grid size-12 place-items-center rounded-xl ${danger ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}
      >
        <Icon />
      </span>
      <div>
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {label}
        </p>
        <p
          className={`mt-0.5 text-2xl font-bold ${danger ? "text-destructive" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
