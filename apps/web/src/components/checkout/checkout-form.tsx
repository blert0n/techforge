"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CheckoutFormValues } from "./types";

export function CheckoutForm({
  form,
  onSubmit,
}: {
  form: UseFormReturn<CheckoutFormValues>;
  onSubmit: (values: CheckoutFormValues) => void;
}) {
  const {
    register,
    control,
    formState: { errors },
  } = form;
  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <CheckoutSection title="Contact information">
        <Field label="Email address" error={errors.email?.message}>
          <Input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            {...register("email", { required: "Email is required" })}
          />
        </Field>
      </CheckoutSection>
      <CheckoutSection id="shipping-address" title="Shipping address">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" error={errors.firstName?.message}>
            <Input
              autoComplete="given-name"
              aria-invalid={!!errors.firstName}
              {...register("firstName", { required: "First name is required" })}
            />
          </Field>
          <Field label="Last name" error={errors.lastName?.message}>
            <Input
              autoComplete="family-name"
              aria-invalid={!!errors.lastName}
              {...register("lastName", { required: "Last name is required" })}
            />
          </Field>
        </div>
        <Field label="Address" error={errors.address?.message}>
          <Input
            autoComplete="street-address"
            placeholder="123 Main Street"
            aria-invalid={!!errors.address}
            {...register("address", { required: "Address is required" })}
          />
        </Field>
        <Field label="Apartment, suite, etc. (optional)">
          <Input autoComplete="address-line2" {...register("apartment")} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="City" error={errors.city?.message}>
            <Input
              autoComplete="address-level2"
              aria-invalid={!!errors.city}
              {...register("city", { required: "City is required" })}
            />
          </Field>
          <Field label="State">
            <Controller
              control={control}
              name="state"
              rules={{ required: "State is required" }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className="h-9 w-full"
                    aria-invalid={!!errors.state}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="WA">Washington</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="ZIP code" error={errors.postalCode?.message}>
            <Input
              autoComplete="postal-code"
              aria-invalid={!!errors.postalCode}
              {...register("postalCode", { required: "ZIP code is required" })}
            />
          </Field>
        </div>
        <Field label="Phone number" error={errors.phone?.message}>
          <Input
            type="tel"
            autoComplete="tel"
            placeholder="(555) 123-4567"
            aria-invalid={!!errors.phone}
            {...register("phone", { required: "Phone number is required" })}
          />
        </Field>
        <CheckField
          control={control}
          name="saveAddress"
          label="Save this address to my account"
        />
      </CheckoutSection>
      <CheckoutSection id="payment-method" title="Payment method">
        <div className="space-y-4 rounded-xl border border-border bg-muted/30 p-4">
          <Field label="Card number" error={errors.cardNumber?.message}>
            <Input
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="1234 1234 1234 1234"
              aria-invalid={!!errors.cardNumber}
              {...register("cardNumber", {
                required: "Card number is required",
              })}
            />
          </Field>
          <Field label="Name on card" error={errors.cardName?.message}>
            <Input
              autoComplete="cc-name"
              aria-invalid={!!errors.cardName}
              {...register("cardName", {
                required: "Name on card is required",
              })}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Expiration date" error={errors.expiry?.message}>
              <Input
                autoComplete="cc-exp"
                placeholder="MM / YY"
                aria-invalid={!!errors.expiry}
                {...register("expiry", {
                  required: "Expiration date is required",
                })}
              />
            </Field>
            <Field label="Security code" error={errors.cvc?.message}>
              <Input
                type="password"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="CVC"
                aria-invalid={!!errors.cvc}
                {...register("cvc", {
                  required: "Security code is required",
                })}
              />
            </Field>
          </div>
        </div>
        <CheckField
          control={control}
          name="billingSameAsShipping"
          label="Billing address is the same as shipping address"
        />
      </CheckoutSection>
      <Button type="submit" className="h-12 w-full text-base">
        <LockKeyhole />
        Place order securely
      </Button>
    </form>
  );
}

function CheckoutSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <h2 className="mb-5 text-xl font-bold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
function CheckField({
  control,
  name,
  label,
}: {
  control: UseFormReturn<CheckoutFormValues>["control"];
  name: "saveAddress" | "billingSameAsShipping";
  label: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex items-center gap-2">
          <Checkbox
            id={name}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
          <Label htmlFor={name}>{label}</Label>
        </div>
      )}
    />
  );
}
