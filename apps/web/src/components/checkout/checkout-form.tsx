"use client";

import { useEffect, useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddresses } from "@/hooks/use-addresses";
import { useCurrentUser } from "@/hooks/use-current-user";
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
  isSubmitting,
}: {
  form: UseFormReturn<CheckoutFormValues>;
  onSubmit: (values: CheckoutFormValues) => void;
  isSubmitting: boolean;
}) {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form;
  const { user } = useCurrentUser();
  const { data: addresses = [], isLoading: isLoadingAddresses } = useAddresses({
    enabled: Boolean(user),
  });
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const defaultAddress = addresses.find((address) => address.isDefault);
  const selectedAddress = addresses.find(
    (address) => address.id === selectedAddressId,
  );

  useEffect(() => {
    const address = defaultAddress ?? selectedAddress;
    if (!address) return;

    setValue("firstName", address.firstName);
    setValue("lastName", address.lastName);
    setValue("address", address.line1);
    setValue("apartment", address.line2 ?? "");
    setValue("country", address.country);
    setValue("city", address.city);
    setValue("state", address.state);
    setValue("postalCode", address.postalCode);
    setValue("phone", address.phone);
  }, [defaultAddress, selectedAddress, setValue]);

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <CheckoutSection id="shipping-address" title="Shipping address">
        {defaultAddress ? (
          <p className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            Your default saved address has been loaded.
          </p>
        ) : null}
        {!defaultAddress && addresses.length ? (
          <Field label="Use a saved address">
            <Select
              value={selectedAddressId}
              onValueChange={setSelectedAddressId}
            >
              <SelectTrigger className="w-full">
                <span className="flex-1 truncate text-left">
                  {selectedAddress
                    ? `${selectedAddress.type}: ${selectedAddress.line1}, ${selectedAddress.city}`
                    : "Choose a saved address"}
                </span>
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                {addresses.map((address) => (
                  <SelectItem key={address.id} value={address.id}>
                    {address.type}: {address.line1}, {address.city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        ) : null}
        {isLoadingAddresses ? (
          <p className="text-sm text-muted-foreground">
            Loading saved addresses...
          </p>
        ) : null}
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
        <Field label="Country" error={errors.country?.message}>
          <Input
            autoComplete="country-name"
            aria-invalid={!!errors.country}
            {...register("country", { required: "Country is required" })}
          />
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
        {user ? (
          <CheckField
            control={control}
            name="saveAddress"
            label="Save this address to my account"
          />
        ) : null}
      </CheckoutSection>
      <Button
        type="submit"
        className="h-12 w-full text-base"
        disabled={isSubmitting}
      >
        <LockKeyhole />
        {isSubmitting
          ? "Redirecting to secure payment..."
          : "Continue to secure payment"}
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
    <section
      id={id}
      className="scroll-mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
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
