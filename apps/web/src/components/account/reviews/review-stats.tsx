import { Clock3, PenLine, Star, ThumbsUp } from "lucide-react";
export function ReviewStats({
  total,
  average,
  helpful,
  pending,
}: {
  total: number;
  average: number;
  helpful: number;
  pending: number;
}) {
  const stats = [
    [PenLine, String(total), "Reviews Written", "text-primary bg-primary/10"],
    [
      Star,
      total ? average.toFixed(1) : "—",
      "Avg. Rating Given",
      "text-yellow-500 bg-yellow-400/10",
    ],
    [
      ThumbsUp,
      String(helpful),
      "Helpful Votes",
      "text-emerald-600 bg-emerald-500/10",
    ],
    [
      Clock3,
      String(pending),
      "Pending Reviews",
      "text-orange-500 bg-orange-400/10",
    ],
  ] as const;
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(([Icon, value, label, color]) => (
        <div
          key={label}
          className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"
        >
          <div
            className={`grid size-10 place-items-center rounded-lg ${color}`}
          >
            <Icon className="size-4" />
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
