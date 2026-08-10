"use client";

import {
  CreditCard,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useState } from "react";

import type { StorefrontProductDetail } from "@/services/products";
import { Button } from "@/components/ui/button";
import { useRecordProductView } from "@/hooks/use-products";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function ProductOverviewDynamic({
  product,
}: {
  product: StorefrontProductDetail;
}) {
  useRecordProductView(product.id);
  const [quantity, setQuantity] = useState(1);
  const currentPrice = product.discountPrice ?? product.price;
  const outOfStock = product.stock === 0;
  const savings =
    product.discountPrice === null ? 0 : product.price - currentPrice;
  const discountPercentage = savings
    ? Math.round((savings / product.price) * 100)
    : 0;

  return (
    <div className="flex w-full flex-col lg:w-1/2">
      <span className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
        {product.brand}
      </span>
      <h1 className="text-2xl font-bold leading-tight">{product.name}</h1>
      <div className="mb-5">
        <div className="flex items-end gap-3">
          <span className="text-xl font-bold">
            {currencyFormatter.format(currentPrice)}
          </span>
          {product.discountPrice !== null ? (
            <>
              <span className="text-lg text-muted-foreground line-through">
                {currencyFormatter.format(product.price)}
              </span>
            </>
          ) : null}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {product.discountPrice !== null ? (
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
              {discountPercentage}% off · Save{" "}
              {currencyFormatter.format(savings)}
            </span>
          ) : null}
          <span
            className={`rounded-full px-2 py-1 text-xs font-bold ${outOfStock ? "bg-destructive/10 text-destructive" : "bg-emerald-100 text-emerald-700"}`}
          >
            {outOfStock ? "Out of stock" : "In stock"}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex h-9 items-center rounded-lg border border-border">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          >
            <Minus />
          </Button>
          <span className="w-9 text-center text-sm font-medium">
            {quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() =>
              setQuantity((value) => Math.min(product.stock, value + 1))
            }
            disabled={outOfStock}
          >
            <Plus />
          </Button>
        </div>
        <Button type="button" className="h-9 flex-1" disabled={outOfStock}>
          <ShoppingCart />
          Add to Cart
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="group h-9 w-9"
          aria-label="Add to wishlist"
        >
          <Heart className="transition-all duration-200 group-hover:scale-110 group-hover:fill-current group-hover:text-primary" />
        </Button>
      </div>

      <div className="mt-3 space-y-2 border-t border-border pt-5 text-sm">
        <div className="flex gap-3">
          <Truck className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="font-semibold">Fast, tracked delivery</p>
            <p className="mt-1 text-muted-foreground">
              Orders are carefully packed and dispatched within 1–2 business
              days.
            </p>
          </div>
        </div>
        <div className="flex gap-3 border-t border-border pt-4">
          <CreditCard className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="font-semibold">Flexible payment options</p>
            <p className="mt-1 text-muted-foreground">
              Pay securely by credit or debit card, cash on delivery where
              available, or your preferred local payment method.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
