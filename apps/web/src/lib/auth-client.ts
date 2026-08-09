import { createAuthClient } from "better-auth/react";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@techforge/api/auth";

const apiPath = process.env.NEXT_PUBLIC_API_URL ?? "/api/auth";
const baseURL =
  typeof window === "undefined"
    ? process.env.API_ORIGIN ?? "http://localhost:3001"
    : new URL(apiPath, window.location.origin).toString();

export const authClient = createAuthClient({
  baseURL,
  plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
});

export const { useSession, signIn, signUp, signOut } = authClient;
