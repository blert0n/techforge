import ProductsPage from "@/components/products/products-grid";
import { headers } from "next/headers";
import { getProducts } from "@/services/products";

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const requestHeaders = await headers();
  const cookie = requestHeaders.get("cookie");
  const data = await getProducts({ search }, cookie ? { cookie } : undefined);
  return data ? <ProductsPage data={data} /> : null;
}
