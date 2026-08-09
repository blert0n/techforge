"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  useCatalogCategories,
  useUpdateSpecificationTemplate,
} from "@/hooks/use-catalog";
import type { SpecificationTemplateField } from "@/services/catalog";
import {
  ArrowDown,
  ArrowUp,
  Braces,
  GripVertical,
  LoaderCircle,
  Plus,
  Pencil,
  Save,
  Trash2,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

function toSpecificationKey(value: string) {
  const words =
    value
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .match(/[A-Za-z0-9]+/g) ?? [];

  return words
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`,
    )
    .join("");
}

function getFieldKey(field: SpecificationTemplateField) {
  return typeof field === "string" ? field : field.key;
}

function getFieldLabel(field: SpecificationTemplateField) {
  if (typeof field !== "string") return field.label;

  return field.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

function getFieldFormat(field: SpecificationTemplateField) {
  return typeof field === "string" ? "text" : field.format;
}

function applyFieldOrder(fields: SpecificationTemplateField[]) {
  return fields.map((field, index) =>
    typeof field === "string" ? field : { ...field, order: index + 1 },
  );
}

export default function SpecificationTemplatesPage() {
  const { data: categories, error, isLoading } = useCatalogCategories();
  const updateTemplate = useUpdateSpecificationTemplate();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>();
  const [loadedCategoryId, setLoadedCategoryId] = useState<number>();
  const [fields, setFields] = useState<SpecificationTemplateField[]>([]);
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldFormat, setNewFieldFormat] = useState<
    "text" | "number" | "boolean"
  >("text");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAddingField, setIsAddingField] = useState(false);
  const [isFieldKeyManual, setIsFieldKeyManual] = useState(false);
  const [fieldDraft, setFieldDraft] = useState({
    key: "",
    label: "",
    format: "text" as "text" | "number" | "boolean",
    unit: "",
  });

  const selectedCategory = categories?.find(
    (category) => category.id === selectedCategoryId,
  );
  const jsonPreview = useMemo(() => JSON.stringify(fields, null, 2), [fields]);

  useEffect(() => {
    if (!selectedCategoryId && categories?.[0]) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    if (!selectedCategory || selectedCategory.id === loadedCategoryId) return;

    setFields(selectedCategory.specificationTemplate?.fields ?? []);
    setLoadedCategoryId(selectedCategory.id);
  }, [loadedCategoryId, selectedCategory]);

  function addField(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const key = toSpecificationKey(newFieldKey || newFieldLabel);
    const label = newFieldLabel.trim();

    if (!key || !label) {
      toast.error("Enter a display label for the new field.", {
        position: "top-center",
      });
      return;
    }

    if (fields.some((currentField) => getFieldKey(currentField) === key)) {
      toast.error(`\"${key}\" already exists in this template.`, {
        position: "top-center",
      });
      return;
    }

    setFields((current) =>
      applyFieldOrder([
        ...current,
        { key, label, format: newFieldFormat, order: current.length + 1 },
      ]),
    );
    setNewFieldKey("");
    setNewFieldLabel("");
    setNewFieldFormat("text");
  }

  function removeField(fieldIndex: number) {
    setFields((current) =>
      applyFieldOrder(current.filter((_, index) => index !== fieldIndex)),
    );
  }

  function editField(fieldIndex: number) {
    const current = fields[fieldIndex];
    setFieldDraft({
      key: getFieldKey(current),
      label: getFieldLabel(current),
      format: getFieldFormat(current),
      unit: typeof current === "string" ? "" : (current.unit ?? ""),
    });
    setIsFieldKeyManual(true);
    setEditingIndex(fieldIndex);
  }

  function saveFieldEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = {
      key: toSpecificationKey(fieldDraft.key || fieldDraft.label),
      label: fieldDraft.label.trim(),
      format: fieldDraft.format,
      ...(fieldDraft.unit.trim() ? { unit: fieldDraft.unit.trim() } : {}),
    };
    setFields((items) =>
      editingIndex === null
        ? [...items, value]
        : items.map((item, index) => (index === editingIndex ? value : item)),
    );
    setEditingIndex(null);
    setIsAddingField(false);
    setIsFieldKeyManual(false);
  }

  function moveField(fieldIndex: number, direction: -1 | 1) {
    const destination = fieldIndex + direction;
    if (destination < 0 || destination >= fields.length) return;

    setFields((current) => {
      const updatedFields = [...current];
      [updatedFields[fieldIndex], updatedFields[destination]] = [
        updatedFields[destination],
        updatedFields[fieldIndex],
      ];

      return applyFieldOrder(updatedFields);
    });
  }

  async function saveTemplate() {
    if (!selectedCategory) return;

    const orderedFields = applyFieldOrder(fields);
    setFields(orderedFields);

    try {
      await updateTemplate.mutateAsync({
        categoryId: selectedCategory.id,
        fields: orderedFields,
      });
      toast.success("Specification template saved.", {
        position: "top-center",
      });
    } catch (saveError) {
      toast.error("Unable to save specification template", {
        position: "top-center",
        description:
          saveError instanceof Error ? saveError.message : "Please try again.",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-80 items-center justify-center text-muted-foreground">
        <LoaderCircle className="mr-2 size-5 animate-spin" />
        Loading specification templates...
      </div>
    );
  }

  if (error || !categories || categories.length === 0) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <h1 className="font-semibold text-destructive">
          Unable to load specification templates
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ensure you are signed in as an administrator and the catalog has been
          seeded.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Specification Templates
          </h1>
          <p className="text-sm text-muted-foreground">
            Define the technical fields collected for each product category.
          </p>
        </div>
        <Button
          disabled={!selectedCategory || updateTemplate.isPending}
          onClick={saveTemplate}
          size="lg"
        >
          {updateTemplate.isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Save />
          )}
          Save template
        </Button>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-5">
            <Label htmlFor="category">Product category</Label>
            <Select
              value={selectedCategoryId?.toString() ?? null}
              onValueChange={(value) => {
                setSelectedCategoryId(Number(value));
                setLoadedCategoryId(undefined);
              }}
            >
              <SelectTrigger id="category" className="mt-2 h-10 w-full bg-card">
                <SelectValue placeholder="Select a category">
                  {selectedCategory?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-foreground">
                  {selectedCategory?.name} fields
                </h2>
                <p className="text-sm text-muted-foreground">
                  These values are stored in the template&apos;s JSONB{" "}
                  <code>fields</code> array.
                </p>
              </div>
              <Badge variant="secondary">{fields.length} fields</Badge>
            </div>

            <Button
              type="button"
              className="mb-4"
              onClick={() => {
                setEditingIndex(null);
                setFieldDraft({ key: "", label: "", format: "text", unit: "" });
                setIsFieldKeyManual(false);
                setIsAddingField(true);
              }}
            >
              <Plus />
              Add field
            </Button>
            <div className="space-y-2">
              {fields.map((field, index) => {
                const key = getFieldKey(field);

                return (
                  <div
                    key={`${key}-${index}`}
                    className="flex items-center gap-2 rounded-xl border border-border bg-background p-3"
                  >
                    <GripVertical className="size-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground">
                        {getFieldLabel(field)}
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-muted-foreground">
                          {key}
                        </code>
                        <Badge
                          variant="outline"
                          className="h-5 px-1.5 text-[10px]"
                        >
                          {getFieldFormat(field)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        aria-label={`Edit ${key}`}
                        onClick={() => editField(index)}
                        size="icon-xs"
                        variant="ghost"
                      >
                        <Pencil />
                      </Button>
                      <Button
                        aria-label={`Move ${key} up`}
                        disabled={index === 0}
                        onClick={() => moveField(index, -1)}
                        size="icon-xs"
                        variant="ghost"
                      >
                        <ArrowUp />
                      </Button>
                      <Button
                        aria-label={`Move ${key} down`}
                        disabled={index === fields.length - 1}
                        onClick={() => moveField(index, 1)}
                        size="icon-xs"
                        variant="ghost"
                      >
                        <ArrowDown />
                      </Button>
                      <Button
                        aria-label={`Remove ${key}`}
                        onClick={() => removeField(index)}
                        size="icon-xs"
                        variant="destructive"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/*
            <form onSubmit={addField} className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="field-label">Display label</Label>
                <Input id="field-label" className="h-10" onChange={(event) => setNewFieldLabel(event.target.value)} placeholder="e.g. Boost clock" value={newFieldLabel} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="field-key">Field key</Label>
                <Input id="field-key" className="h-10" onChange={(event) => setNewFieldKey(event.target.value)} placeholder="e.g. boostClock" value={newFieldKey} />
              </div>
              <div className="space-y-1.5">
                <Label>Format</Label>
                <Select value={newFieldFormat} onValueChange={(value) => setNewFieldFormat(value as "text" | "number" | "boolean")}>
                  <SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button type="submit" className="h-10 w-full"><Plus />Add field</Button>
              </div>
            </form>*/}
            <p className="mt-2 text-xs text-muted-foreground">
              The key is converted to camelCase when needed, such as{" "}
              <code>boostClock</code>.
            </p>
          </div>
        </section>

        <aside className="h-fit rounded-2xl border border-border bg-card shadow-sm xl:sticky xl:top-24">
          <div className="flex items-center gap-2 border-b border-border p-5">
            <Braces className="size-5 text-primary" />
            <h2 className="font-semibold text-foreground">Stored value</h2>
          </div>
          <div className="p-5">
            <p className="mb-3 text-sm text-muted-foreground">
              This is the exact value saved in{" "}
              <code>specification_templates.fields</code>.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-muted p-4 text-xs leading-6 text-foreground">
              {jsonPreview}
            </pre>
          </div>
        </aside>
      </div>
      {(editingIndex !== null || isAddingField) && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/20 p-4">
          <form
            onSubmit={saveFieldEdit}
            className="w-full max-w-md space-y-3 rounded-2xl bg-card p-5 shadow-xl"
          >
            <h2 className="font-semibold">
              {editingIndex === null ? "Add field" : "Edit field"}
            </h2>
            <Input
              placeholder="Display label"
              value={fieldDraft.label}
              onChange={(event) => {
                const label = event.target.value;
                setFieldDraft({
                  ...fieldDraft,
                  label,
                  key: isFieldKeyManual
                    ? fieldDraft.key
                    : toSpecificationKey(label),
                });
              }}
            />
            <Input
              placeholder="Field key"
              value={fieldDraft.key}
              onBlur={() =>
                setFieldDraft((current) => ({
                  ...current,
                  key: toSpecificationKey(current.key || current.label),
                }))
              }
              onChange={(event) => {
                setIsFieldKeyManual(true);
                setFieldDraft({ ...fieldDraft, key: event.target.value });
              }}
            />
            <Select
              value={fieldDraft.format}
              onValueChange={(value) =>
                setFieldDraft({
                  ...fieldDraft,
                  format: value as "text" | "number" | "boolean",
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Unit (optional)"
              value={fieldDraft.unit}
              onChange={(e) =>
                setFieldDraft({ ...fieldDraft, unit: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditingIndex(null);
                  setIsAddingField(false);
                  setIsFieldKeyManual(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save field</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
