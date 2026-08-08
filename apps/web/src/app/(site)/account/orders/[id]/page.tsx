import { notFound } from "next/navigation";
import OrderDetailsPage from "@/components/account/orders/order-details-page";
import { orderDetails } from "@/components/account/orders/order-details.data";

export default async function AccountOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = orderDetails.find((item) => item.id === id);
  if (!order) notFound();
  return <OrderDetailsPage order={order} />;
}
