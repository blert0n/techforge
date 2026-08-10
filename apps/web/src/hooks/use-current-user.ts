"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";

/**
 * Returns the current user only after client mount, keeping user-dependent UI
 * consistent between server rendering and hydration.
 */
export function useCurrentUser() {
  const session = useSession();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => setHasMounted(true), []);

  return {
    ...session,
    hasMounted,
    user: hasMounted ? session.data?.user : undefined,
  };
}
