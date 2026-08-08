import Image from "next/image";

type OrderItem = {
  id: number;
  name: string;
  image: string;
};

type Props = {
  items: OrderItem[];
};

export default function OrderImages({ items }: Props) {
  const visible = items.slice(0, 3);
  const remaining = items.length - visible.length;

  return (
    <div className="flex shrink-0 -space-x-4">
      {visible.map((item, index) => (
        <div
          key={item.id}
          className="relative h-16 w-16 overflow-hidden rounded-lg border-2 border-card bg-muted"
          style={{ zIndex: visible.length - index }}
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
          />
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
