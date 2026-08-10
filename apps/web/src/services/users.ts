import { apiClient } from "@/lib/api-client";

export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.set("file", file);
  const { data, error } = await apiClient.POST("/api/users/avatar", {
    body: { file },
    bodySerializer: () => formData,
  });
  if (error || !data) throw new Error("Unable to upload profile photo");
  return data.url;
}
