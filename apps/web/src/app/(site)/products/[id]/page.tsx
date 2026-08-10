import { notFound } from "next/navigation";
import ProductDetailsPage from "@/components/products/product-details/product-details-page";
import { getStorefrontProduct } from "@/services/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getStorefrontProduct(id);
  if (!product) notFound();

  return <ProductDetailsPage product={product} />;
}
