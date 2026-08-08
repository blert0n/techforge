import { apiClient } from "../lib/api-client";
import type { AddressInput } from "@/components/account/addresses/types";

export async function getAddresses() {
  const { data, error } = await apiClient.GET("/api/addresses");

  if (error || !data) {
    throw new Error("Failed to load saved addresses");
  }

  return data;
}

export async function createAddress(values: AddressInput) {
  const { data, error } = await apiClient.POST("/api/addresses", {
    body: values,
  });

  if (error || !data) {
    throw new Error("Failed to create address");
  }

  return data;
}

export async function updateAddress(id: string, values: AddressInput) {
  const { data, error } = await apiClient.PATCH("/api/addresses/{id}", {
    params: { path: { id } },
    body: values,
  });

  if (error || !data) {
    throw new Error("Failed to update address");
  }

  return data;
}

export async function deleteAddress(id: string) {
  const { error } = await apiClient.DELETE("/api/addresses/{id}", {
    params: { path: { id } },
  });

  if (error) {
    throw new Error("Failed to delete address");
  }
}
