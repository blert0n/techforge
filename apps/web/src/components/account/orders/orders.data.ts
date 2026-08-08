import { Fan, Gamepad2, Laptop, MemoryStick, Monitor } from "lucide-react";
import type { Order } from "./types";
export const orders: Order[] = [
  {
    id: "TF-89310-09",
    product: 'Alienware AW3423DWF 34" QD-OLED Monitor',
    itemCount: 1,
    date: "Sep 15, 2023",
    total: "$999.99",
    status: "Delivered",
    icon: Monitor,
  },
  {
    id: "TF-89280-08",
    product: "ASUS ROG Zephyrus G16 Gaming Laptop",
    itemCount: 1,
    date: "Oct 20, 2023",
    total: "$2,199.00",
    status: "Processing",
    icon: Laptop,
  },
  {
    id: "TF-89150-07",
    product: "Corsair Dominator Platinum 64GB DDR5 + 2TB NVMe SSD",
    itemCount: 2,
    date: "Aug 30, 2023",
    total: "$479.98",
    status: "Delivered",
    icon: MemoryStick,
  },
  {
    id: "TF-88970-06",
    product: "NZXT Kraken 360 AIO Liquid Cooler",
    itemCount: 1,
    date: "Aug 10, 2023",
    total: "$179.99",
    status: "Cancelled",
    icon: Fan,
  },
  {
    id: "TF-88740-05",
    product: "Logitech G Pro X Superlight 2 + Mechanical Keyboard Bundle",
    itemCount: 2,
    date: "Jul 22, 2023",
    total: "$299.98",
    status: "Delivered",
    icon: Gamepad2,
  },
];
