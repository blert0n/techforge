"use client";
import { useState } from "react";
import { initialCartItems } from "./cart.data";
import { CartItem } from "./cart-item";
import { CartRecommendations } from "./cart-recommendations";
import { CartSummary } from "./cart-summary";
export default function CartPage() {
  const [items, setItems] = useState(initialCartItems);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.07;
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row md:px-8">
      <section className="w-full lg:w-2/3">
        <div className="mb-6 flex items-end justify-between border-b border-border pb-4">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <span className="text-sm text-muted-foreground">Price</span>
        </div>
        <div>
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onChange={(quantity) =>
                setItems((current) =>
                  current.map((entry) =>
                    entry.id === item.id ? { ...entry, quantity } : entry,
                  ),
                )
              }
              onRemove={() =>
                setItems((current) =>
                  current.filter((entry) => entry.id !== item.id),
                )
              }
            />
          ))}
        </div>
        <p className="mt-6 text-right text-lg">
          Subtotal ({items.length} items): <b>${subtotal.toFixed(2)}</b>
        </p>
        <CartRecommendations />
      </section>
      <CartSummary subtotal={subtotal} tax={tax} />
    </main>
  );
}
