import Image from "next/image";
import { LoaderCircle, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Cart } from "@/services/cart";
export function CartItem({
  item,
  onChange,
  onRemove,
  isUpdating,
  isRemoving,
}: {
  item: Cart["items"][number];
  onChange: (quantity: number) => void;
  onRemove: () => void;
  isUpdating: boolean;
  isRemoving: boolean;
}) {
  const isPending = isUpdating || isRemoving;

  return (
    <article className="flex items-start gap-4 border-b border-border py-5 last:border-b-0 sm:gap-6 sm:py-6">
      <div className="flex size-24 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30 p-2 sm:size-40 sm:bg-card sm:p-4 lg:size-48">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={180}
            height={180}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-center text-sm text-muted-foreground">
            No image
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
        <div>
          <div className="flex justify-between gap-3">
            <h2 className="line-clamp-2 text-base font-semibold sm:text-xl">
              {item.name}
            </h2>
            <b className="shrink-0 sm:hidden">${item.lineTotal}</b>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{item.brand}</p>
          <span className="mt-3 inline-block rounded bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-600">
            In Stock
          </span>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-6 sm:gap-5">
          <div className="flex items-center rounded-md border border-border">
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={isPending}
              onClick={() =>
                item.quantity === 1 ? onRemove() : onChange(item.quantity - 1)
              }
            >
              <Minus />
            </Button>
            <span className="grid w-10 place-items-center text-sm">
              {isUpdating ? (
                <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
              ) : (
                item.quantity
              )}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={isPending}
              onClick={() => onChange(item.quantity + 1)}
            >
              <Plus />
            </Button>
          </div>
          <Button
            variant="link"
            size="sm"
            className="text-destructive"
            disabled={isPending}
            onClick={onRemove}
          >
            {isRemoving ? (
              <>
                <LoaderCircle className="animate-spin" />
                Removing...
              </>
            ) : (
              "Remove"
            )}
          </Button>
        </div>
      </div>
      <b className="hidden text-xl sm:block">${item.lineTotal}</b>
    </article>
  );
}
