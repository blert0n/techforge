import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export function CartButton() {
  return (
    <Link
      href="/cart"
      className="
        relative
        flex
        items-center
        gap-2
        text-foreground
        transition-colors
        hover:text-primary
      "
    >
      <div className="relative inline-flex">
        <ShoppingCart className="h-6 w-6" />

        <span
          className="
            absolute
            -right-2
            -top-1
            flex
            h-4
            w-4
            items-center
            justify-center
            rounded-full
            bg-primary
            text-[10px]
            font-bold
            text-primary-foreground
          "
        >
          2
        </span>
      </div>

      <span className="hidden text-sm font-medium md:block">Cart</span>
    </Link>
  );
}
