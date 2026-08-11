import { useQuery } from "@tanstack/react-query";

import { getAdminDashboard } from "@/services/dashboard";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: getAdminDashboard,
  });
}
