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
import { Braces, GripVertical, Plus, Save, Trash2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

const initialTemplates = {
  "graphics-cards": {
    label: "Graphics Cards",
    fields: [
      "graphicsEngine",
      "videoMemory",
      "cudaCores",
      "engineClock",
      "recommendedPSU",
      "powerConnectors",
    ],
  },
  processors: {
    label: "Processors",
    fields: ["socket", "cores", "threads", "baseClock", "cache", "tdp"],
  },
  "memory-modules": {
    label: "Memory Modules",
    fields: ["memoryType", "capacity", "speed", "latency", "voltage"],
  },
  "internal-solid-state-drives": {
    label: "Internal SSDs",
    fields: ["capacity", "formFactor", "interface", "readSpeed", "writeSpeed"],
  },
  "computer-monitors": {
    label: "Computer Monitors",
    fields: ["screenSize", "resolution", "refreshRate", "panelType", "responseTime"],
  },
} as const;

type TemplateKey = keyof typeof initialTemplates;
type Templates = Record<TemplateKey, string[]>;

function toSpecificationKey(value: string) {
  const words = value.trim().match(/[A-Za-z0-9]+/g) ?? [];

  return words
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`,
    )
    .join("");
}

function toLabel(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

export default function SpecificationTemplatesPage() {
  const [templates, setTemplates] = useState<Templates>(() =>
    Object.fromEntries(
      Object.entries(initialTemplates).map(([key, template]) => [
        key,
        [...template.fields],
      ]),
    ) as Templates,
  );
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateKey>("graphics-cards");
  const [newField, setNewField] = useState("");

  const fields = templates[selectedTemplate];
  const category = initialTemplates[selectedTemplate];
  const jsonPreview = useMemo(() => JSON.stringify(fields, null, 2), [fields]);

  function addField(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const field = toSpecificationKey(newField);
    if (!field) {
      toast.error("Enter a field name first.");
      return;
    }

    if (fields.includes(field)) {
      toast.error(`“${field}” already exists in this template.`);
      return;
    }

    setTemplates((current) => ({
      ...current,
      [selectedTemplate]: [...current[selectedTemplate], field],
    }));
    setNewField("");
  }

  function removeField(field: string) {
    setTemplates((current) => ({
      ...current,
      [selectedTemplate]: current[selectedTemplate].filter(
        (currentField) => currentField !== field,
      ),
    }));
  }

  function moveField(fieldIndex: number, direction: -1 | 1) {
    const destination = fieldIndex + direction;
    if (destination < 0 || destination >= fields.length) return;

    setTemplates((current) => {
      const updatedFields = [...current[selectedTemplate]];
      [updatedFields[fieldIndex], updatedFields[destination]] = [
        updatedFields[destination],
        updatedFields[fieldIndex],
      ];

      return { ...current, [selectedTemplate]: updatedFields };
    });
  }

  function saveTemplate() {
    toast.info("Template API not connected yet", {
      description:
        "Your edits are ready in the UI. Add the specification-template API before persisting them.",
    });
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
        <Button onClick={saveTemplate} size="lg">
          <Save />
          Save template
        </Button>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-5">
            <Label htmlFor="category">Product category</Label>
            <Select
              value={selectedTemplate}
              onValueChange={(value) => setSelectedTemplate(value as TemplateKey)}
            >
              <SelectTrigger id="category" className="mt-2 h-10 w-full bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(initialTemplates).map(([key, template]) => (
                  <SelectItem key={key} value={key}>
                    {template.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-foreground">
                  {category.label} fields
                </h2>
                <p className="text-sm text-muted-foreground">
                  These keys are stored in the template&apos;s JSONB <code>fields</code> array.
                </p>
              </div>
              <Badge variant="secondary">{fields.length} fields</Badge>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div
                  key={field}
                  className="flex items-center gap-2 rounded-xl border border-border bg-background p-3"
                >
                  <GripVertical className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{toLabel(field)}</p>
                    <code className="text-xs text-muted-foreground">{field}</code>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      aria-label={`Move ${field} up`}
                      disabled={index === 0}
                      onClick={() => moveField(index, -1)}
                      size="icon-xs"
                      variant="ghost"
                    >
                      ↑
                    </Button>
                    <Button
                      aria-label={`Move ${field} down`}
                      disabled={index === fields.length - 1}
                      onClick={() => moveField(index, 1)}
                      size="icon-xs"
                      variant="ghost"
                    >
                      ↓
                    </Button>
                    <Button
                      aria-label={`Remove ${field}`}
                      onClick={() => removeField(field)}
                      size="icon-xs"
                      variant="destructive"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={addField} className="mt-4 flex gap-2 border-t border-border pt-4">
              <Input
                aria-label="New specification field"
                className="h-10"
                onChange={(event) => setNewField(event.target.value)}
                placeholder="e.g. Boost Clock"
                value={newField}
              />
              <Button type="submit" className="h-10 shrink-0">
                <Plus />
                Add field
              </Button>
            </form>
            <p className="mt-2 text-xs text-muted-foreground">
              Field names are automatically converted to camelCase, such as <code>boostClock</code>.
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
              This is the exact value saved in <code>specification_templates.fields</code>.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-muted p-4 text-xs leading-6 text-foreground">
              {jsonPreview}
            </pre>
          </div>
        </aside>
      </div>
    </div>
  );
}
