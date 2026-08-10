"use client";
import { useAddresses } from "@/hooks/use-addresses";
import { Info, Plus } from "lucide-react";
import Link from "next/link";

export default function AddressCard() {
  const { data: addresses = [] } = useAddresses();
  const defaultAddress = addresses.find((address) => address.isDefault);
  const otherAddresses = addresses.find((address) => !address.isDefault);

  return (
    <section className="flex h-full flex-col rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border p-6">
        <h2 className="text-lg font-bold uppercase tracking-wider text-foreground">
          Default Address
        </h2>

        <Link
          href="/account/addresses"
          className="text-sm font-medium text-primary hover:underline"
        >
          Manage
        </Link>
      </div>

      <div className="flex min-h-56 flex-1 flex-col p-6">
        {defaultAddress ? (
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">
                {defaultAddress.firstName} {defaultAddress.lastName}
              </p>

              <p className="text-sm text-muted-foreground">
                {defaultAddress.line1}
              </p>

              {defaultAddress.line2 && (
                <p className="text-sm text-muted-foreground">
                  {defaultAddress.line2}
                </p>
              )}

              <p className="text-sm text-muted-foreground">
                {defaultAddress.city}, {defaultAddress.state}{" "}
                {defaultAddress.postalCode}
              </p>

              <p className="text-sm text-muted-foreground">
                {defaultAddress.country}
              </p>
            </div>

            <span
              className="
              rounded
              bg-muted
              px-2
              py-1
              text-[10px]
              font-bold
              uppercase
              tracking-wider
              text-muted-foreground
            "
            >
              Default
            </span>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-lg p-4 text-sm text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>
              Choose a saved address and set it as your default for faster
              checkout.
            </p>
          </div>
        )}

        <Link
          href="/account/addresses"
          className="
            mt-auto
            pt-6
            flex
            items-center
            gap-2
            text-sm
            font-bold
            text-primary
            transition-colors
            hover:text-primary/80
          "
        >
          <Plus className="h-4 w-4" />
          Add New Address
        </Link>
      </div>
    </section>
  );
}
