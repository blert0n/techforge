import { useMutation } from "@tanstack/react-query";
import { createCheckoutSession } from "@/services/payments";

export function useCreateCheckoutSession() {
  return useMutation({ mutationFn: createCheckoutSession });
}
