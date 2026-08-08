import { AccountMenuItem, WishlistItem, UserProfile, Address } from "../types";

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
    label: "Orders & Tracking",
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

export const userProfile: UserProfile = {
  name: "Alex Smith",
  email: "alex@example.com",
  phone: "+1 (555) 123-4567",
};

export const defaultAddress: Address = {
  name: "Alex Smith",
  line1: "123 Tech Avenue, Suite 400",
  line2: "San Francisco, CA 94105",
  country: "United States",
};

export const wishlistItems: WishlistItem[] = [
  {
    name: 'Alienware AW3423DWF 34" QD-OLED',
    price: "$999.99",
    icon: "fa-display",
  },
  {
    name: "Corsair Dominator Platinum RGB 64GB DDR5",
    price: "$279.99",
    icon: "fa-memory",
  },
];

export const recentOrder = {
  id: "TF-89420-11",
  placedAt: "Oct 24, 2023",
  status: "Shipped",
  total: "$1,399.63",
  title: "Intel Core i9-13900K & ASUS ROG Motherboard",
  itemCount: 5,
  progress: 66,

  items: [
    {
      id: 1,
      name: "Intel Core i9-13900K",
      image: "/images/home/categories-cpu.png",
    },
    {
      id: 2,
      name: "ASUS ROG Maximus",
      image: "/images/home/categories-desktop.png",
    },
    {
      id: 3,
      name: "Corsair DDR5",
      image: "/images/home/categories-desktop.png",
    },
    {
      id: 4,
      name: "Samsung 990 Pro",
      image: "/images/home/categories-accessory.png",
    },
    {
      id: 5,
      name: "RTX 5090",
      image: "/images/home/categories-gpu.png",
    },
  ],
};
