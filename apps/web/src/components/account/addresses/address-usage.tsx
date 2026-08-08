import { Box } from "lucide-react";
const usage = [
  [
    "TF-89420-11",
    "Oct 24, 2023 · Intel Core i9-13900K & ASUS ROG Motherboard",
    "123 Tech Avenue, Suite 400",
    "San Francisco, CA — Home",
    "Shipped",
  ],
  [
    "TF-78321-07",
    "Sep 11, 2023 · NVIDIA RTX 4090 Founders Edition",
    "500 Market Street, Floor 12",
    "San Francisco, CA — Work",
    "Delivered",
  ],
  [
    "TF-65190-03",
    "Aug 5, 2023 · Corsair Dominator 64GB DDR5 & Samsung 990 Pro SSD",
    "88 Pine Street, Apt 3B",
    "New York, NY — Other",
    "Delivered",
  ],
];
export function AddressUsage() {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <header className="border-b border-border p-6">
        <h2 className="text-base font-bold uppercase">Address Usage</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your addresses are linked to the following recent orders.
        </p>
      </header>
      <div className="divide-y divide-border">
        {usage.map(([order, description, line, location, status]) => (
          <div
            key={order}
            className="flex flex-col justify-between gap-3 p-5 hover:bg-muted/50 sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-4">
              <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Box className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">Order #{order}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right text-xs">
                <p className="font-medium">{line}</p>
                <p className="text-muted-foreground">{location}</p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase text-emerald-600">
                {status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
