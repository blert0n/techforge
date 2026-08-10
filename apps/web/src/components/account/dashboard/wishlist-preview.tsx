"use client";

import Link from "next/link";
import { Heart, ImageIcon } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";

export default function WishlistPreview() {
  const { data } = useWishlist();
  const items = data?.items.slice(0, 3) ?? [];

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border p-6">
        <h2 className="text-xl font-bold uppercase tracking-wider text-foreground">
          Wishlist
        </h2>

        <Link
          href="/account/wishlist"
          className="text-sm font-medium text-primary hover:underline"
        >
          View All ({data?.items.length ?? 0})
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            href={`/products/${item.slug}`}
            key={item.id}
            className="group flex h-full flex-col rounded-lg border border-border p-4 transition-colors hover:border-primary"
          >
            <div className="relative mb-4 flex aspect-square items-center justify-center overflow-hidden rounded-md bg-muted">
              {item.imageUrl ? (
                <img
                  alt={item.imageAltText ?? item.name}
                  className="h-36 w-36 max-w-full object-contain"
                  src={item.imageUrl}
                />
              ) : (
                <ImageIcon className="size-10 text-muted-foreground" />
              )}
              <Heart className="absolute top-2 right-2 size-4 fill-primary text-primary" />
            </div>
            <h3
              className="
                group
                mb-1
                line-clamp-2
                text-sm
                font-semibold
                text-foreground
                transition-colors
                group-hover:text-primary
              "
            >
              {item.name}
            </h3>
            <span className="mt-auto pt-4 text-sm font-bold text-foreground">
              {new Intl.NumberFormat(undefined, {
                style: "currency",
                currency: "USD",
              }).format(item.discountPrice ?? item.price)}
            </span>
          </Link>
        ))}
        {!items.length && (
          <p className="col-span-full text-sm text-muted-foreground">
            Your wishlist is empty.
          </p>
        )}
      </div>
    </section>
  );
}
