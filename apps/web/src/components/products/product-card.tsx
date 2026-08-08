import Image from "next/image";
import { Check, Heart, Plus, ShoppingCart, Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ProductCardData = {
  brand: string;
  name: string;
  price: string;
  oldPrice?: string;
  reviews: number;
  badge?: string;
  image: string;
  rating: number;
  specs?: string[];
  stock?: "In Stock" | "Low Stock";
};
export function ProductCard({
  product,
  variant = "featured",
}: {
  product: ProductCardData;
  variant?: "featured" | "listing";
}) {
  const listing = variant === "listing";
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-lg">
      {product.badge && (
        <span className="absolute top-4 left-4 z-10 rounded bg-destructive px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-destructive-foreground">
          {product.badge}
        </span>
      )}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute top-4 right-4 z-10 rounded-full text-muted-foreground hover:text-primary"
      >
        <Heart />
        <span className="sr-only">Add {product.name} to wishlist</span>
      </Button>
      <div className="mb-4 flex h-48 w-full items-center justify-center overflow-hidden rounded-xl p-4">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="h-full w-full rounded-lg object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <span className="mb-1 text-xs text-muted-foreground">
          {product.brand}
        </span>
        <h3 className="mb-2 line-clamp-2 text-sm font-semibold transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        {listing && product.specs && (
          <div className="mb-2 space-y-1 text-xs text-muted-foreground">
            {product.specs.map((spec) => (
              <p key={spec}>{spec}</p>
            ))}
          </div>
        )}
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
        <div
          className={`mt-auto pt-4 ${listing ? "flex flex-col gap-2" : "flex items-center justify-between"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold">{product.price}</span>
              {product.oldPrice && (
                <span className="ml-2 text-xs text-muted-foreground line-through">
                  {product.oldPrice}
                </span>
              )}
            </div>
            {listing && product.stock && (
              <span
                className={`flex items-center gap-1 text-xs font-medium ${product.stock === "Low Stock" ? "text-destructive" : "text-emerald-600"}`}
              >
                {product.stock === "In Stock" && <Check className="size-3.5" />}
                {product.stock}
              </span>
            )}
          </div>
          {listing ? (
            <Button
              type="button"
              variant={product.stock === "Low Stock" ? "outline" : "default"}
              className="w-full"
            >
              <ShoppingCart />
              Add to Cart
            </Button>
          ) : (
            <Button type="button" size="icon-sm" className="rounded-full">
              <Plus />
              <span className="sr-only">Add {product.name} to cart</span>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
