import type { CartItemData } from "./types";
export const initialCartItems: CartItemData[] = [
  {
    id: "cpu",
    name: "Intel Core i9-14900K",
    description: "24 Cores (8P+16E) up to 6.0 GHz, Desktop Processor",
    price: 549.99,
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_41ef1d00bd_76940be6d10c815f.png",
    quantity: 1,
  },
  {
    id: "board",
    name: "ASUS ROG Maximus Z790 Hero",
    description: "Intel Z790 LGA 1700 ATX Motherboard, DDR5, PCIe 5.0, WiFi 6E",
    price: 629.99,
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_07a049d52b_024b42b7811ef9eb.png",
    quantity: 1,
  },
];
