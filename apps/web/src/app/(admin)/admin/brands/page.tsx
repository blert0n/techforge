"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCatalogBrands,
  useCreateCatalogBrand,
  useDeleteCatalogBrand,
  useUpdateCatalogBrand,
} from "@/hooks/use-catalog";
import type { CatalogBrand } from "@/services/catalog";
import {
  AlertCircle,
  Copyright,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

type BrandDialogProps = {
  description: string;
  isPending: boolean;
  name: string;
  onClose: () => void;
  onNameChange: (name: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitLabel: string;
  title: string;
};

function BrandDialog({
  description,
  isPending,
  name,
  onClose,
  onNameChange,
  onSubmit,
  submitLabel,
  title,
}: BrandDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-foreground/20 p-4"
      role="presentation"
    >
      <div
        aria-labelledby="brand-dialog-title"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl"
        role="dialog"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border p-5">
          <div>
            <h2
              className="font-semibold text-foreground"
              id="brand-dialog-title"
            >
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <Button
            aria-label="Close dialog"
            onClick={onClose}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <X />
          </Button>
        </div>

        <form className="space-y-5 p-5" onSubmit={onSubmit}>
          <div>
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="brand-name"
            >
              Brand name
            </label>
            <Input
              autoFocus
              className="mt-1.5"
              id="brand-name"
              maxLength={120}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder="e.g. NVIDIA"
              required
              value={name}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              The URL slug is generated automatically from the name.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={onClose} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={isPending || !name.trim()} type="submit">
              {isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : title.startsWith("Add") ? (
                <Plus />
              ) : (
                <Pencil />
              )}
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getMutationError(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function AdminBrandsPage() {
  const { data: brands, error, isLoading } = useCatalogBrands();
  const createBrand = useCreateCatalogBrand();
  const updateBrand = useUpdateCatalogBrand();
  const deleteBrand = useDeleteCatalogBrand();
  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [editingBrand, setEditingBrand] = useState<CatalogBrand | null>(null);
  const [editName, setEditName] = useState("");
  const [deletingBrand, setDeletingBrand] = useState<CatalogBrand | null>(null);

  const filteredBrands = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return brands ?? [];

    return (brands ?? []).filter((brand) =>
      [brand.name, brand.slug].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [brands, search]);

  function openCreateDialog() {
    setNewBrandName("");
    setIsCreating(true);
  }

  function openEditDialog(brand: CatalogBrand) {
    setEditingBrand(brand);
    setEditName(brand.name);
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const created = await createBrand.mutateAsync(newBrandName.trim());
      toast.success("Brand created", {
        position: "top-center",
        description: `${created.name} is now available when creating products.`,
      });
      setIsCreating(false);
      setNewBrandName("");
    } catch (mutationError) {
      toast.error("Unable to create brand", {
        position: "top-center",
        description: getMutationError(mutationError, "Please try again."),
      });
    }
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingBrand) return;

    try {
      const updated = await updateBrand.mutateAsync({
        id: editingBrand.id,
        name: editName.trim(),
      });
      toast.success("Brand updated", {
        position: "top-center",
        description: `${updated.name} has been saved.`,
      });
      setEditingBrand(null);
    } catch (mutationError) {
      toast.error("Unable to update brand", {
        position: "top-center",
        description: getMutationError(mutationError, "Please try again."),
      });
    }
  }

  async function handleDelete() {
    if (!deletingBrand) return;

    try {
      await deleteBrand.mutateAsync(deletingBrand.id);
      toast.success("Brand deleted", {
        position: "top-center",
        description: `${deletingBrand.name} was removed.`,
      });
      setDeletingBrand(null);
    } catch (mutationError) {
      toast.error("Unable to delete brand", {
        position: "top-center",
        description: getMutationError(
          mutationError,
          "Remove the brand from its products first.",
        ),
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center text-muted-foreground">
        <LoaderCircle className="mr-2 size-5 animate-spin" />
        Loading brands...
      </div>
    );
  }

  if (error || !brands) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-center gap-2 font-semibold text-destructive">
          <AlertCircle className="size-5" />
          Unable to load brands
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in as an administrator and make sure the API is running.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Brands</h1>
          <p className="text-sm text-muted-foreground">
            Maintain the manufacturers available throughout the product catalog.
          </p>
        </div>
        <Button onClick={openCreateDialog} size="lg">
          <Plus />
          Add brand
        </Button>
      </header>

      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Copyright className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold text-foreground">Catalog brands</h2>
              <p className="text-sm text-muted-foreground">
                {brands.length} {brands.length === 1 ? "brand" : "brands"} in
                the catalog
              </p>
            </div>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto size-4 text-muted-foreground" />
            <Input
              className="pl-9"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search brands"
              value={search}
            />
          </div>
        </div>

        {filteredBrands.length ? (
          <div className="divide-y divide-border">
            {filteredBrands.map((brand) => (
              <article
                className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center"
                key={brand.id}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Tags className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-foreground">
                      {brand.name}
                    </h3>
                    <Badge variant="outline">ID {brand.id}</Badge>
                  </div>
                  <code className="mt-1 block text-xs text-muted-foreground">
                    /{brand.slug}
                  </code>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button
                    aria-label={`Edit ${brand.name}`}
                    onClick={() => openEditDialog(brand)}
                    size="icon-sm"
                    variant="outline"
                  >
                    <Pencil />
                  </Button>
                  <Button
                    aria-label={`Delete ${brand.name}`}
                    onClick={() => setDeletingBrand(brand)}
                    size="icon-sm"
                    variant="destructive"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            <Tags className="size-8 text-muted-foreground" />
            <p className="font-medium text-foreground">No matching brands</p>
            <p className="text-sm text-muted-foreground">
              Try another search term or add a new brand.
            </p>
          </div>
        )}
      </section>

      {isCreating ? (
        <BrandDialog
          description="Add a manufacturer to the catalog."
          isPending={createBrand.isPending}
          name={newBrandName}
          onClose={() => setIsCreating(false)}
          onNameChange={setNewBrandName}
          onSubmit={handleCreate}
          submitLabel="Create brand"
          title="Add brand"
        />
      ) : null}

      {editingBrand ? (
        <BrandDialog
          description="Changing the name also updates its generated URL slug."
          isPending={updateBrand.isPending}
          name={editName}
          onClose={() => setEditingBrand(null)}
          onNameChange={setEditName}
          onSubmit={handleUpdate}
          submitLabel="Save changes"
          title="Edit brand"
        />
      ) : null}

      {deletingBrand ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/20 p-4"
          role="presentation"
        >
          <div
            aria-labelledby="delete-brand-title"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-xl"
            role="dialog"
          >
            <h2
              className="font-semibold text-destructive"
              id="delete-brand-title"
            >
              Delete {deletingBrand.name}?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This cannot be undone. A brand assigned to any product must be
              removed from those products first.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                onClick={() => setDeletingBrand(null)}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                disabled={deleteBrand.isPending}
                onClick={() => void handleDelete()}
                type="button"
                variant="destructive"
              >
                {deleteBrand.isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Trash2 />
                )}
                Delete brand
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
