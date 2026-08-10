import { useForm } from "react-hook-form";
import { ShoppingCart, Truck } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function CartSummary({
  subtotal,
  tax,
  isCheckoutDisabled = false,
  showCheckoutActions = true,
  className,
}: {
  subtotal: number;
  tax: number;
  isCheckoutDisabled?: boolean;
  showCheckoutActions?: boolean;
  className?: string;
}) {
  const { register, handleSubmit } = useForm<{ promo: string }>({
    defaultValues: { promo: "" },
  });
  const total = subtotal + tax;

  return (
    <aside className={cn("w-full lg:w-1/3", className)}>
      <div className="sticky top-36 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-6 border-b border-border pb-4 text-xl font-bold">
          Order Summary
        </h2>
        <div className="space-y-4 text-sm">
          <Row label="Items" value={`$${subtotal.toFixed(2)}`} />
          <Row label="Shipping & handling" value="$0.00" />
          <Row label="Estimated Tax" value={`$${tax.toFixed(2)}`} />
        </div>
        <div className="my-6 flex justify-between border-t border-border pt-4">
          <b className="text-lg">Order Total:</b>
          <b className="text-2xl">${total.toFixed(2)}</b>
        </div>
        {showCheckoutActions ? (
          <>
            <Link
              href="/checkout"
              aria-disabled={isCheckoutDisabled}
              tabIndex={isCheckoutDisabled ? -1 : undefined}
              className={
                buttonVariants({ className: "h-12 w-full text-lg" }) +
                (isCheckoutDisabled ? " pointer-events-none opacity-50" : "")
              }
            >
              <ShoppingCart />
              Proceed to Checkout
            </Link>
            <form onSubmit={handleSubmit(() => undefined)} className="mt-6">
              <label className="mb-2 block text-sm font-semibold">
                Apply Promo Code
              </label>
              <div className="flex gap-2">
                <Input placeholder="Enter code" {...register("promo")} />
                <Button type="submit" variant="secondary">
                  Apply
                </Button>
              </div>
            </form>
          </>
        ) : null}
        <div className="mt-6 flex gap-3 rounded-xl bg-muted/50 p-4 text-sm">
          <Truck className="size-5 text-primary" />
          <p>
            <b>Free Expedited Shipping</b>
            <br />
            <span className="text-muted-foreground">
              Order within 2 hrs 45 mins to get it by Thursday, Oct 26.
            </span>
          </p>
        </div>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}:</span>
      <span>{value}</span>
    </div>
  );
}
