"use client";
import { Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProductDetailTabs({
  specifications,
  description,
}: {
  specifications: { key: string; label: string; value: string }[];
  description: string;
}) {
  return (
    <section className="border-t border-border pt-6">
      <div className="rounded-2xl border border-border bg-card p-6">
      <Tabs defaultValue="description">
        <TabsList variant="line" className="mb-6">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Technical specs</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="description">
          <div className="whitespace-pre-line text-sm text-muted-foreground">
            {description}
          </div>
        </TabsContent>
        <TabsContent value="specifications">
          <div className="grid gap-x-8 md:grid-cols-2">
            {specifications.map((specification) => (
              <div
                key={specification.key}
                className="grid grid-cols-2 border-b border-border py-3 text-sm"
              >
                <span className="text-muted-foreground">
                  {specification.label}
                </span>
                <span>{specification.value}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="reviews">
          <div className="flex min-h-48 flex-col items-center justify-center text-center">
            <Star className="mb-3 size-8 text-muted-foreground" />
            <p className="font-medium">No reviews yet</p>
            <p className="text-sm text-muted-foreground">
              Be the first to review this product.
            </p>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </section>
  );
}
