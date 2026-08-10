"use client";

import { Button } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";
import { LogOut, UserRoundCog } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ImpersonationBanner() {
  const { data } = useSession();
  const [isStopping, setIsStopping] = useState(false);
  const impersonatedBy = data?.session.impersonatedBy;

  if (!impersonatedBy) return null;

  async function stopImpersonating() {
    setIsStopping(true);
    const { error } = await authClient.admin.stopImpersonating();
    if (error) {
      setIsStopping(false);
      toast.error(error.message || "Unable to stop impersonating.");
      return;
    }
    window.location.href = "/admin/customers";
  }

  return (
    <div className="sticky top-0 z-100 flex items-center justify-center gap-3 border-b border-amber-300 bg-amber-100 px-4 py-2 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
      <UserRoundCog className="size-4" />
      <span>
        You are impersonating{" "}
        <strong>{data.user.name || data.user.email}</strong>.
      </span>
      <Button
        disabled={isStopping}
        size="sm"
        type="button"
        variant="outline"
        onClick={() => void stopImpersonating()}
      >
        <LogOut /> {isStopping ? "Stopping..." : "Return to admin"}
      </Button>
    </div>
  );
}
