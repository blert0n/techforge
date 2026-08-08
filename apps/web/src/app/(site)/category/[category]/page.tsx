import { notFound } from "next/navigation";

import ProductsPage from "@/components/products/single-products-page";

const validCategories = [
  "all-categories",
  "components",
  "desktops",
  "laptops",
  "accessories",
];

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!validCategories.includes(category)) {
    notFound();
  }

  return <ProductsPage />;
}
