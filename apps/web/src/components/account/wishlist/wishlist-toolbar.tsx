import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export type WishlistFilters = {
  filter: "All" | "In Stock" | "On Sale" | "Components" | "Peripherals";
  sort: "Date Added" | "Price: Low to High" | "Price: High to Low" | "Name A–Z";
};
const filterOptions: WishlistFilters["filter"][] = [
  "All",
  "In Stock",
  "On Sale",
  "Components",
  "Peripherals",
];
export function WishlistToolbar({
  onChange,
}: {
  onChange: (filters: WishlistFilters) => void;
}) {
  const { control, setValue, watch } = useForm<WishlistFilters>({
    defaultValues: { filter: "All", sort: "Date Added" },
  });
  const filter = watch("filter");
  const sort = watch("sort");
  const update = (
    key: keyof WishlistFilters,
    value: WishlistFilters[keyof WishlistFilters],
  ) => {
    setValue(key, value as never);
    onChange({
      filter: key === "filter" ? (value as WishlistFilters["filter"]) : filter,
      sort: key === "sort" ? (value as WishlistFilters["sort"]) : sort,
    });
  };
  return (
    <form className="flex flex-col justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-2 text-xs font-bold uppercase">Filter:</span>
        {filterOptions.map((option) => (
          <Button
            key={option}
            type="button"
            size="sm"
            variant={filter === option ? "default" : "secondary"}
            onClick={() => update("filter", option)}
          >
            {option}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase">Sort:</span>
        <Controller
          control={control}
          name="sort"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                update("sort", value as WishlistFilters["sort"]);
              }}
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
          )}
        />
      </div>
    </form>
  );
}
