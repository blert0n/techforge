import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type WishlistFilters = {
  categoryId?: number;
  sort: "Date Added" | "Price: Low to High" | "Price: High to Low" | "Name A–Z";
};

export function WishlistToolbar({
  categories,
  onChange,
}: {
  categories: { id: number; name: string }[];
  onChange: (filters: WishlistFilters) => void;
}) {
  const [filters, setFilters] = useState<WishlistFilters>({
    sort: "Date Added",
  });

  const update = (next: Partial<WishlistFilters>) => {
    const value = { ...filters, ...next };
    setFilters(value);
    onChange(value);
  };

  return (
    <form className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <ScrollArea className="min-w-0 flex-1">
        <div className="flex w-max items-center gap-2 pb-2">
          <span className="mr-2 shrink-0 text-xs font-bold uppercase">
            Category:
          </span>
          <Button
            type="button"
            size="sm"
            className="shrink-0"
            variant={filters.categoryId === undefined ? "default" : "secondary"}
            onClick={() => update({ categoryId: undefined })}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              type="button"
              size="sm"
              className="shrink-0"
              variant={
                filters.categoryId === category.id ? "default" : "secondary"
              }
              onClick={() => update({ categoryId: category.id })}
            >
              {category.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase">Sort:</span>
        <Select
          value={filters.sort}
          onValueChange={(value) =>
            update({ sort: value as WishlistFilters["sort"] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Date Added">Date Added</SelectItem>
            <SelectItem value="Price: Low to High">
              Price: Low to High
            </SelectItem>
            <SelectItem value="Price: High to Low">
              Price: High to Low
            </SelectItem>
            <SelectItem value="Name A–Z">Name A–Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </form>
  );
}
