"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useCatalogCategories,
  useCreateCatalogCategory,
  useDeleteCatalogCategory,
  useUpdateCatalogCategory,
} from "@/hooks/use-catalog";
import type { CatalogCategory } from "@/services/catalog";
import {
  AlertCircle,
  Boxes,
  ChevronRight,
  ClipboardList,
  FolderTree,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { type FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const { data: categories, error, isLoading } = useCatalogCategories();
  const updateCategory = useUpdateCatalogCategory();
  const deleteCategory = useDeleteCatalogCategory();
  const createCategory = useCreateCatalogCategory();
  const [search, setSearch] = useState("");
  const [editingCategory, setEditingCategory] =
    useState<CatalogCategory | null>(null);
  const [deletingCategory, setDeletingCategory] =
    useState<CatalogCategory | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    attributePrefix: "",
    description: "",
  });
  const [draft, setDraft] = useState({
    name: "",
    slug: "",
    attributePrefix: "",
    description: "",
  });

  const filteredCategories = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return categories ?? [];

    return (categories ?? []).filter((category) =>
      [category.name, category.slug, category.description]
        .filter(Boolean)
        .some((value) =>
          (value ?? "").toLowerCase().includes(normalizedSearch),
        ),
    );
  }, [categories, search]);

  function openEditDialog(category: CatalogCategory) {
    setEditingCategory(category);
    setDraft({
      name: category.name,
      slug: category.slug,
      attributePrefix: category.attributePrefix,
      description: category.description ?? "",
    });
  }

  function openDeleteDialog(category: CatalogCategory) {
    setDeletingCategory(category);
  }

  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingCategory) return;
    try {
      await updateCategory.mutateAsync({
        id: editingCategory.id,
        values: { ...draft, description: draft.description || null },
      });
      toast.success("Category updated", {
        position: "top-center",
        description: `${draft.name} has been saved.`,
      });
      setEditingCategory(null);
    } catch {}
  }

  async function removeCategory() {
    if (!deletingCategory) return;
    try {
      await deleteCategory.mutateAsync(deletingCategory.id);
      toast.success("Category deleted", {
        position: "top-center",
        description: `${deletingCategory.name} was removed.`,
      });
      setDeletingCategory(null);
    } catch (deleteError) {
      toast.error("Unable to delete category", {
        position: "top-center",
        description:
          deleteError instanceof Error
            ? deleteError.message
            : "Remove its products first.",
      });
    }
  }

  async function addCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const created = await createCategory.mutateAsync({
        ...newCategory,
        description: newCategory.description || null,
      });
      toast.success("Category created", {
        position: "top-center",
        description: `${created.name} is ready for a specification template.`,
      });
      setIsCreatingCategory(false);
      setNewCategory({
        name: "",
        slug: "",
        attributePrefix: "",
        description: "",
      });
    } catch {
      toast.error("Unable to create category", {
        position: "top-center",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center text-muted-foreground">
        <LoaderCircle className="mr-2 size-5 animate-spin" />
        Loading categories...
      </div>
    );
  }

  if (error || !categories) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <div className="flex items-center gap-2 font-semibold text-destructive">
          <AlertCircle className="size-5" />
          Unable to load categories
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
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Organize the catalog and maintain the technical templates for each
            category.
          </p>
        </div>
        <Button onClick={() => setIsCreatingCategory(true)} size="lg">
          <Plus />
          Add category
        </Button>
      </header>

      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <FolderTree className="size-5 text-primary" />
            <div>
              <h2 className="font-semibold text-foreground">
                Catalog categories
              </h2>
              <p className="text-sm text-muted-foreground">
                {categories.length} categories in the catalog
              </p>
            </div>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto size-4 text-muted-foreground" />
            <Input
              className="pl-9"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories"
              value={search}
            />
          </div>
        </div>

        {filteredCategories.length ? (
          <div className="divide-y divide-border">
            {filteredCategories.map((category) => {
              const fieldCount =
                category.specificationTemplate?.fields.length ?? 0;

              return (
                <article
                  key={category.id}
                  className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/30 md:flex-row md:items-center"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Boxes className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {category.name}
                      </h3>
                      <Badge variant="outline">
                        {category.attributePrefix}
                      </Badge>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                      {category.description ?? "No description yet."}
                    </p>
                    <code className="mt-2 block text-xs text-muted-foreground">
                      /{category.slug}
                    </code>
                  </div>
                  <div className="flex items-center justify-between gap-4 md:justify-end">
                    <div className="text-left md:text-right">
                      <p className="text-sm font-medium text-foreground">
                        {fieldCount
                          ? `${fieldCount} template fields`
                          : "No template"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {category.specificationTemplate
                          ? "Ready for product entry"
                          : "Set up specifications first"}
                      </p>
                    </div>
                    <Button
                      nativeButton={false}
                      render={<Link href="/admin/specification-templates" />}
                      size="sm"
                      variant="outline"
                    >
                      <Settings2 />
                      Template
                      <ChevronRight />
                    </Button>
                    <Button
                      disabled={updateCategory.isPending}
                      onClick={() => openEditDialog(category)}
                      size="icon-sm"
                      variant="ghost"
                    >
                      <Pencil />
                    </Button>
                    <Button
                      aria-label={`Delete ${category.name}`}
                      disabled={deleteCategory.isPending}
                      onClick={() => openDeleteDialog(category)}
                      size="icon-sm"
                      variant="destructive"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            <ClipboardList className="size-8 text-muted-foreground" />
            <p className="font-medium text-foreground">
              No matching categories
            </p>
            <p className="text-sm text-muted-foreground">
              Try a different search term.
            </p>
          </div>
        )}
      </section>

      {editingCategory ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/20 p-4"
          role="presentation"
        >
          <div
            aria-labelledby="edit-category-title"
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-xl"
            role="dialog"
          >
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2
                  id="edit-category-title"
                  className="font-semibold text-foreground"
                >
                  Edit category
                </h2>
                <p className="text-sm text-muted-foreground">
                  Update catalog metadata and its filter namespace.
                </p>
              </div>
              <Button
                aria-label="Close dialog"
                onClick={() => setEditingCategory(null)}
                size="icon-sm"
                variant="ghost"
              >
                <X />
              </Button>
            </div>
            <form className="space-y-4 p-5" onSubmit={saveCategory}>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Name
                </label>
                <Input
                  className="mt-1.5"
                  value={draft.name}
                  onChange={(event) =>
                    setDraft({ ...draft, name: event.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Slug
                  </label>
                  <Input
                    className="mt-1.5"
                    value={draft.slug}
                    onChange={(event) =>
                      setDraft({ ...draft, slug: event.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Attribute prefix
                  </label>
                  <Input
                    className="mt-1.5"
                    value={draft.attributePrefix}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        attributePrefix: event.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">
                  Description
                </label>
                <Textarea
                  className="mt-1.5"
                  value={draft.description}
                  onChange={(event) =>
                    setDraft({ ...draft, description: event.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingCategory(null)}
                >
                  Cancel
                </Button>
                <Button disabled={updateCategory.isPending} type="submit">
                  {updateCategory.isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Pencil />
                  )}
                  Save changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
      {deletingCategory ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-foreground/20 p-4"
          role="presentation"
        >
          <div
            aria-labelledby="delete-category-title"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-xl"
            role="dialog"
          >
            <h2
              id="delete-category-title"
              className="font-semibold text-destructive"
            >
              Delete {deletingCategory.name}?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              This cannot be undone. Categories with products cannot be deleted.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeletingCategory(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={deleteCategory.isPending}
                onClick={() => void removeCategory()}
              >
                {deleteCategory.isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Trash2 />
                )}
                Delete category
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      {isCreatingCategory ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/20 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div>
                <h2 className="font-semibold">Add category</h2>
                <p className="text-sm text-muted-foreground">
                  Set the catalog metadata and filter namespace.
                </p>
              </div>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => setIsCreatingCategory(false)}
              >
                <X />
              </Button>
            </div>
            <form className="space-y-4 p-5" onSubmit={addCategory}>
              <Input
                placeholder="Name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  placeholder="Slug"
                  value={newCategory.slug}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, slug: e.target.value })
                  }
                />
                <Input
                  placeholder="Attribute prefix"
                  value={newCategory.attributePrefix}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      attributePrefix: e.target.value,
                    })
                  }
                />
              </div>
              <Textarea
                placeholder="Description"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreatingCategory(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createCategory.isPending}>
                  {createCategory.isPending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Plus />
                  )}
                  Create category
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
