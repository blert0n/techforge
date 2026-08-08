import type { CheckoutItem } from "./types";

export const checkoutItems: CheckoutItem[] = [
  {
    id: "cpu",
    name: "Intel Core i9-14900K",
    quantity: 1,
    price: 549.99,
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_41ef1d00bd_76940be6d10c815f.png",
  },
  {
    id: "board",
    name: "ASUS ROG Maximus Z790 Hero",
    quantity: 1,
    price: 629.99,
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_07a049d52b_024b42b7811ef9eb.png",
  },
];

export const checkoutSubtotal = checkoutItems.reduce(
  (total, item) => total + item.price * item.quantity,
  0,
);
export const checkoutTax = 82.6;
