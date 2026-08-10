"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCart } from "@/hooks/use-cart";
import { useCreateCheckoutSession } from "@/hooks/use-payments";
import { toast } from "sonner";
import { CheckoutForm } from "./checkout-form";
import { CheckoutSteps } from "./checkout-steps";
import type { CheckoutFormValues } from "./types";

const defaultValues: CheckoutFormValues = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  country: "United States",
  city: "",
  state: "",
  postalCode: "",
  phone: "",
  saveAddress: true,
  paymentMethod: "card",
  cardNumber: "",
  cardName: "",
  expiry: "",
  cvc: "",
  billingSameAsShipping: true,
};

export function CheckoutPage() {
  const form = useForm<CheckoutFormValues>({ defaultValues });
  const createCheckout = useCreateCheckoutSession();
  const checkoutKey = useRef(crypto.randomUUID());
  const { data: cart } = useCart();
  const subtotal = Number(cart?.subtotal ?? 0);
  const tax = subtotal * 0.07;
  return (
    <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:py-12">
      <div className="mb-8 flex flex-col gap-6 border-b border-border pb-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-primary">Secure checkout</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              Complete your order
            </h1>
          </div>
          <CheckoutSteps />
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <CheckoutForm
          form={form}
          isSubmitting={createCheckout.isPending}
          onSubmit={(values) =>
            createCheckout.mutate(
              {
                checkoutKey: checkoutKey.current,
                shippingAddress: {
                  firstName: values.firstName,
                  lastName: values.lastName,
                  phone: values.phone,
                  line1: values.address,
                  line2: values.apartment || undefined,
                  city: values.city,
                  state: values.state,
                  postalCode: values.postalCode,
                  country: values.country,
                },
              },
              {
                onSuccess: ({ checkoutUrl }) =>
                  window.location.assign(checkoutUrl),
                onError: (error) =>
                  toast.error("Unable to start secure checkout", {
                    description: error.message,
                    position: "top-center",
                  }),
              },
            )
          }
        />
        <CartSummary
          subtotal={subtotal}
          tax={tax}
          showCheckoutActions={false}
          className="lg:w-full"
        />
      </div>
    </main>
  );
}
