import Link from "next/link";
import { CheckCircle2, Package } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-2xl items-center px-4 py-12 sm:px-6">
      <section className="w-full rounded-2xl border border-border bg-card p-8 text-center shadow-sm sm:p-12">
        <CheckCircle2 className="mx-auto size-14 text-emerald-600" />
        <p className="mt-6 text-sm font-semibold text-primary">
          Payment received
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Thank you for your order
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          We&apos;re confirming your payment and preparing your order.
          You&apos;ll receive an update once it&apos;s ready to ship.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/account/orders" className={buttonVariants()}>
            <Package />
            View your orders
          </Link>
          <Link
            href="/category"
            className={buttonVariants({ variant: "outline" })}
          >
            Continue shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
