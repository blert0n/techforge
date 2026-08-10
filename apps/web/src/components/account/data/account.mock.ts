import { AccountMenuItem, UserProfile, Address } from "../types";

import {
  Gauge,
  Box,
  Heart,
  MapPin,
  CreditCard,
  Star,
  Settings,
} from "lucide-react";

export const accountMenu = [
  {
    label: "Dashboard",
    href: "/account/dashboard",
    icon: Gauge,
  },
  {
    label: "Orders",
    href: "/account/orders",
    icon: Box,
  },
  {
    label: "Wishlist",
    href: "/account/wishlist",
    icon: Heart,
  },
  {
    label: "Saved Addresses",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    label: "Product Reviews",
    href: "/account/reviews",
    icon: Star,
  },
  {
    label: "Account Settings",
    href: "/account/settings",
    icon: Settings,
    settings: true,
  },
];
