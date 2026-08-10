import { notFound } from "next/navigation";
import { headers } from "next/headers";

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
  const requestHeaders = await headers();
  const cookie = requestHeaders.get("cookie");
  const data = await getProducts(
    { category, search },
    cookie ? { cookie } : undefined,
  );
  if (!data) notFound();

  return <ProductsPage data={data} />;
}
