"use client";

import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Box,
  CheckCircle2,
  ImagePlus,
  PackagePlus,
  Save,
  Settings2,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type FieldFormat = "text" | "number" | "boolean";

type SpecificationField = {
  key: string;
  label: string;
  format: FieldFormat;
  unit?: string;
  filterable?: boolean;
};

const catalogCategories: Array<{
  value: string;
  label: string;
  attributePrefix: string;
  fields: SpecificationField[];
}> = [
  {
    value: "graphics-cards",
    label: "Graphics Cards",
    attributePrefix: "gpu",
    fields: [
      { key: "graphicsEngine", label: "Graphics engine", format: "text" },
      { key: "vramGb", label: "Video memory", format: "number", unit: "GB", filterable: true },
      { key: "cudaCores", label: "CUDA cores", format: "number" },
      { key: "boostClockMhz", label: "Boost clock", format: "number", unit: "MHz" },
      { key: "recommendedPsuWatts", label: "Recommended PSU", format: "number", unit: "W", filterable: true },
      { key: "powerConnectors", label: "Power connectors", format: "text" },
    ],
  },
  {
    value: "processors",
    label: "Processors",
    attributePrefix: "cpu",
    fields: [
      { key: "socket", label: "Socket", format: "text", filterable: true },
      { key: "cores", label: "Core count", format: "number", filterable: true },
      { key: "threads", label: "Thread count", format: "number" },
      { key: "baseClockGhz", label: "Base clock", format: "number", unit: "GHz" },
      { key: "boostClockGhz", label: "Boost clock", format: "number", unit: "GHz" },
      { key: "tdpWatts", label: "TDP", format: "number", unit: "W", filterable: true },
    ],
  },
  {
    value: "solid-state-drives",
    label: "Solid State Drives",
    attributePrefix: "storage",
    fields: [
      { key: "capacityGb", label: "Capacity", format: "number", unit: "GB", filterable: true },
      { key: "interface", label: "Interface", format: "text", filterable: true },
      { key: "formFactor", label: "Form factor", format: "text", filterable: true },
      { key: "readSpeedMbps", label: "Sequential read", format: "number", unit: "MB/s" },
      { key: "writeSpeedMbps", label: "Sequential write", format: "number", unit: "MB/s" },
    ],
  },
  {
    value: "memory",
    label: "Memory",
    attributePrefix: "memory",
    fields: [
      { key: "memoryType", label: "Memory type", format: "text", filterable: true },
      { key: "capacityGb", label: "Capacity", format: "number", unit: "GB", filterable: true },
      { key: "modules", label: "Module count", format: "number" },
      { key: "speedMtps", label: "Speed", format: "number", unit: "MT/s", filterable: true },
      { key: "casLatency", label: "CAS latency", format: "number" },
    ],
  },
];

const brands = ["AMD", "ASUS", "Corsair", "Intel", "Samsung"];

const productFormSchema = z.object({
  name: z.string().min(2, "Enter a product name."),
  slug: z.string().min(2, "Enter a URL slug."),
  sku: z.string().min(2, "Enter a SKU."),
  brand: z.string().min(1, "Select a brand."),
  category: z.string().min(1, "Select a category."),
  description: z.string().min(20, "Description must be at least 20 characters."),
  price: z.coerce.number().positive("Enter a valid price."),
  discountPrice: z.union([z.literal(""), z.coerce.number().positive()]),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
  status: z.enum(["draft", "active"]),
  imageUrl: z.union([z.literal(""), z.string().url("Enter a valid image URL.")]),
  imageAltText: z.string(),
  specifications: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  attributeKeys: z.array(z.string()),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewProductPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      sku: "",
      brand: "",
      category: "graphics-cards",
      description: "",
      price: 0,
      discountPrice: "",
      stock: 0,
      status: "draft",
      imageUrl: "",
      imageAltText: "",
      specifications: {},
      attributeKeys: ["vramGb", "recommendedPsuWatts"],
    },
  });

  const categorySlug = watch("category");
  const selectedCategory =
    catalogCategories.find((category) => category.value === categorySlug) ??
    catalogCategories[0];
  const selectedAttributes = watch("attributeKeys");

  useEffect(() => {
    setValue(
      "attributeKeys",
      selectedCategory.fields
        .filter((field) => field.filterable)
        .map((field) => field.key),
    );
  }, [selectedCategory, setValue]);

  async function onSubmit(values: ProductFormValues) {
    const specifications = Object.fromEntries(
      selectedCategory.fields
        .map((field) => [field.key, values.specifications[field.key]] as const)
        .filter(([, value]) => value !== undefined && value !== ""),
    );
    const attributes = values.attributeKeys
      .filter((key) => specifications[key] !== undefined)
      .map((key) => ({
        attributeName: `${selectedCategory.attributePrefix}.${key}`,
        attributeValue: String(specifications[key]),
      }));

    // The current products endpoint is still a temporary stub. Keep the form
    // fully usable and make its eventual API payload explicit without claiming
    // that a database write succeeded.
    console.info("Product ready to create", {
      ...values,
      specifications,
      attributes,
    });
    toast.info("Product is ready to create", {
      description:
        "The product API is still a stub, so this form has not written to the database yet.",
    });
  }

  function setStatusAndSubmit(status: "draft" | "active") {
    setValue("status", status);
    void handleSubmit(onSubmit)();
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/admin/products"
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Products
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Add product</h1>
          <p className="text-sm text-muted-foreground">
            Create a product and define the technical details for its category.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">New catalog item</Badge>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border p-5">
              <PackagePlus className="size-5 text-primary" />
              <div>
                <h2 className="font-semibold text-foreground">Product details</h2>
                <p className="text-sm text-muted-foreground">Core catalog information.</p>
              </div>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <FormField label="Product name" error={errors.name?.message}>
                <Input
                  placeholder="e.g. AMD Ryzen 7 9800X3D"
                  {...register("name", {
                    onBlur: (event) => {
                      if (!getValues("slug")) setValue("slug", createSlug(event.target.value));
                    },
                  })}
                />
              </FormField>
              <FormField label="SKU" error={errors.sku?.message}>
                <Input placeholder="e.g. 100-100001084WOF" {...register("sku")} />
              </FormField>
              <FormField label="URL slug" error={errors.slug?.message}>
                <Input placeholder="amd-ryzen-7-9800x3d" {...register("slug")} />
              </FormField>
              <FormField label="Brand" error={errors.brand?.message}>
                <Controller
                  control={control}
                  name="brand"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="Select brand" /></SelectTrigger>
                      <SelectContent>{brands.map((brand) => <SelectItem key={brand} value={brand}>{brand}</SelectItem>)}</SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              <FormField label="Category" error={errors.category?.message}>
                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent>{catalogCategories.map((category) => <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>)}</SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              <FormField label="Visibility" error={errors.status?.message}>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="active">Active</SelectItem></SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Description" error={errors.description?.message}>
                  <Textarea className="min-h-28" placeholder="Describe the product, its capabilities, and included features." {...register("description")} />
                </FormField>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border p-5"><Settings2 className="size-5 text-primary" /><div><h2 className="font-semibold text-foreground">Technical specifications</h2><p className="text-sm text-muted-foreground">Fields are generated from the {selectedCategory.label} template.</p></div></div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              {selectedCategory.fields.map((field) => (
                <FormField key={field.key} label={field.label}>
                  {field.format === "boolean" ? (
                    <Controller control={control} name={`specifications.${field.key}`} render={({ field: inputField }) => <label className="flex h-8 items-center gap-2 text-sm text-muted-foreground"><Checkbox checked={inputField.value === true} onCheckedChange={(checked) => inputField.onChange(checked === true)} />Yes</label>} />
                  ) : (
                    <div className="relative"><Input type={field.format === "number" ? "number" : "text"} step="any" className={field.unit ? "pr-14" : undefined} {...register(`specifications.${field.key}`, { valueAsNumber: field.format === "number" })} />{field.unit ? <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">{field.unit}</span> : null}</div>
                  )}
                </FormField>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border p-5"><SlidersHorizontal className="size-5 text-primary" /><div><h2 className="font-semibold text-foreground">Filter attributes</h2><p className="text-sm text-muted-foreground">Choose specifications customers should be able to filter by.</p></div></div>
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              {selectedCategory.fields.filter((field) => field.filterable).map((field) => (
                <Controller key={field.key} control={control} name="attributeKeys" render={({ field: attributeField }) => {
                  const checked = attributeField.value.includes(field.key);
                  return <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50"><Checkbox checked={checked} onCheckedChange={(nextChecked) => attributeField.onChange(nextChecked ? [...attributeField.value, field.key] : attributeField.value.filter((key) => key !== field.key))} /><span><span className="block text-sm font-medium text-foreground">{field.label}</span><code className="text-xs text-muted-foreground">{selectedCategory.attributePrefix}.{field.key}</code></span></label>;
                }} />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border p-5"><Box className="size-5 text-primary" /><h2 className="font-semibold text-foreground">Pricing & inventory</h2></div>
            <div className="space-y-4 p-5">
              <FormField label="Price" error={errors.price?.message}><div className="relative"><span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">$</span><Input type="number" step="0.01" min="0" className="pl-7" {...register("price", { valueAsNumber: true })} /></div></FormField>
              <FormField label="Discount price" error={errors.discountPrice?.message}><div className="relative"><span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">$</span><Input type="number" step="0.01" min="0" className="pl-7" placeholder="Optional" {...register("discountPrice", { valueAsNumber: true })} /></div></FormField>
              <FormField label="Stock quantity" error={errors.stock?.message}><Input type="number" min="0" {...register("stock", { valueAsNumber: true })} /></FormField>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border p-5"><ImagePlus className="size-5 text-primary" /><h2 className="font-semibold text-foreground">Primary image</h2></div>
            <div className="space-y-4 p-5"><FormField label="Image URL" error={errors.imageUrl?.message}><Input placeholder="https://..." {...register("imageUrl")} /></FormField><FormField label="Alt text"><Input placeholder="Product name and angle" {...register("imageAltText")} /></FormField><p className="text-xs text-muted-foreground">Image uploads can be connected here when storage is added. This URL becomes position 0 in <code>product_images</code>.</p></div>
          </section>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary"><CheckCircle2 className="mb-2 size-5" />The selected template controls specification keys; selected filter fields will become <code>product_attributes</code>.</div>
          <div className="flex flex-col gap-2"><Button type="submit" size="lg" disabled={isSubmitting}><Save />Create product</Button><Button type="button" variant="outline" size="lg" onClick={() => setStatusAndSubmit("draft")}>Save as draft</Button></div>
        </aside>
      </form>
    </div>
  );
}

function FormField({ children, error, label }: { children: React.ReactNode; error?: string; label: string }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}{error ? <p className="text-xs text-destructive">{error}</p> : null}</div>;
}
