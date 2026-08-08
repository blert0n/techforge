import { User, Heart } from "lucide-react";

export const categories = [
  {
    value: "All Categories",
    label: "All Categories",
  },
  {
    value: "Desktops",
    label: "Desktops",
  },
  {
    value: "Laptops",
    label: "Laptops",
  },
  {
    value: "Components",
    label: "Components",
  },
  {
    value: "Accessories",
    label: "Accessories",
  },
];

export const utilityLinks = [
  {
    label: "Today's Deals",
    href: "/deals",
  },
  {
    label: "Track Order",
    href: "/orders/track",
  },
  {
    label: "Help",
    href: "/help",
  },
];

export const accountActions = [
  {
    href: "/account/dashboard",
    mobileLabel: "Account",
    desktopTop: "Hello, Sign in",
    desktopLabel: "Account & Lists",
    icon: User,
    dropdown: true,
  },
  {
    href: "/account/orders",
    mobileLabel: "Orders",
    desktopTop: "Returns",
    desktopLabel: "& Orders",
    icon: Heart,
  },
];
