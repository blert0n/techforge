"use client";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { wishlistProducts } from "./wishlist.data";
import { WishlistProductCard } from "./wishlist-product-card";
import { WishlistSummary } from "./wishlist-summary";
import { WishlistToolbar, type WishlistFilters } from "./wishlist-toolbar";
import type { WishlistProduct } from "./types";
export default function WishlistPage() {
  const [products, setProducts] = useState(wishlistProducts);
  const [filters, setFilters] = useState<WishlistFilters>({
    filter: "All",
    sort: "Date Added",
  });
  const visible = products
    .filter(
      (product) =>
        filters.filter === "All" ||
        (filters.filter === "In Stock" && product.inStock) ||
        (filters.filter === "On Sale" && product.oldPrice) ||
        product.category === filters.filter,
    )
    .sort((a, b) =>
      filters.sort === "Price: Low to High"
        ? a.price - b.price
        : filters.sort === "Price: High to Low"
          ? b.price - a.price
          : filters.sort === "Name A–Z"
            ? a.name.localeCompare(b.name)
            : 0,
    );
  return (
    <div className="min-w-0 space-y-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold uppercase">My Wishlist</h1>
          <p className="text-muted-foreground">
            {products.length} saved items — products you love, ready to purchase
            when you are.
          </p>
        </div>
        <Button type="button">
          <ShoppingBag />
          Add all to cart
        </Button>
      </header>
      <WishlistToolbar onChange={setFilters} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((product) => (
          <WishlistProductCard
            key={product.id}
            product={product}
            onRemove={(id) =>
              setProducts((current) => current.filter((item) => item.id !== id))
            }
          />
        ))}
      </div>
      {visible.length === 0 && (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No wishlist items match these filters.
        </p>
      )}
      <WishlistSummary products={products} />
    </div>
  );
}
