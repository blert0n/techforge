import { ImageIcon } from "lucide-react";

type OrderItem = {
  id: string;
  productName: string;
  imageUrl: string | null;
};

export default function OrderImages({ items }: { items: OrderItem[] }) {
  const visible = items.slice(0, 3);
  const remaining = items.length - visible.length;

  return (
    <div className="flex shrink-0 -space-x-4">
      {visible.map((item, index) => (
        <div
          key={item.id}
          className="relative grid h-16 w-16 place-items-center overflow-hidden rounded-lg border-2 border-card bg-muted"
          style={{ zIndex: visible.length - index }}
        >
          {item.imageUrl ? (
            <img
              alt={item.productName}
              className="size-full object-contain p-1"
              src={item.imageUrl}
            />
          ) : (
            <ImageIcon className="size-5 text-muted-foreground" />
          )}
        </div>
      ))}
      {remaining > 0 && (
        <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-card bg-muted text-sm font-semibold text-muted-foreground">
          +{remaining}
        </div>
      )}
    </div>
  );
}
