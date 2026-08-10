"use client";

import {
  ProductCard,
  type ProductCardData,
} from "@/components/products/product-card";
import { useRecentlyViewedProducts } from "@/hooks/use-products";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function CartRecommendations() {
  const { data, isLoading } = useRecentlyViewedProducts();

  if (isLoading || !data?.items.length) return null;

  return (
    <section className="mt-12">
      <h2 className="mb-6 border-b border-border pb-4 text-xl font-bold">
        Recently viewed products
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.slice(0, 3).map((product) => {
          const currentPrice = product.discountPrice ?? product.price;
          const card: ProductCardData = {
            id: product.id,
            slug: product.slug,
            brand: product.brand,
            name: product.name,
            price: currencyFormatter.format(currentPrice),
            oldPrice:
              product.discountPrice === null
                ? undefined
                : currencyFormatter.format(product.price),
            reviews: product.reviewCount,
            image: product.imageUrl ?? undefined,
            rating: product.rating,
            specs: product.specifications,
            stock:
              product.stock === 0
                ? "Out of Stock"
                : product.stock <= 5
                  ? "Low Stock"
                  : "In Stock",
          };

          return (
            <ProductCard key={product.id} product={card} variant="listing" />
          );
        })}
      </div>
    </section>
  );
}
