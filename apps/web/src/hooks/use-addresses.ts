import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from "../services/addresses";
import type { AddressInput } from "@/components/account/addresses/types";

const addressesQueryKey = ["addresses"] as const;
export function useAddresses({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: addressesQueryKey,
    queryFn: getAddresses,
    enabled,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: AddressInput) => createAddress(values),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: addressesQueryKey }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: AddressInput }) =>
      updateAddress(id, values),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: addressesQueryKey }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: addressesQueryKey }),
  });
}
