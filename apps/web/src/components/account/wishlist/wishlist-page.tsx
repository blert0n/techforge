"use client";

import { useState } from "react";

import { useToggleWishlistProduct, useWishlist } from "@/hooks/use-wishlist";

import { WishlistProductCard } from "./wishlist-product-card";
import { WishlistSummary } from "./wishlist-summary";
import { WishlistToolbar, type WishlistFilters } from "./wishlist-toolbar";
import type { WishlistProduct } from "./types";

export default function WishlistPage() {
  const [filters, setFilters] = useState<WishlistFilters>({
    sort: "Date Added",
  });
  const { data, isError, isLoading } = useWishlist({
    categoryId: filters.categoryId,
    sort: filters.sort,
  });
  const toggleWishlistProduct = useToggleWishlistProduct();
  const categoryNames = new Map(
    data?.categories.map((category) => [category.id, category.name]),
  );
  const products: WishlistProduct[] = (data?.items ?? []).map((product) => ({
    id: String(product.id),
    brand: product.brand,
    category: categoryNames.get(product.categoryId) ?? "Uncategorized",
    name: product.name,
    price: product.discountPrice ?? product.price,
    oldPrice: product.discountPrice === null ? undefined : product.price,
    reviews: product.reviewCount,
    rating: product.rating,
    image: product.imageUrl ?? undefined,
    inStock: product.stock > 0,
  }));
  const visible = products;

  return (
    <div className="min-w-0 space-y-8">
      <header>
        <h1 className="text-3xl font-bold uppercase">My Wishlist</h1>
        <p className="text-muted-foreground">
          {products.length} saved items — products you love, ready to purchase
          when you are.
        </p>
      </header>
      <WishlistToolbar
        categories={data?.categories ?? []}
        onChange={setFilters}
      />
      {isLoading ? (
        <p className="text-muted-foreground">Loading wishlist…</p>
      ) : null}
      {isError ? (
        <p className="text-destructive">Unable to load your wishlist.</p>
      ) : null}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((product) => (
          <WishlistProductCard
            key={product.id}
            product={product}
            onRemove={(id) => toggleWishlistProduct.mutate(Number(id))}
          />
        ))}
      </div>
      {!isLoading && !isError && visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No wishlist items match this category.
        </p>
      ) : null}
      <WishlistSummary products={products} />
    </div>
  );
}
