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
import {
  ProductImageManager,
  type ProductImageValue,
} from "@/components/admin/products/product-image-manager";
import {
  useCatalogBrands,
  useCatalogCategories,
  useCreateCatalogBrand,
} from "@/hooks/use-catalog";
import { useCreateProduct, useUpdateProduct } from "@/hooks/use-products";
import { getEditableProduct } from "@/services/products";
import type { SpecificationTemplateField } from "@/services/catalog";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ArrowLeft,
  Box,
  CheckCircle2,
  LoaderCircle,
  PackagePlus,
  Plus,
  Save,
  Settings2,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type ProductTemplateField = {
  key: string;
  label: string;
  format: "text" | "number" | "boolean";
  unit?: string;
};

const productFormSchema = z.object({
  name: z.string().min(2, "Enter a product name."),
  slug: z.string().min(2, "Enter a URL slug."),
  sku: z.string().min(2, "Enter a SKU."),
  brandId: z.coerce.number().int().positive("Select a brand."),
  categoryId: z.coerce.number().int().positive("Select a category."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters."),
  price: z.coerce.number().positive("Enter a valid price."),
  discountPrice: z.union([z.literal(""), z.coerce.number().positive()]),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
  status: z.enum(["draft", "active"]),
  images: z
    .array(
      z.object({
        url: z.string().url("Enter a valid image URL."),
        altText: z.string().max(250, "Alt text is too long."),
      }),
    )
    .max(12, "A product can have up to 12 images."),
  specifications: z.record(
    z.string(),
    z.union([z.string(), z.number(), z.boolean()]).optional(),
  ),
  attributeKeys: z.array(z.string()),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const defaultProductFormValues: ProductFormValues = {
  name: "",
  slug: "",
  sku: "",
  brandId: 0,
  categoryId: 0,
  description: "",
  price: 0,
  discountPrice: "",
  stock: 0,
  status: "active",
  images: [],
  specifications: {},
  attributeKeys: [],
};

function createSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toProductTemplateField(
  field: SpecificationTemplateField,
): ProductTemplateField {
  if (typeof field !== "string") return field;

  return {
    key: field,
    label: field.replace(/([a-z0-9])([A-Z])/g, "$1 $2"),
    format: "text",
  };
}

export function ProductFormPage({ editId }: { editId?: number }) {
  const isEditing = editId !== undefined;
  const editingId = editId ?? 0;
  const {
    data: categories,
    error: categoriesError,
    isLoading: categoriesLoading,
  } = useCatalogCategories();
  const {
    data: brands,
    error: brandsError,
    isLoading: brandsLoading,
  } = useCatalogBrands();
  const createBrand = useCreateCatalogBrand();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [formVersion, setFormVersion] = useState(0);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultProductFormValues,
  });

  const categoryId = watch("categoryId");
  const brandId = watch("brandId");
  const productName = watch("name");
  const images = watch("images");
  const selectedCategory = categories?.find(
    (category) => category.id === categoryId,
  );
  const selectedBrand = brands?.find((brand) => brand.id === brandId);
  const templateFields = (
    selectedCategory?.specificationTemplate?.fields ?? []
  ).map(toProductTemplateField);

  useEffect(() => {
    if (categoryId === 0 && categories?.[0]) {
      setValue("categoryId", categories[0].id);
    }
  }, [categories, categoryId, setValue]);

  useEffect(() => {
    setValue("attributeKeys", []);
  }, [categoryId, setValue]);

  useEffect(() => {
    if (!isEditing) return;
    void getEditableProduct(editingId)
      .then((product) => reset({ ...product, discountPrice: product.discountPrice ?? "" }))
      .catch((error) => toast.error("Unable to load product", { description: error instanceof Error ? error.message : undefined }));
  }, [editingId, isEditing, reset]);

  async function onSubmit(values: ProductFormValues) {
    if (!selectedCategory) return;

    const specifications: Record<string, string | number | boolean> = {};
    for (const field of templateFields) {
      const value = values.specifications[field.key];
      if (value !== undefined && value !== "" && !Number.isNaN(value)) {
        specifications[field.key] = value;
      }
    }
    try {
      const productValues = {
        name: values.name,
        slug: values.slug,
        sku: values.sku,
        brandId: values.brandId,
        categoryId: values.categoryId,
        description: values.description,
        price: values.price,
        discountPrice:
          typeof values.discountPrice === "number"
            ? values.discountPrice
            : null,
        stock: values.stock,
        status: values.status,
        images: values.images.map((image) => ({
          url: image.url,
          altText: image.altText || undefined,
        })),
        specifications,
        attributeKeys: values.attributeKeys.filter(
          (key) => specifications[key] !== undefined,
        ),
      };
      if (isEditing) {
        await updateProduct.mutateAsync({ id: editingId, values: productValues });
      } else {
        await createProduct.mutateAsync(productValues);
      }

      toast.success(`${values.name} was ${isEditing ? "updated" : "created"}.`, {
        position: "top-center",
        description:
          "Product details, specifications, images, and filters were saved.",
      });
      if (!isEditing) {
        reset({
          ...defaultProductFormValues,
          categoryId: values.categoryId,
        });
        setIsAddingBrand(false);
        setNewBrandName("");
        setFormVersion((current) => current + 1);
      }
    } catch (createError) {
      toast.error("Unable to create product", {
        position: "top-center",
        description:
          createError instanceof Error
            ? createError.message
            : "Please try again.",
      });
    }
  }

  function setStatusAndSubmit(status: "draft" | "active") {
    setValue("status", status);
    void handleSubmit(onSubmit)();
  }

  function submitProduct() {
    void handleSubmit(onSubmit, () => {
      toast.error("Product could not be created", {
        position: "top-center",
        description: "Complete the required fields and correct any invalid values.",
      });
    })();
  }

  function setImages(nextImages: ProductImageValue[]) {
    setValue("images", nextImages, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= images.length || from === to) return;

    const nextImages = [...images];
    const [movedImage] = nextImages.splice(from, 1);
    nextImages.splice(to, 0, movedImage);
    setImages(nextImages);
  }

  async function addBrand() {
    const name = newBrandName.trim();
    if (!name) {
      toast.error("Enter a brand name first.", {
        position: "top-center",
      });
      return;
    }

    try {
      const brand = await createBrand.mutateAsync(name);
      setValue("brandId", brand.id, { shouldValidate: true });
      setNewBrandName("");
      setIsAddingBrand(false);
      toast.success(`${brand.name} was added and selected.`, {
        position: "top-center",
      });
    } catch (createError) {
      toast.error("Unable to create brand", {
        position: "top-center",
        description:
          createError instanceof Error
            ? createError.message
            : "Please try again.",
      });
    }
  }

  if (categoriesLoading || brandsLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center text-muted-foreground">
        <LoaderCircle className="mr-2 size-5 animate-spin" />
        Loading catalog data...
      </div>
    );
  }

  if (categoriesError || brandsError || !categories?.length || !brands) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-center gap-2 font-semibold text-destructive">
          <AlertCircle className="size-5" />
          Unable to load catalog data
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in as an administrator and make sure the catalog has been seeded.
        </p>
      </div>
    );
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
          <h1 className="text-2xl font-bold text-foreground">{isEditing ? "Edit product" : "Add product"}</h1>
          <p className="text-sm text-muted-foreground">
            Create a product and define the technical details for its category.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          New catalog item
        </Badge>
      </header>

      <form
        key={formVersion}
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          submitProduct();
        }}
        className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem]"
      >
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border p-5">
              <PackagePlus className="size-5 text-primary" />
              <div>
                <h2 className="font-semibold text-foreground">
                  Product details
                </h2>
                <p className="text-sm text-muted-foreground">
                  Core catalog information.
                </p>
              </div>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <FormField label="Product name" error={errors.name?.message}>
                <Input
                  placeholder="e.g. AMD Ryzen 7 9800X3D"
                  {...register("name", {
                    onBlur: (event) => {
                      if (!getValues("slug"))
                        setValue("slug", createSlug(event.target.value));
                    },
                  })}
                />
              </FormField>
              <FormField label="SKU" error={errors.sku?.message}>
                <Input
                  placeholder="e.g. 100-100001084WOF"
                  {...register("sku")}
                />
              </FormField>
              <FormField label="URL slug" error={errors.slug?.message}>
                <Input
                  placeholder="amd-ryzen-7-9800x3d"
                  {...register("slug")}
                />
              </FormField>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <Label>Brand</Label>
                  <button
                    className="text-xs font-medium text-primary hover:underline"
                    onClick={() => setIsAddingBrand((current) => !current)}
                    type="button"
                  >
                    {isAddingBrand ? "Cancel" : "Add brand"}
                  </button>
                </div>
                <Controller
                  control={control}
                  name="brandId"
                  render={({ field }) => (
                    <Select
                      value={field.value ? field.value.toString() : null}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {selectedBrand?.name ?? "Select brand"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem
                            key={brand.id}
                            value={brand.id.toString()}
                          >
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.brandId ? (
                  <p className="text-xs text-destructive">
                    {errors.brandId.message}
                  </p>
                ) : null}
                {isAddingBrand ? (
                  <div className="flex gap-2 rounded-xl border border-border bg-muted/30 p-2">
                    <Input
                      aria-label="New brand name"
                      className="h-8 bg-card"
                      onChange={(event) => setNewBrandName(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          void addBrand();
                        }
                      }}
                      placeholder="e.g. GIGABYTE"
                      value={newBrandName}
                    />
                    <Button
                      aria-label="Create brand"
                      disabled={createBrand.isPending}
                      onClick={() => void addBrand()}
                      size="icon-sm"
                      type="button"
                    >
                      {createBrand.isPending ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <Plus />
                      )}
                    </Button>
                    <Button
                      aria-label="Cancel creating brand"
                      onClick={() => {
                        setIsAddingBrand(false);
                        setNewBrandName("");
                      }}
                      size="icon-sm"
                      type="button"
                      variant="ghost"
                    >
                      <X />
                    </Button>
                  </div>
                ) : null}
              </div>
              <FormField label="Category" error={errors.categoryId?.message}>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select
                      value={field.value ? field.value.toString() : null}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue>
                          {selectedCategory?.name ?? "Select a category"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
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
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              <div className="sm:col-span-2">
                <FormField
                  label="Description"
                  error={errors.description?.message}
                >
                  <Textarea
                    className="min-h-28"
                    placeholder="Describe the product, its capabilities, and included features."
                    {...register("description")}
                  />
                </FormField>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border p-5">
              <Settings2 className="size-5 text-primary" />
              <div>
                <h2 className="font-semibold text-foreground">
                  Technical specifications
                </h2>
                <p className="text-sm text-muted-foreground">
                  Fields are generated from the {selectedCategory?.name}{" "}
                  template.
                </p>
              </div>
            </div>
            {templateFields.length ? (
              <div className="grid gap-4 p-5 sm:grid-cols-2">
                {templateFields.map((field) => (
                  <FormField key={field.key} label={field.label}>
                    {field.format === "boolean" ? (
                      <Controller
                        control={control}
                        name={`specifications.${field.key}`}
                        render={({ field: inputField }) => (
                          <label className="flex h-8 items-center gap-2 text-sm text-muted-foreground">
                            <Checkbox
                              checked={inputField.value === true}
                              onCheckedChange={(checked) =>
                                inputField.onChange(checked === true)
                              }
                            />
                            Yes
                          </label>
                        )}
                      />
                    ) : (
                      <div className="relative">
                        <Input
                          type={field.format === "number" ? "number" : "text"}
                          step="any"
                          className={field.unit ? "pr-14" : undefined}
                          {...register(`specifications.${field.key}`, {
                            setValueAs: (value) =>
                              field.format === "number" && value !== ""
                                ? Number(value)
                                : value === ""
                                  ? undefined
                                  : value,
                          })}
                        />
                        {field.unit ? (
                          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
                            {field.unit}
                          </span>
                        ) : null}
                      </div>
                    )}
                  </FormField>
                ))}
              </div>
            ) : (
              <p className="p-5 text-sm text-muted-foreground">
                This category has no specification template yet. Add one in
                Specification Templates before creating products in this
                category.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border p-5">
              <SlidersHorizontal className="size-5 text-primary" />
              <div>
                <h2 className="font-semibold text-foreground">
                  Filter attributes
                </h2>
                <p className="text-sm text-muted-foreground">
                  Choose specifications customers should be able to filter by.
                </p>
              </div>
            </div>
            {templateFields.length ? (
              <div className="grid gap-3 p-5 sm:grid-cols-2">
                {templateFields.map((field) => (
                  <Controller
                    key={field.key}
                    control={control}
                    name="attributeKeys"
                    render={({ field: attributeField }) => {
                      const checked = attributeField.value.includes(field.key);
                      return (
                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-muted/50">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(nextChecked) =>
                              attributeField.onChange(
                                nextChecked
                                  ? [...attributeField.value, field.key]
                                  : attributeField.value.filter(
                                      (key) => key !== field.key,
                                    ),
                              )
                            }
                          />
                          <span>
                            <span className="block text-sm font-medium text-foreground">
                              {field.label}
                            </span>
                            <code className="text-xs text-muted-foreground">
                              {selectedCategory?.attributePrefix}.{field.key}
                            </code>
                          </span>
                        </label>
                      );
                    }}
                  />
                ))}
              </div>
            ) : null}
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border p-5">
              <Box className="size-5 text-primary" />
              <h2 className="font-semibold text-foreground">
                Pricing & inventory
              </h2>
            </div>
            <div className="space-y-4 p-5">
              <FormField label="Price" error={errors.price?.message}>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    className="pl-7"
                    {...register("price", { valueAsNumber: true })}
                  />
                </div>
              </FormField>
              <FormField
                label="Discount price"
                error={errors.discountPrice?.message}
              >
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    className="pl-7"
                    placeholder="Optional"
                    {...register("discountPrice", {
                      setValueAs: (value) =>
                        value === "" ? "" : Number(value),
                    })}
                  />
                </div>
              </FormField>
              <FormField label="Stock quantity" error={errors.stock?.message}>
                <Input
                  type="number"
                  min="0"
                  {...register("stock", { valueAsNumber: true })}
                />
              </FormField>
            </div>
          </section>
          <ProductImageManager
            brandName={selectedBrand?.name}
            error={
              typeof errors.images?.message === "string"
                ? errors.images.message
                : undefined
            }
            images={images}
            onAdd={(image) => setImages([...images, image])}
            onAltTextChange={(index, altText) =>
              setValue(`images.${index}.altText`, altText, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            onMove={moveImage}
            onRemove={(index) =>
              setImages(images.filter((_, imageIndex) => imageIndex !== index))
            }
            productName={productName}
          />
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
            <CheckCircle2 className="mb-2 size-5" />
            The selected template controls specification keys; selected filter
            fields will become <code>product_attributes</code>.
          </div>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              size="lg"
              onClick={submitProduct}
              disabled={
                isSubmitting || createProduct.isPending || updateProduct.isPending || !selectedCategory
              }
            >
              {createProduct.isPending || updateProduct.isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Save />
              )}
              {isEditing ? "Save changes" : "Create product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => setStatusAndSubmit("draft")}
              disabled={createProduct.isPending || !selectedCategory}
            >
              Save as draft
            </Button>
          </div>
        </aside>
      </form>
    </div>
  );
}

export default function NewProductPage() {
  return <ProductFormPage />;
}

function FormField({
  children,
  error,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  label: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
