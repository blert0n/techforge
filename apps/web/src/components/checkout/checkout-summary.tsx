import { LockKeyhole, Truck } from "lucide-react";
import { checkoutItems, checkoutSubtotal, checkoutTax } from "./checkout.data";

export function CheckoutSummary() {
  const total = checkoutSubtotal + checkoutTax;
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="mb-5 border-b border-border pb-4 text-xl font-bold">
          Order summary
        </h2>
        <div className="space-y-4">
          {checkoutItems.map((item) => (
            <div className="flex gap-3" key={item.id}>
              <div className="relative flex size-16 shrink-0 items-center justify-center rounded-lg border border-border bg-muted p-1">
                <img
                  src={item.image}
                  alt=""
                  className="size-full object-contain"
                />
                <span className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-secondary text-xs text-secondary-foreground">
                  {item.quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium">{item.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Qty: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold">${item.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="my-6 space-y-3 border-y border-border py-5 text-sm">
          <Row label="Subtotal" value={checkoutSubtotal} />
          <Row label="Shipping" value={0} />
          <Row label="Estimated tax" value={checkoutTax} />
        </div>
        <div className="flex items-end justify-between">
          <span className="text-lg font-bold">Total</span>
          <span className="text-2xl font-bold">${total.toFixed(2)}</span>
        </div>
        <p className="mt-1 text-right text-xs text-muted-foreground">USD</p>
        <div className="mt-6 flex gap-3 rounded-xl bg-muted/60 p-4 text-sm">
          <Truck className="mt-0.5 size-5 shrink-0 text-primary" />
          <p>
            <span className="font-semibold">Free expedited shipping</span>
            <br />
            <span className="text-muted-foreground">
              Expected delivery by Thursday, Oct 26.
            </span>
          </p>
        </div>
        <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <LockKeyhole className="size-3.5" />
          Secure, encrypted checkout
        </p>
      </section>
    </aside>
  );
}
function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{value === 0 ? "Free" : `$${value.toFixed(2)}`}</span>
    </div>
  );
}
