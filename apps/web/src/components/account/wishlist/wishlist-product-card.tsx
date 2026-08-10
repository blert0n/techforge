import Image from "next/image";
import { Plus, Star, StarHalf, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { WishlistProduct } from "./types";

export function WishlistProductCard({
  product,
  onRemove,
}: {
  product: WishlistProduct;
  onRemove: (id: string) => void;
}) {
  const sale = product.oldPrice !== undefined;

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-lg">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
        {sale && (
          <span className="rounded bg-destructive px-2 py-1 text-[10px] font-bold uppercase text-destructive-foreground">
            Sale
          </span>
        )}
        {product.inStock && (
          <span className="rounded bg-emerald-600 px-2 py-1 text-[10px] font-bold uppercase text-white">
            In Stock
          </span>
        )}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute top-4 right-4 z-10 rounded-full bg-card/90 text-muted-foreground hover:text-destructive"
        onClick={() => onRemove(product.id)}
      >
        <X />
        <span className="sr-only">Remove {product.name}</span>
      </Button>
      <div className="mb-4 flex h-48 items-center justify-center overflow-hidden rounded-xl bg-muted/60 p-4">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            className="h-full w-full rounded-lg object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col">
        <span className="mb-1 text-xs text-muted-foreground">
          {product.brand} · {product.category}
        </span>
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        <div className="mb-2 flex items-center gap-1 text-xs text-yellow-500">
          {Array.from({ length: Math.floor(product.rating) }).map(
            (_, index) => (
              <Star key={index} className="size-3 fill-current" />
            ),
          )}
          {product.rating % 1 !== 0 && (
            <StarHalf className="size-3 fill-current" />
          )}
          <span className="ml-1 text-muted-foreground">
            ({product.reviews})
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <div>
            <span className="text-lg font-bold">
              ${product.price.toFixed(2)}
            </span>
            {sale && (
              <span className="ml-2 text-xs text-muted-foreground line-through">
                ${product.oldPrice!.toFixed(2)}
              </span>
            )}
          </div>
          <Button type="button" size="icon-sm" className="rounded-full">
            <Plus />
            <span className="sr-only">Add {product.name} to cart</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
