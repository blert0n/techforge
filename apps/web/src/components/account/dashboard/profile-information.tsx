"use client";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";

export default function ProfileInformation() {
  const user = useCurrentUser();
  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border p-6">
        <h2 className="text-lg font-bold uppercase tracking-wider text-foreground">
          Profile Information
        </h2>

        <Link
          href="/account/settings/"
          className="text-sm font-medium text-primary hover:underline"
        >
          Edit
        </Link>
      </div>

      <div className="space-y-4 p-6">
        <div className="grid grid-cols-3 gap-2 border-b border-border/50 py-2">
          <div className="text-sm text-muted-foreground">Name</div>

          <div className="col-span-2 text-sm font-medium text-foreground">
            {user.user?.name}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 border-b border-border/50 py-2">
          <div className="text-sm text-muted-foreground">Email</div>

          <div className="col-span-2 text-sm font-medium text-foreground">
            {user.user?.email}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-2">
          <div className="text-sm text-muted-foreground">Password</div>

          <div className="col-span-2 text-sm font-medium text-foreground">
            ••••••••
          </div>
        </div>
      </div>
    </section>
  );
}
