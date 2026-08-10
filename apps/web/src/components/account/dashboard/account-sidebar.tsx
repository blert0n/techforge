"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { accountMenu } from "../data/account.mock";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserRound } from "lucide-react";

export default function AccountSidebar() {
  const pathname = usePathname();
  const user = useCurrentUser();

  return (
    <aside
      className="
        w-full
        shrink-0
        space-y-2
        md:w-64
      "
    >
      <div
        className="
          mb-4
          flex
          items-center
          gap-4
          rounded-xl
          border
          border-border
          bg-card
          p-4
          shadow-sm
        "
      >
        {user?.user?.image ? (
          <img
            alt="Profile preview"
            className="h-12 w-12 rounded-full object-cover object-center"
            src={user.user.image}
          />
        ) : (
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-500"
            aria-label="Profile preview"
          >
            <UserRound className="h-6 w-6" strokeWidth={1.8} />
          </div>
        )}

        <div>
          <h2 className="font-bold text-foreground">
            {user?.user?.name ?? ""}
          </h2>

          <p className="text-xs text-muted-foreground">alex@example.com</p>
        </div>
      </div>

      <nav className="space-y-1">
        {accountMenu.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex
                items-center
                gap-3
                rounded-lg
                px-4
                py-3
                transition-colors

                ${
                  active
                    ? `
                      bg-primary/10
                      font-medium
                      text-primary
                    `
                    : `
                      text-muted-foreground
                      hover:bg-muted
                      hover:text-foreground
                    `
                }
              `}
            >
              <Icon className="h-5 w-5" />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
