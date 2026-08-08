import {
  BriefcaseBusiness,
  Check,
  CircleDot,
  Edit3,
  House,
  Package,
  Phone,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Address } from "./types";
const typeIcon = { Home: House, Work: BriefcaseBusiness, Other: Package };
export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}) {
  const Icon = typeIcon[address.type];
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:border-primary/40 ${address.isDefault ? "border-2 border-primary" : "border-border"}`}
    >
      <div className={`h-1 ${address.isDefault ? "bg-primary" : "bg-muted"}`} />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-5 flex items-start justify-between">
          <div className="flex gap-2">
            {address.isDefault && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase text-primary-foreground">
                <Check className="size-3" />
                Default
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold uppercase text-muted-foreground">
              <Icon className="size-3" />
              {address.type}
            </span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(address)}
            >
              <Edit3 />
              <span className="sr-only">Edit address</span>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive"
              onClick={() => onDelete(address.id)}
            >
              <Trash2 />
              <span className="sr-only">Delete address</span>
            </Button>
          </div>
        </div>
        <div className="flex-1 space-y-1.5 text-sm text-muted-foreground">
          <p className="font-bold text-foreground">
            {address.firstName} {address.lastName}
          </p>
          <p>{address.line1}</p>
          {address.line2 && <p>{address.line2}</p>}
          <p>
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p>{address.country}</p>
          <p className="flex items-center gap-1.5 pt-1">
            <Phone className="size-3 text-primary" />
            {address.phone}
          </p>
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          {address.isDefault ? (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              Verified address
            </span>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => onSetDefault(address.id)}
            >
              <CircleDot />
              Set as default
            </Button>
          )}
          <Button
            type="button"
            variant="link"
            size="sm"
            onClick={() => onEdit(address)}
          >
            Edit address
          </Button>
        </div>
      </div>
    </article>
  );
}
