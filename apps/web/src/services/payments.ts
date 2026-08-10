import { apiClient } from "@/lib/api-client";
import type { paths } from "@/types/api";

type CreateCheckoutSessionInput = NonNullable<
  paths["/api/payments/checkout-session"]["post"]["requestBody"]
>["content"]["application/json"];

export async function createCheckoutSession(
  values: CreateCheckoutSessionInput,
) {
  const { data, error } = await apiClient.POST(
    "/api/payments/checkout-session",
    { body: values },
  );
  if (error || !data)
    throw new Error(
      typeof error === "object" && error && "message" in error
        ? String(error.message)
        : "Unable to start secure checkout",
    );
  return data;
}
