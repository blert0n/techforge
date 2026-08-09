"use client";
import { useState } from "react";
import { Info, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useUpdateAddress,
} from "@/hooks/use-addresses";
import { AddressCard } from "./address-card";
import { AddressDialog } from "./address-dialog";
import { AddressUsage } from "./address-usage";
import type { Address, AddressInput } from "./types";
export default function AddressesPage() {
  const [editing, setEditing] = useState<Address | null | undefined>(undefined);
  const { data: addresses = [], isLoading, isError } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const save = async (values: AddressInput) => {
    try {
      if (editing) {
        await updateAddress.mutateAsync({ id: editing.id, values });
        toast.success("Address updated", {
          position: "top-center",
        });
      } else {
        await createAddress.mutateAsync(values);
        toast.success("Address added", {
          position: "top-center",
        });
      }

      setEditing(undefined);
    } catch (error) {
      toast.error("Unable to save address", {
        position: "top-center",
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  const removeAddress = async (id: string) => {
    try {
      await deleteAddress.mutateAsync(id);
      toast.success("Address deleted", {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Unable to delete address", {
        position: "top-center",
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  const setDefaultAddress = async (id: string) => {
    const selectedAddress = addresses.find((address) => address.id === id);
    if (!selectedAddress) return;

    try {
      const {
        id: _id,
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        line2,
        ...values
      } = selectedAddress;
      await updateAddress.mutateAsync({
        id,
        values: { ...values, line2: line2 ?? undefined, isDefault: true },
      });
      toast.success("Default address updated", {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Unable to set default address", {
        position: "top-center",
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };
  return (
    <div className="space-y-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold uppercase">Saved Addresses</h1>
          <p className="text-muted-foreground">
            Manage your shipping and billing addresses for faster checkout.
          </p>
        </div>
        <Button type="button" onClick={() => setEditing(null)}>
          <Plus />
          Add new address
        </Button>
      </header>
      <div className="flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
        <Info className="size-5 shrink-0 text-primary" />
        <p>
          Your <b className="text-primary">default address</b> is automatically
          pre-selected during checkout. You can change this at any time.
        </p>
      </div>
      {isError && (
        <p className="text-sm text-destructive">
          We couldn&apos;t load your saved addresses. Please try again.
        </p>
      )}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading addresses...</p>
        )}
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            onEdit={setEditing}
            onDelete={removeAddress}
            onSetDefault={setDefaultAddress}
          />
        ))}
        <Button
          type="button"
          variant="ghost"
          onClick={() => setEditing(null)}
          className="h-auto min-h-60 flex-col border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:bg-primary/5 hover:text-primary"
        >
          <Plus className="size-8" />
          Add New Address
          <span className="text-xs font-normal">
            Click to add a new shipping or billing address
          </span>
        </Button>
      </div>
      <AddressUsage />
      {editing !== undefined && (
        <AddressDialog
          address={editing}
          onClose={() => setEditing(undefined)}
          onSave={save}
        />
      )}
    </div>
  );
}
