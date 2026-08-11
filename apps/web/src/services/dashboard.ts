import { apiClient } from "@/lib/api-client";
import type { paths } from "@/types/api";

export type AdminDashboardResponse =
  paths["/api/dashboard/admin"]["get"]["responses"][200]["content"]["application/json"];

export async function getAdminDashboard() {
  const { data, error } = await apiClient.GET("/api/dashboard/admin");

  if (error || !data) {
    throw new Error("Unable to load dashboard");
  }

  return data;
}
