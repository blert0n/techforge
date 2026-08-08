import { Button } from "@/components/ui/button";
import { pendingReviews } from "./reviews.data";
export function PendingReviews({
  onWrite,
}: {
  onWrite: (product: string) => void;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-3 border-b border-border p-6">
        <span className="size-2 rounded-full bg-orange-400" />
        <h2 className="text-lg font-bold uppercase">Awaiting Your Review</h2>
        <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-600">
          3 products
        </span>
      </div>
      <div className="space-y-4 p-6">
        {pendingReviews.map(({ category, product, details, icon: Icon }) => (
          <div
            key={product}
            className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center"
          >
            <div className="grid size-14 place-items-center rounded-lg bg-muted text-muted-foreground">
              <Icon className="size-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                {category}
              </p>
              <p className="font-medium">{product}</p>
              <p className="text-xs text-muted-foreground">{details}</p>
            </div>
            <Button type="button" onClick={() => onWrite(product)}>
              Write review
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
