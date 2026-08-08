import { PenLine, Star } from "lucide-react";
export function ReviewsHeader() {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold uppercase">Product Reviews</h1>
        <p className="text-muted-foreground">
          Share your experience and help other customers make informed
          decisions.
        </p>
      </div>
      <div className="flex gap-3">
        <Metric icon={Star} value="4.6" label="avg rating" />
        <Metric icon={PenLine} value="8" label="total reviews" />
      </div>
    </header>
  );
}
function Metric({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Star;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
      <Icon className="size-4 text-yellow-400" />
      <b>{value}</b>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
