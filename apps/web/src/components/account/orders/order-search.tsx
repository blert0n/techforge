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
export type OrderFilters = {
  search: string;
  status:
    "all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled";
};

const statusLabels: Record<OrderFilters["status"], string> = {
  all: "All Orders",
  pending: "Pending",
  processing: "Processing",
  shipped: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function OrderSearch({
  onChange,
}: {
  onChange: (values: OrderFilters) => void;
}) {
  const { control, register, handleSubmit, getValues } = useForm<OrderFilters>({
    defaultValues: { search: "", status: "all" },
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
          <Select
            value={field.value}
            onValueChange={(value) => {
              const status = value as OrderFilters["status"];
              field.onChange(status);
              onChange({ ...getValues(), status });
            }}
          >
            <SelectTrigger aria-label="Filter orders by status">
              <SelectValue>{statusLabels[field.value]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </form>
  );
}
