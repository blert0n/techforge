import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CartItemData } from "./types";
export function CartItem({
  item,
  onChange,
  onRemove,
}: {
  item: CartItemData;
  onChange: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <article className="flex flex-col gap-6 border-b border-border py-6 sm:flex-row">
      <div className="flex size-48 shrink-0 items-center justify-center rounded-lg border border-border bg-card p-4">
        <Image
          src={item.image}
          alt={item.name}
          width={180}
          height={180}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex justify-between gap-3">
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <b className="sm:hidden">${item.price.toFixed(2)}</b>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {item.description}
          </p>
          <span className="mt-3 inline-block rounded bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-600">
            In Stock
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex items-center rounded-md border border-border">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onChange(Math.max(1, item.quantity - 1))}
            >
              <Minus />
            </Button>
            <span className="w-10 text-center text-sm">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onChange(item.quantity + 1)}
            >
              <Plus />
            </Button>
          </div>
          <Button variant="link" size="sm">
            Save for later
          </Button>
          <Button
            variant="link"
            size="sm"
            className="text-destructive"
            onClick={onRemove}
          >
            Remove
          </Button>
        </div>
      </div>
      <b className="hidden text-xl sm:block">
        ${(item.price * item.quantity).toFixed(2)}
      </b>
    </article>
  );
}
