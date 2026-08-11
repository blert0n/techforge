import { PenLine, Star } from "lucide-react";
export function ReviewsHeader({
  total,
  average,
}: {
  total: number;
  average: number;
}) {
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
        <Metric icon={PenLine} value={String(total)} label="Total Reviews" />
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
