"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatalogCategories } from "@/hooks/use-catalog";
import { useAdminProducts, useDeleteProduct } from "@/hooks/use-products";
import type { AdminProduct } from "@/services/products";
import {
  AlertCircle,
  Archive,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  LoaderCircle,
  Package,
  PackageCheck,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 12;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function useDebouncedValue<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
}

function ProductStatus({ status }: { status: string }) {
  if (status === "active") {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
        Active
      </Badge>
    );
  }

  return <Badge variant="secondary">Draft</Badge>;
}

function Inventory({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="text-sm font-medium text-destructive">Out of stock</span>
    );
  }

  if (stock <= 5) {
    return (
      <div>
        <p className="text-sm font-medium text-amber-600">Low stock</p>
        <p className="text-xs text-muted-foreground">{stock} available</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-medium text-foreground">{stock} in stock</p>
      <p className="text-xs text-muted-foreground">Available</p>
    </div>
  );
}

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deletingProduct, setDeletingProduct] = useState<AdminProduct | null>(
    null,
  );
  const debouncedSearch = useDebouncedValue(search.trim(), 300);
  const { data, error, isFetching, isLoading } = useAdminProducts({
    page,
    pageSize: PAGE_SIZE,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(statusFilter !== "all"
      ? { status: statusFilter as "active" | "draft" }
      : {}),
    ...(categoryFilter !== "all" ? { categoryId: Number(categoryFilter) } : {}),
  });
  const { data: categories = [] } = useCatalogCategories();
  const deleteProduct = useDeleteProduct();
  const visibleProducts = data?.items ?? [];
  const currentPage = data?.pagination.page ?? page;
  const pageCount = data?.pagination.totalPages ?? 1;

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateStatus(value: string | null) {
    setStatusFilter(value ?? "all");
    setPage(1);
  }

  function updateCategory(value: string | null) {
    setCategoryFilter(value ?? "all");
    setPage(1);
  }

  async function removeProduct() {
    if (!deletingProduct) return;

    try {
      await deleteProduct.mutateAsync(deletingProduct.id);
      toast.success("Product deleted", {
        position: "top-center",
        description: `${deletingProduct.name} was removed from the catalog.`,
      });
      if (visibleProducts.length === 1 && page > 1) setPage(page - 1);
      setDeletingProduct(null);
    } catch (mutationError) {
      toast.error("Unable to delete product", {
        position: "top-center",
        description:
          mutationError instanceof Error
            ? mutationError.message
            : "Please try again.",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center text-muted-foreground">
        <LoaderCircle className="mr-2 size-5 animate-spin" />
        Loading products...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-center gap-2 font-semibold text-destructive">
          <AlertCircle className="size-5" />
          Unable to load products
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in as an administrator and make sure the API is running.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">
            Review catalog visibility, pricing, and available inventory.
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/admin/products/new" />}
          size="lg"
        >
          <Plus />
          Create product
        </Button>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            icon: Package,
            label: "Total products",
            value: data.summary.total,
          },
          { icon: PackageCheck, label: "Active", value: data.summary.active },
          { icon: Archive, label: "Drafts", value: data.summary.drafts },
          {
            icon: AlertCircle,
            label: "Low or no stock",
            value: data.summary.lowStock,
          },
        ].map(({ icon: Icon, label, value }) => (
          <article
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
            key={label}
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold text-foreground">{value}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-5 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto size-4 text-muted-foreground" />
            <Input
              className="pl-9"
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search by product, SKU, brand, or category"
              value={search}
            />
          </div>
          <Select onValueChange={updateStatus} value={statusFilter}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue>
                {statusFilter === "all"
                  ? "All statuses"
                  : statusFilter === "active"
                    ? "Active"
                    : "Draft"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={updateCategory} value={categoryFilter}>
            <SelectTrigger className="w-full lg:w-48">
              <SelectValue>
                {categoryFilter === "all"
                  ? "All categories"
                  : (categories.find(
                      (category) => category.id.toString() === categoryFilter,
                    )?.name ?? "All categories")}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isFetching ? (
            <LoaderCircle
              aria-label="Refreshing products"
              className="size-4 shrink-0 animate-spin text-muted-foreground"
            />
          ) : null}
        </div>

        {visibleProducts.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-240 text-left">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Inventory</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold">Updated</th>
                  <th className="px-5 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleProducts.map((product) => (
                  <tr
                    className="transition-colors hover:bg-muted/30"
                    key={product.id}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
                          {product.imageUrl ? (
                            // Product image hosts are user-managed and are not limited to Next Image domains.
                            <img
                              alt={product.imageAltText ?? product.name}
                              className="size-full object-contain p-1"
                              src={product.imageUrl}
                            />
                          ) : (
                            <ImageIcon className="size-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="max-w-72 truncate font-medium text-foreground">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.brand.name} · {product.sku}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">
                      {product.category.name}
                    </td>
                    <td className="px-4 py-4">
                      <ProductStatus status={product.status} />
                    </td>
                    <td className="px-4 py-4">
                      <Inventory stock={product.stock} />
                    </td>
                    <td className="px-4 py-4">
                      {product.discountPrice !== null ? (
                        <div>
                          <p className="font-semibold text-foreground">
                            {formatCurrency(product.discountPrice)}
                          </p>
                          <p className="text-xs text-muted-foreground line-through">
                            {formatCurrency(product.price)}
                          </p>
                        </div>
                      ) : (
                        <span className="font-semibold text-foreground">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">
                      {formatDate(product.updatedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <Button
                          aria-label={`Edit ${product.name}`}
                          nativeButton={false}
                          render={<Link href={`/admin/products/edit/${product.id}`} />}
                          size="icon-sm"
                          type="button"
                          variant="ghost"
                        >
                          <Pencil />
                        </Button>
                        <Button
                          aria-label={`Delete ${product.name}`}
                          onClick={() => setDeletingProduct(product)}
                          size="icon-sm"
                          type="button"
                          variant="ghost"
                        >
                          <Trash2 className="text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 px-5 py-16 text-center">
            <Package className="size-9 text-muted-foreground" />
            <p className="font-medium text-foreground">No products found</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              {data.summary.total
                ? "Try changing the search or filters."
                : "Create your first product to start building the catalog."}
            </p>
            {!data.summary.total ? (
              <Button
                className="mt-2"
                nativeButton={false}
                render={<Link href="/admin/products/new" />}
              >
                <Plus />
                Create product
              </Button>
            ) : null}
          </div>
        )}

        {data.pagination.total ? (
          <footer className="flex flex-col gap-3 border-t border-border px-5 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, data.pagination.total)} of{" "}
              {data.pagination.total} products
            </p>
            <div className="flex items-center gap-2">
              <Button
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                size="icon-sm"
                type="button"
                variant="outline"
              >
                <ChevronLeft />
              </Button>
              <span className="min-w-20 text-center text-foreground">
                Page {currentPage} of {pageCount}
              </span>
              <Button
                aria-label="Next page"
                disabled={currentPage === pageCount}
                onClick={() => setPage(currentPage + 1)}
                size="icon-sm"
                type="button"
                variant="outline"
              >
                <ChevronRight />
              </Button>
            </div>
          </footer>
        ) : null}
      </section>

      {deletingProduct ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/20 p-4"
          role="presentation"
        >
          <div
            aria-labelledby="delete-product-title"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-xl"
            role="dialog"
          >
            <span className="mb-4 flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <Trash2 className="size-5" />
            </span>
            <h2
              className="font-semibold text-foreground"
              id="delete-product-title"
            >
              Delete {deletingProduct.name}?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This permanently removes the product and its images,
              specifications, and filter attributes.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                onClick={() => setDeletingProduct(null)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                disabled={deleteProduct.isPending}
                onClick={() => void removeProduct()}
                type="button"
                variant="destructive"
              >
                {deleteProduct.isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Trash2 />
                )}
                Delete product
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
