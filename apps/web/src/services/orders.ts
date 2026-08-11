import { apiClient } from "@/lib/api-client";
import type { paths } from "@/types/api";

export type MyOrders =
  paths["/api/orders"]["get"]["responses"][200]["content"]["application/json"];

export type MyOrdersFilters = NonNullable<
  paths["/api/orders"]["get"]["parameters"]["query"]
>;

export type OrderDetails =
  paths["/api/orders/{orderNumber}"]["get"]["responses"][200]["content"]["application/json"];
export type AdminOrdersFilters = NonNullable<
  paths["/api/orders/admin"]["get"]["parameters"]["query"]
>;

function getErrorMessage(error: unknown, fallback: string) {
  return typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
    ? error.message
    : fallback;
}

export async function getMyOrders(filters: MyOrdersFilters = {}) {
  const { data, error } = await apiClient.GET("/api/orders", {
    params: { query: filters },
  });
  if (error || !data)
    throw new Error(getErrorMessage(error, "Unable to load orders"));
  return data;
}

export async function getMyOrder(orderNumber: string) {
  const { data, error } = await apiClient.GET("/api/orders/{orderNumber}", {
    params: { path: { orderNumber } },
  });
  if (error || !data)
    throw new Error(getErrorMessage(error, "Unable to load order"));
  return data;
}

export async function getAdminOrders(filters: AdminOrdersFilters) {
  const { data, error } = await apiClient.GET("/api/orders/admin", {
    params: { query: filters },
  });
  if (error || !data)
    throw new Error(getErrorMessage(error, "Unable to load orders"));
  return data;
}

export async function updateOrderStatus(
  orderNumber: string,
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled",
) {
  const { error } = await apiClient.PATCH(
    "/api/orders/admin/{orderNumber}/status",
    { params: { path: { orderNumber } }, body: { status } },
  );
  if (error)
    throw new Error(getErrorMessage(error, "Unable to update order status"));
}
