import Link from "next/link";
import { Heart, Monitor, MemoryStick } from "lucide-react";

const wishlistItems = [
  {
    name: 'Alienware AW3423DWF 34" QD-OLED',
    price: "$999.99",
    icon: Monitor,
  },
  {
    name: "Corsair Dominator Platinum RGB 64GB DDR5",
    price: "$279.99",
    icon: MemoryStick,
  },
];

export default function WishlistPreview() {
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
          View All (5)
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {wishlistItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.name}
              className="
                group
                flex
                h-full
                cursor-pointer
                flex-col
                rounded-lg
                border
                border-border
                p-4
                transition-colors
                hover:border-primary
              "
            >
              <div
                className="
                  relative
                  mb-4
                  flex
                  aspect-square
                  items-center
                  justify-center
                  rounded-md
                  bg-muted
                "
              >
                <Icon className="h-10 w-10 text-muted-foreground" />

                <button
                  className="
                    absolute
                    right-2
                    top-2
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-border
                    bg-background
                    text-destructive
                    transition-colors
                    hover:scale-110
                    hover:text-destructive-foreground
                  "
                >
                  <Heart className="h-4 w-4 fill-current" />
                </button>
              </div>

              <h3
                className="
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

              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="text-sm font-bold text-foreground">
                  {item.price}
                </span>

                <button
                  className="
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-primary
                    hover:text-primary/80
                  "
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
