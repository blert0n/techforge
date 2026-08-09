"use client";

import { useParams } from "next/navigation";
import { ProductFormPage } from "../../new/page";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId < 1) {
    return <p className="text-sm text-destructive">Invalid product ID.</p>;
  }

  return <ProductFormPage editId={productId} />;
}
