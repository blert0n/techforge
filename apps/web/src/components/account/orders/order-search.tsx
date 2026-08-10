import { Controller, useForm } from "react-hook-form";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrderStatus } from "./types";
type FilterValues = { search: string; status: "All Orders" | OrderStatus };
export function OrderSearch({
  onChange,
}: {
  onChange: (values: FilterValues) => void;
}) {
  const { control, register, handleSubmit, getValues } = useForm<FilterValues>({
    defaultValues: { search: "", status: "All Orders" },
  });
  const submit = () => onChange(getValues());
  return (
    <form
      onChange={handleSubmit(submit)}
      onSubmit={handleSubmit(submit)}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          {...register("search")}
          placeholder="Search orders..."
          className="w-full pl-9 sm:w-48"
        />
      </div>
      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger aria-label="Filter orders by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Orders">All Orders</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="In Transit">In Transit</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </form>
  );
}
