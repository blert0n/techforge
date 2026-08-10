"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Filter,
  PackageSearch,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import {
  getProducts,
  type StorefrontProductsResponse,
} from "@/services/products";
import { useDebounce } from "@/hooks/use-debounce";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const sortLabels = {
  featured: "Featured",
  "price-ascending": "Price: Low to High",
  "price-descending": "Price: High to Low",
} as const;

type SortValue = keyof typeof sortLabels;
type Filters = {
  minimumPrice: string;
  maximumPrice: string;
  selectedSpecifications: Record<string, string[]>;
  specificationRanges: Record<string, { min: string; max: string }>;
  minimumRating?: number;
  sort: SortValue;
};

export default function ProductsPage({
  data: initialData,
}: {
  data: StorefrontProductsResponse;
}) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.trim() || undefined;
  const [data, setData] = useState(initialData);
  const [filters, setFilters] = useState<Filters>({
    minimumPrice: "",
    maximumPrice: "",
    selectedSpecifications: {},
    specificationRanges: {},
    sort: "featured",
  });
  const [loading, setLoading] = useState(false);

  async function loadProducts(next: Filters) {
    setLoading(true);
    const minimum =
      next.minimumPrice === "" ? undefined : Number(next.minimumPrice);
    const maximum =
      next.maximumPrice === "" ? undefined : Number(next.maximumPrice);
    const specifications = Object.fromEntries([
      ...Object.entries(next.selectedSpecifications).filter(
        ([, values]) => values.length,
      ),
      ...Object.entries(next.specificationRanges)
        .filter(([, range]) => range.min || range.max)
        .map(([key, range]) => [
          key,
          {
            ...(range.min ? { min: Number(range.min) } : {}),
            ...(range.max ? { max: Number(range.max) } : {}),
          },
        ]),
    ]);
    const response = await getProducts({
      category: initialData.category?.slug,
      search,
      minPrice:
        minimum !== undefined && !Number.isNaN(minimum) ? minimum : undefined,
      maxPrice:
        maximum !== undefined && !Number.isNaN(maximum) ? maximum : undefined,
      minRating: next.minimumRating,
      specifications: Object.keys(specifications).length
        ? JSON.stringify(specifications)
        : undefined,
      sort: next.sort,
    });
    if (response) setData(response);
    setLoading(false);
  }
  const debouncedLoadProducts = useDebounce(loadProducts, 250);

  function updateFilters(update: Partial<Filters>) {
    setFilters((current) => {
      const next = { ...current, ...update };
      debouncedLoadProducts(next);
      return next;
    });
  }

  const category = data.category;
  const title = category?.name ?? "All Categories";
  const description =
    category?.description ??
    "Browse all active products in the TechForge catalog.";
  const leafCategories =
    category?.children.filter((child) => child.categoryIds.length === 1) ?? [];

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:flex-row md:px-8">
      <aside className="hidden w-64 shrink-0 md:block">
        <Card className="filter-scrollbar sticky top-36 max-h-[calc(100vh-10rem)] overflow-y-auto rounded-lg">
          <CardHeader className="sticky top-0 z-10 justify-start bg-card p-5">
            <div className="flex items-center gap-2">
              <Filter className="size-5 text-primary" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-5">
            {data.specificationFilters.length ? (
              <div className="space-y-1">
                {data.specificationFilters.map((filter) => (
                  <FilterGroup
                    key={filter.key}
                    title={
                      filter.unit
                        ? `${filter.label} (${filter.unit})`
                        : filter.label
                    }
                    collapsible
                  >
                    {filter.format === "number" ? (
                      <div className="flex items-center gap-2">
                        <Input
                          inputMode="numeric"
                          min="0"
                          onChange={(event) =>
                            updateFilters({
                              specificationRanges: {
                                ...filters.specificationRanges,
                                [filter.key]: {
                                  min: event.target.value,
                                  max:
                                    filters.specificationRanges[filter.key]
                                      ?.max ?? "",
                                },
                              },
                            })
                          }
                          placeholder="Min"
                          type="number"
                          value={
                            filters.specificationRanges[filter.key]?.min ?? ""
                          }
                        />
                        <span className="text-muted-foreground">–</span>
                        <Input
                          inputMode="numeric"
                          min="0"
                          onChange={(event) =>
                            updateFilters({
                              specificationRanges: {
                                ...filters.specificationRanges,
                                [filter.key]: {
                                  min:
                                    filters.specificationRanges[filter.key]
                                      ?.min ?? "",
                                  max: event.target.value,
                                },
                              },
                            })
                          }
                          placeholder="Max"
                          type="number"
                          value={
                            filters.specificationRanges[filter.key]?.max ?? ""
                          }
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filter.options.map((option) => {
                          const selectedValues =
                            filters.selectedSpecifications[filter.key] ?? [];
                          return (
                            <Label
                              key={option.value}
                              className="cursor-pointer text-sm font-normal"
                            >
                              <Checkbox
                                checked={selectedValues.includes(option.value)}
                                onCheckedChange={(checked) =>
                                  updateFilters({
                                    selectedSpecifications: {
                                      ...filters.selectedSpecifications,
                                      [filter.key]:
                                        checked === true
                                          ? [...selectedValues, option.value]
                                          : selectedValues.filter(
                                              (value) => value !== option.value,
                                            ),
                                    },
                                  })
                                }
                              />
                              {option.label}
                            </Label>
                          );
                        })}
                      </div>
                    )}
                  </FilterGroup>
                ))}
              </div>
            ) : null}
            <FilterGroup title="Price">
              <div className="flex items-center gap-2">
                <Input
                  inputMode="decimal"
                  min="0"
                  onChange={(event) =>
                    updateFilters({ minimumPrice: event.target.value })
                  }
                  placeholder="Min"
                  type="number"
                  value={filters.minimumPrice}
                />
                <span className="text-muted-foreground">–</span>
                <Input
                  inputMode="decimal"
                  min="0"
                  onChange={(event) =>
                    updateFilters({ maximumPrice: event.target.value })
                  }
                  placeholder="Max"
                  type="number"
                  value={filters.maximumPrice}
                />
              </div>
            </FilterGroup>
            <FilterGroup title="Customer reviews">
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <Label
                    key={rating}
                    className="cursor-pointer text-sm font-normal"
                  >
                    <Checkbox
                      checked={filters.minimumRating === rating}
                      onCheckedChange={(checked) =>
                        updateFilters({
                          minimumRating: checked === true ? rating : undefined,
                        })
                      }
                    />
                    <span className="flex items-center gap-0.5 text-yellow-500">
                      {Array.from({ length: rating }).map((_, index) => (
                        <Star key={index} className="size-3 fill-current" />
                      ))}
                    </span>
                    <span className="text-xs text-muted-foreground">& up</span>
                  </Label>
                ))}
              </div>
            </FilterGroup>
          </CardContent>
        </Card>
      </aside>

      <section className="min-w-0 flex-1">
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="size-3" />
          {category?.parents[0] ? (
            <>
              <Link
                href={`/category/${category.parents[0].slug}`}
                className="hover:text-primary"
              >
                {category.parents[0].name}
              </Link>
              <ChevronRight className="size-3" />
            </>
          ) : null}
          <b className="text-foreground">{title}</b>
        </nav>

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Showing {data.items.length} products
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="md:hidden" type="button" variant="outline">
              <Filter /> Filters
            </Button>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Sort by:
            </span>
            <Select
              value={filters.sort}
              onValueChange={(value) => {
                if (value && value in sortLabels)
                  updateFilters({ sort: value as SortValue });
              }}
            >
              <SelectTrigger>
                <SelectValue>{sortLabels[filters.sort]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-ascending">
                  Price: Low to High
                </SelectItem>
                <SelectItem value="price-descending">
                  Price: High to Low
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {leafCategories.length ? (
          <section className="mb-8">
            <h2 className="mb-3 text-lg font-semibold">Shop by category</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {leafCategories.map((child) => (
                <Link
                  key={child.id}
                  href={`/category/${child.slug}`}
                  className="rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {data.items.length ? (
          <div
            className={`grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${loading ? "opacity-50" : ""}`}
          >
            {data.items.map((product) => {
              const currentPrice = product.discountPrice ?? product.price;
              const discountPercentage =
                product.discountPrice === null
                  ? undefined
                  : Math.round((1 - currentPrice / product.price) * 100);
              const card: ProductCardData = {
                slug: product.slug,
                brand: product.brand,
                name: product.name,
                price: currencyFormatter.format(currentPrice),
                oldPrice:
                  product.discountPrice === null
                    ? undefined
                    : currencyFormatter.format(product.price),
                badge: discountPercentage
                  ? `${discountPercentage}% off`
                  : "Sale",
                reviews: product.reviewCount,
                image: product.imageUrl ?? undefined,
                rating: product.rating,
                specs: product.specifications,
                stock:
                  product.stock === 0
                    ? "Out of Stock"
                    : product.stock <= 5
                      ? "Low Stock"
                      : "In Stock",
              };
              return (
                <ProductCard
                  key={product.id}
                  product={card}
                  variant="listing"
                />
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border text-center">
            <PackageSearch className="size-10 text-muted-foreground" />
            <div>
              <p className="font-medium">No products found</p>
              <p className="text-sm text-muted-foreground">
                Try clearing the category, specification, price, or review
                filters.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function FilterGroup({
  title,
  children,
  collapsible = false,
}: {
  title: string;
  children: React.ReactNode;
  collapsible?: boolean;
}) {
  const [open, setOpen] = useState(!collapsible);

  return (
    <section
      className={`border-t border-border first:border-0 first:pt-0 ${collapsible ? "pt-2" : "pt-4"}`}
    >
      {collapsible ? (
        <Button
          aria-expanded={open}
          className="mb-0 h-auto w-full justify-between bg-transparent p-0 text-sm font-medium hover:bg-transparent aria-expanded:bg-transparent dark:hover:bg-transparent"
          onClick={() => setOpen((current) => !current)}
          type="button"
          variant="ghost"
        >
          {title}
          <ChevronDown
            className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </Button>
      ) : (
        <h3 className="mb-3 text-sm font-medium">{title}</h3>
      )}
      {open ? (
        <div className={collapsible ? "mt-3" : undefined}>{children}</div>
      ) : null}
    </section>
  );
}
