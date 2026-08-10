import OrderDetailsPage from "@/components/account/orders/order-details-page";

export default async function AccountOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetailsPage orderId={id} />;
}
