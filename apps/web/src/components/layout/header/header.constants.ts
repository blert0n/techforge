import { User, Heart } from "lucide-react";

export const allCategoriesOption = {
  value: "all",
  label: "All Categories",
};

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
