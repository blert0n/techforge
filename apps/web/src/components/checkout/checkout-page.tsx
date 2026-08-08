"use client";

import { useForm } from "react-hook-form";
import { CheckoutForm } from "./checkout-form";
import { CheckoutSteps } from "./checkout-steps";
import { CheckoutSummary } from "./checkout-summary";
import type { CheckoutFormValues } from "./types";

const defaultValues: CheckoutFormValues = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
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
          onSubmit={(values) => console.log("Checkout submitted", values)}
        />
        <CheckoutSummary />
      </div>
    </main>
  );
}
