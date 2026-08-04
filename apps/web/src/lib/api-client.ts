import createClient from "openapi-fetch";
import type { paths } from "../types/api";

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export const apiClient = createClient<paths>({
  baseUrl,
  credentials: "include",
});
