"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Boxes,
  ChartPie,
  ChevronRight,
  Copyright,
  ListTree,
  Package,
  Tags,
  UserRoundCog,
  Users,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type AdminNavigationItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: string;
  showChevron?: boolean;
};

type AdminNavigationGroup = {
  label: string;
  items: AdminNavigationItem[];
};

const adminNavigation: AdminNavigationGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/admin/dashboard", icon: ChartPie, label: "Dashboard" }],
  },
  {
    label: "Catalog",
    items: [
      {
        href: "/admin/products",
        icon: Package,
        label: "Products",
        showChevron: true,
      },
      { href: "/admin/categories", icon: Tags, label: "Categories" },
      {
        href: "/admin/specification-templates",
        icon: ListTree,
        label: "Specification Templates",
      },
      { href: "/admin/brands", icon: Copyright, label: "Brands" },
      { href: "/admin/inventory", icon: Warehouse, label: "Inventory" },
    ],
  },
  {
    label: "Sales",
    items: [
      {
        href: "/admin/orders",
        icon: Boxes,
        label: "Orders",
        badge: "12",
      },
    ],
  },
  {
    label: "Users",
    items: [{ href: "/admin/customers", icon: Users, label: "Customers" }],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex max-w-7xl gap-6">
      <aside className="sticky top-24 z-10 hidden h-[calc(100vh-8rem)] w-64 shrink-0 flex-col overflow-y-auto rounded-2xl border border-border bg-card shadow-sm md:flex">
        <div className="flex flex-col gap-2 border-b border-border p-6">
          <h1 className="text-lg font-bold text-foreground">Store Manager</h1>
          <Badge className="bg-primary/10 text-primary" variant="secondary">
            Administrator
          </Badge>
        </div>

        <nav aria-label="Admin navigation" className="flex-1 space-y-6 p-4">
          {adminNavigation.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active =
                    pathname === item.href ||
                    (item.href !== "/admin/dashboard" &&
                      pathname.startsWith(`${item.href}/`));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "h-auto w-full justify-start gap-3 px-3 py-2 text-sm",
                        active
                          ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                          : "text-foreground",
                      )}
                    >
                      <Icon className="size-5 text-muted-foreground" />
                      <span className="flex-1 text-left">{item.label}</span>

                      {item.badge ? (
                        <Badge
                          variant="destructive"
                          className="h-5 min-w-5 px-1.5"
                        >
                          {item.badge}
                        </Badge>
                      ) : null}

                      {item.showChevron ? (
                        <ChevronRight className="size-4 text-muted-foreground" />
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
