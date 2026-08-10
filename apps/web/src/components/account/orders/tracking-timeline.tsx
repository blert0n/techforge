import type { LucideIcon } from "lucide-react";
import { Check, House, Truck } from "lucide-react";

export type TrackingDetails = {
  id: string;
  orderedAt: string;
  total: string;
  products: string[];
  icons: LucideIcon[];
  itemSummary: string;
  trackingNumber: string;
  carrier: string;
  arrival: string;
  steps: string[];
  activeStep: number;
  history: string[][];
};
const labels = ["Order Placed", "Processing", "In Transit", "Delivered"];
const icons = [Check, Check, Truck, House];
export function TrackingTimeline({ order }: { order: TrackingDetails }) {
  return (
    <div className="rounded-xl border border-border bg-muted/50 p-5">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase">Shipment Progress</h3>
        <p className="flex items-center gap-1 text-xs font-semibold text-primary">
          <Truck className="size-4" />
          {order.arrival}
        </p>
      </div>
      <div className="relative">
        <div className="absolute top-4 right-4 left-4 h-0.5 bg-border">
          <div
            className="h-full bg-primary"
            style={{ width: `${(order.activeStep / 3) * 100}%` }}
          />
        </div>
        <div className="relative flex justify-between">
          {labels.map((label, index) => {
            const Icon = icons[index];
            const completed = index <= order.activeStep;
            return (
              <div
                key={label}
                className="flex w-1/4 flex-col items-center gap-2 text-center"
              >
                <span
                  className={`grid size-8 place-items-center rounded-full border-2 ${completed ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"}`}
                >
                  <Icon className="size-3.5" />
                </span>
                <p
                  className={`text-xs font-bold ${completed ? "text-primary" : "text-muted-foreground"}`}
                >
                  {label}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {order.steps[index]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-6 space-y-3 border-t border-border pt-5">
        <h4 className="text-xs font-bold uppercase text-muted-foreground">
          Tracking History
        </h4>
        {order.history.map(([event, time], index) => (
          <div key={`${event}-${time}`} className="flex gap-3">
            <span
              className={`mt-1.5 size-2 rounded-full ${index <= order.activeStep ? "bg-primary" : "bg-muted-foreground"}`}
            />
            <div className="flex flex-1 flex-col justify-between gap-1 sm:flex-row">
              <p
                className={
                  index <= order.activeStep
                    ? "text-sm font-medium"
                    : "text-sm text-muted-foreground"
                }
              >
                {event}
              </p>
              <time className="text-xs text-muted-foreground">{time}</time>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
