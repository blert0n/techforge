import OrderDetailsPage from "@/components/account/orders/order-details-page";

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  return (
    <OrderDetailsPage
      orderId={orderNumber}
      backHref="/admin/orders"
      canUpdateStatus
    />
  );
}
