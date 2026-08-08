"use client";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { ChevronRight, Filter, Star } from "lucide-react";
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
import {
  ProductCard,
  type ProductCardData,
} from "@/components/products/product-card";

const products: ProductCardData[] = [
  {
    brand: "ASUS",
    name: "ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB GDDR6X",
    price: "$1,999.99",
    reviews: 128,
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_de1f131f31_87fb12c55157f4a9.png",
    rating: 4.5,
    specs: ["VRAM: 24GB GDDR6X", "Clock Speed: 2640 MHz"],
    stock: "In Stock",
  },
  {
    brand: "MSI",
    name: "MSI Gaming Radeon RX 7900 XTX 24GB GDDR6 PCI Express 4.0",
    price: "$949.99",
    oldPrice: "$999.99",
    reviews: 89,
    badge: "Save $50",
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_1376cc18d7_531723d2de67e9cc.png",
    rating: 4,
    specs: ["VRAM: 24GB GDDR6", "Clock Speed: 2500 MHz"],
    stock: "In Stock",
  },
  {
    brand: "GIGABYTE",
    name: "GIGABYTE GeForce RTX 4070 Ti WINDFORCE OC 12G Graphics Card",
    price: "$799.99",
    reviews: 210,
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_de1f131f31_87fb12c55157f4a9.png",
    rating: 5,
    specs: ["VRAM: 12GB GDDR6X", "Clock Speed: 2625 MHz"],
    stock: "Low Stock",
  },
  {
    brand: "Sapphire",
    name: "Sapphire PULSE AMD Radeon RX 7800 XT Gaming Graphics Card",
    price: "$499.99",
    reviews: 45,
    image:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/gen_1376cc18d7_531723d2de67e9cc.png",
    rating: 4,
    specs: ["VRAM: 16GB GDDR6", "Clock Speed: 2430 MHz"],
    stock: "In Stock",
  },
];
export default function ProductsPage() {
  const { control, register } = useForm({
    defaultValues: {
      nvidia: true,
      amd: false,
      asus: false,
      min: "",
      max: "",
      sort: "Featured",
    },
  });
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:flex-row md:px-8">
      <aside className="hidden w-64 shrink-0 space-y-6 md:block">
        <h2 className="text-lg font-semibold">Filters</h2>
        <FilterGroup title="Category">
          <CheckLine label="Graphics Cards (GPUs)" checked />
          <CheckLine label="Processors (CPUs)" />
          <CheckLine label="Motherboards" />
        </FilterGroup>
        <FilterGroup title="Brand">
          <CheckLine label="NVIDIA" {...register("nvidia")} />
          <CheckLine label="AMD" {...register("amd")} />
          <CheckLine label="ASUS" {...register("asus")} />
          <CheckLine label="MSI" />
          <CheckLine label="Gigabyte" />
        </FilterGroup>
        <FilterGroup title="Price">
          <div className="flex items-center gap-2">
            <Input placeholder="Min" {...register("min")} />
            <span>–</span>
            <Input placeholder="Max" {...register("max")} />
            <Button type="button" size="sm" variant="secondary">
              Go
            </Button>
          </div>
        </FilterGroup>
        <FilterGroup title="Customer Reviews">
          <div className="space-y-2">
            <RatingLine count={4} />
            <RatingLine count={3} />
          </div>
        </FilterGroup>
      </aside>
      <section className="min-w-0 flex-1">
        <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="size-3" />
          <span>PC Components</span>
          <ChevronRight className="size-3" />
          <b className="text-foreground">Graphics Cards</b>
        </nav>
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">Graphics Cards (GPUs)</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Showing 1–24 of 245 results
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="md:hidden" variant="outline">
              <Filter />
              Filters
            </Button>
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Controller
              control={control}
              name="sort"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Featured">Featured</SelectItem>
                    <SelectItem value="Price: Low to High">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="Price: High to Low">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="Avg. Customer Review">
                      Avg. Customer Review
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.name}
              product={product}
              variant="listing"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-4 first:border-0 first:pt-0">
      <h3 className="mb-3 text-sm font-medium">{title}</h3>
      {children}
    </section>
  );
}
function CheckLine({
  label,
  checked,
  ...props
}: { label: string; checked?: boolean } & React.ComponentProps<
  typeof Checkbox
>) {
  return (
    <Label className="mb-2 cursor-pointer text-sm font-normal">
      <Checkbox defaultChecked={checked} {...props} />
      {label}
      {label.includes("GPU") && (
        <span className="ml-auto text-xs text-muted-foreground">245</span>
      )}
    </Label>
  );
}
function RatingLine({ count }: { count: number }) {
  return (
    <Label className="cursor-pointer text-sm font-normal">
      <Checkbox />{" "}
      <span className="flex text-yellow-500">
        {Array.from({ length: count }).map((_, index) => (
          <Star key={index} className="size-3 fill-current" />
        ))}
      </span>
      & Up
    </Label>
  );
}
