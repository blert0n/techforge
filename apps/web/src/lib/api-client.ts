import createClient from "openapi-fetch";
import type { paths } from "../types/api";

const baseUrl =
  typeof window === "undefined"
    ? process.env.API_ORIGIN ?? "http://localhost:3001"
    : window.location.origin;

export const apiClient = createClient<paths>({
  baseUrl,
  credentials: "include",
});
