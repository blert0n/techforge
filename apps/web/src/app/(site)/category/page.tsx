import ProductsPage from "@/components/products/products-grid";
import { getProducts } from "@/services/products";

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const data = await getProducts({ search });
  return data ? <ProductsPage data={data} /> : null;
}
