import { Check, CreditCard, MapPin, ShoppingBag } from "lucide-react";
import Link from "next/link";

const steps = [
  { label: "Cart", icon: ShoppingBag, href: "/cart", state: "complete" },
  {
    label: "Checkout",
    icon: MapPin,
    href: "#shipping-address",
    state: "current",
  },
  {
    label: "Payment",
    icon: CreditCard,
    href: "#payment-method",
    state: "upcoming",
  },
] as const;

export function CheckoutSteps() {
  return (
    <ol className="flex items-center justify-center gap-2 text-xs font-medium sm:gap-4 sm:text-sm">
      {steps.map(({ label, icon: Icon, href, state }, index) => (
        <li className="flex items-center gap-2" key={label}>
          {index > 0 && <span className="h-px w-5 bg-border sm:w-12" />}
          <Link
            href={href}
            className="group flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span
              className={`flex size-7 items-center justify-center rounded-full transition-colors group-hover:bg-primary ${state === "upcoming" ? "bg-muted text-muted-foreground group-hover:text-primary-foreground" : "bg-primary text-primary-foreground"}`}
            >
              {state === "complete" ? (
                <Check className="size-4" />
              ) : (
                <Icon className="size-4" />
              )}
            </span>
            <span
              className={`${state === "upcoming" ? "text-muted-foreground" : "text-foreground"} group-hover:text-primary`}
            >
              {label}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
