import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductGallery } from "./product-gallery";
import { ProductOverviewDynamic } from "./product-overview-dynamic";
import { ProductDetailTabs } from "./product-detail-tabs";

import type { StorefrontProductDetail } from "@/services/products";

export default function ProductDetailsPage({
  product,
}: {
  product: StorefrontProductDetail;
}) {
  const specificationFields =
    product.category.specificationTemplate?.fields ?? [];
  const specifications = Object.entries(product.specificationValues)
    .map(([key, value]) => {
      const field = specificationFields.find(
        (item): item is Exclude<typeof item, string> =>
          typeof item !== "string" && item.key === key,
      );
      return {
        key,
        label: field?.label ?? key.replace(/([a-z0-9])([A-Z])/g, "$1 $2"),
        value: `${String(value)}${field?.unit ? ` ${field.unit}` : ""}`,
        order: field?.order ?? Number.MAX_SAFE_INTEGER,
      };
    })
    .sort((left, right) => left.order - right.order);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-3" />
        <Link
          href={`/category/${product.category.slug}`}
          className="hover:text-foreground"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="size-3" />
        <span className="font-medium text-foreground">{product.name}</span>
      </nav>

      <section className="flex flex-col gap-10 lg:flex-row">
        <ProductGallery images={product.images} name={product.name} />
        <ProductOverviewDynamic product={product} />
      </section>

      <ProductDetailTabs
        specifications={specifications}
        description={product.description}
      />
    </main>
  );
}
