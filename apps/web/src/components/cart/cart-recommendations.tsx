import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
const products = [
  ["Corsair Dominator Titanium RGB 64GB DDR5", "$299.99"],
  ["Samsung 990 PRO 2TB NVMe SSD", "$169.99"],
  ["NZXT Kraken Elite 360 RGB Cooler", "$279.99"],
];
export function CartRecommendations() {
  return (
    <section className="mt-12">
      <h2 className="mb-6 border-b border-border pb-4 text-xl font-bold">
        Frequently bought together
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(([name, price]) => (
          <div
            key={name}
            className="flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-muted/20">
              <ShoppingCart className="size-10 text-muted-foreground" />
            </div>
            <h3 className="flex-1 text-sm font-semibold">{name}</h3>
            <div className="mt-3 flex items-center justify-between">
              <b>{price}</b>
              <Button size="sm">Add to Cart</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
