import { notFound } from "next/navigation";
import { headers } from "next/headers";
import ProductDetailsPage from "@/components/products/product-details/product-details-page";
import { getStorefrontProduct } from "@/services/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const requestHeaders = await headers();
  const cookie = requestHeaders.get("cookie");
  const product = await getStorefrontProduct(
    id,
    cookie ? { cookie } : undefined,
  );
  if (!product) notFound();

  return <ProductDetailsPage product={product} />;
}
