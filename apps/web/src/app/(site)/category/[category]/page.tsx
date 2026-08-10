import { notFound } from "next/navigation";

import ProductsPage from "@/components/products/products-grid";
import { getProducts } from "@/services/products";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ search?: string }>;
}) {
  const { category } = await params;
  const { search } = await searchParams;
  const data = await getProducts({ category, search });
  if (!data) notFound();

  return <ProductsPage data={data} />;
}
