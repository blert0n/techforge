import { notFound } from "next/navigation";
import ProductDetailsPage from "@/components/products/product-details/product-details-page";

const productIds = ["rtx-4090"];
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; if (!productIds.includes(id)) notFound(); return <ProductDetailsPage />; }
