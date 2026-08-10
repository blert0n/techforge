"use client";
import Link from "next/link";
import { ArrowRight, ShoppingCart, ShieldCheck } from "lucide-react";
import {
  useCart,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/hooks/use-cart";
import { CartItem } from "./cart-item";
import { CartRecommendations } from "./cart-recommendations";
import { CartSummary } from "./cart-summary";
export default function CartPage() {
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const items = cart?.items ?? [];
  const subtotal = Number(cart?.subtotal ?? 0);
  const tax = subtotal * 0.07;
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row md:px-8">
      <section className="w-full lg:w-2/3">
        <div className="mb-6 flex items-end justify-between border-b border-border pb-4">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <span className="text-sm text-muted-foreground">Price</span>
        </div>
        <div>
          {isLoading ? (
            <p className="py-8 text-muted-foreground">Loading cart...</p>
          ) : null}
          {!isLoading && !items.length ? <EmptyCart /> : null}
          {items.length ? (
            <div className="overflow-hidden rounded-2xl border border-border bg-card px-6 shadow-sm">
              {items.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onChange={(quantity) =>
                    updateItem.mutate({ productId: item.productId, quantity })
                  }
                  onRemove={() => removeItem.mutate(item.productId)}
                  isUpdating={
                    updateItem.isPending &&
                    updateItem.variables?.productId === item.productId
                  }
                  isRemoving={
                    removeItem.isPending &&
                    removeItem.variables === item.productId
                  }
                />
              ))}
            </div>
          ) : null}
        </div>
        <>
          <p className="mt-6 text-right text-lg">
            Subtotal ({cart?.items?.length ?? 0} items):{" "}
            <b>${subtotal.toFixed(2)}</b>
          </p>
          <CartRecommendations />
        </>
      </section>
      <CartSummary
        subtotal={subtotal}
        tax={tax}
        isCheckoutDisabled={(cart?.itemCount ?? 0) === 0}
      />
    </main>
  );
}

function EmptyCart() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-sm sm:px-12">
      <div className="absolute -top-16 -right-16 size-48 rounded-full bg-primary/5" />
      <div className="absolute -bottom-20 -left-12 size-44 rounded-full bg-primary/5" />
      <div className="relative mx-auto flex max-w-md flex-col items-center">
        <div className="mb-6 grid size-20 place-items-center rounded-2xl bg-primary/10 text-primary shadow-inner">
          <ShoppingCart className="size-10" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          Your cart is waiting
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Find the components that power your next build, then come back here
          when you&apos;re ready to check out.
        </p>
        <Link
          href="/category"
          className="mt-7 inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Browse products <ArrowRight className="size-4" />
        </Link>
        <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" />
          Your cart is saved automatically
        </div>
      </div>
    </section>
  );
}
