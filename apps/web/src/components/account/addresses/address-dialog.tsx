import { Controller, useForm } from "react-hook-form";
import { BriefcaseBusiness, House, Package, Phone, Save } from "lucide-react";
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
import type { Address, AddressInput, AddressType } from "./types";
type AddressValues = AddressInput;
const types: { value: AddressType; icon: typeof House }[] = [
  { value: "Home", icon: House },
  { value: "Work", icon: BriefcaseBusiness },
  { value: "Other", icon: Package },
];
export function AddressDialog({
  address,
  onClose,
  onSave,
}: {
  address: Address | null;
  onClose: () => void;
  onSave: (values: AddressValues) => void;
}) {
  const defaultValues: AddressValues = address
    ? { ...address, line2: address.line2 ?? undefined }
    : {
        type: "Home",
        firstName: "",
        lastName: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "United States",
        phone: "",
        isDefault: false,
      };
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddressValues>({
    defaultValues,
  });
  const type = watch("type");
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <Button
        type="button"
        variant="ghost"
        className="absolute inset-0 size-auto rounded-none bg-black/50 hover:bg-black/50"
        onClick={onClose}
        aria-label="Close address dialog"
      />
      <form
        onSubmit={handleSubmit(onSave)}
        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-card shadow-xl"
      >
        <header className="border-b border-border p-6">
          <h2 className="text-lg font-bold uppercase">
            {address ? "Edit Address" : "Add New Address"}
          </h2>
          <p className="text-xs text-muted-foreground">
            Fill in the details below to save your address.
          </p>
        </header>
        <div className="space-y-5 p-6">
          <div>
            <Label className="mb-2 text-xs uppercase">Address Type</Label>
            <div className="flex gap-3">
              {types.map(({ value, icon: Icon }) => (
                <Button
                  key={value}
                  type="button"
                  variant={type === value ? "secondary" : "outline"}
                  className="flex-1"
                  onClick={() => setValue("type", value)}
                >
                  <Icon />
                  {value}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" error={errors.firstName?.message}>
              <Input
                {...register("firstName", {
                  required: "First name is required",
                })}
              />
            </Field>
            <Field label="Last name" error={errors.lastName?.message}>
              <Input
                {...register("lastName", { required: "Last name is required" })}
              />
            </Field>
          </div>
          <Field label="Phone number" error={errors.phone?.message}>
            <div className="relative">
              <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                {...register("phone", { required: "Phone number is required" })}
              />
            </div>
          </Field>
          <Field label="Address line 1" error={errors.line1?.message}>
            <Input
              {...register("line1", { required: "Address is required" })}
            />
          </Field>
          <Field label="Address line 2">
            <Input {...register("line2")} />
          </Field>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label="City" error={errors.city?.message}>
              <Input {...register("city", { required: "City is required" })} />
            </Field>
            <Field label="State" error={errors.state?.message}>
              <Input
                {...register("state", { required: "State is required" })}
              />
            </Field>
            <Field label="ZIP code" error={errors.postalCode?.message}>
              <Input
                {...register("postalCode", {
                  required: "ZIP code is required",
                })}
              />
            </Field>
          </div>
          <div>
            <Label className="mb-2 text-xs uppercase">Country</Label>
            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United Kingdom">
                      United Kingdom
                    </SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
            <Controller
              control={control}
              name="isDefault"
              render={({ field }) => (
                <Checkbox
                  id="set-default"
                  checked={field.value}
                  onCheckedChange={(value) => field.onChange(value === true)}
                />
              )}
            />
            <Label htmlFor="set-default">Set as default shipping address</Label>
          </div>
        </div>
        <footer className="flex justify-between gap-3 border-t border-border p-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <Save />
            Save address
          </Button>
        </footer>
      </form>
    </div>
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
    <div>
      <Label className="mb-1.5 text-xs uppercase">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
