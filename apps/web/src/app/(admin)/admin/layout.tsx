"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Boxes,
  ChartPie,
  ChevronDown,
  ChevronRight,
  Copyright,
  ListTree,
  List,
  Plus,
  Package,
  Tags,
  Users,
  type LucideIcon,
  Star,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
    ],
  },
  {
    label: "Sales",
    items: [
      {
        href: "/admin/orders",
        icon: Boxes,
        label: "Orders",
      },
      {
        href: "/admin/reviews",
        icon: Star,
        label: "Reviews",
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
  const [productsOpen, setProductsOpen] = useState(
    pathname.startsWith("/admin/products"),
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-6">
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
                  if (item.href === "/admin/products") {
                    const productActive =
                      pathname.startsWith("/admin/products");

                    return (
                      <div key={item.href}>
                        <button
                          type="button"
                          onClick={() => setProductsOpen((open) => !open)}
                          className={cn(
                            buttonVariants({ variant: "ghost" }),
                            "h-auto w-full justify-start gap-3 px-3 py-2 text-sm",
                            productActive
                              ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                              : "text-foreground",
                          )}
                        >
                          <Package className="size-5 text-muted-foreground" />
                          <span className="flex-1 text-left">Products</span>
                          <ChevronDown
                            className={cn(
                              "size-4 text-muted-foreground transition-transform",
                              productsOpen && "rotate-180",
                            )}
                          />
                        </button>
                        {productsOpen ? (
                          <div className="ml-5 mt-1 space-y-1 border-l border-border pl-3">
                            <Link
                              href="/admin/products"
                              className={cn(
                                buttonVariants({ variant: "ghost" }),
                                "h-auto w-full justify-start gap-2 px-3 py-1.5 text-sm",
                                pathname === "/admin/products"
                                  ? "text-primary"
                                  : "text-muted-foreground",
                              )}
                            >
                              <List className="size-4" />
                              List
                            </Link>
                            <Link
                              href="/admin/products/new"
                              className={cn(
                                buttonVariants({ variant: "ghost" }),
                                "h-auto w-full justify-start gap-2 px-3 py-1.5 text-sm",
                                pathname === "/admin/products/new"
                                  ? "text-primary"
                                  : "text-muted-foreground",
                              )}
                            >
                              <Plus className="size-4" />
                              Create
                            </Link>
                          </div>
                        ) : null}
                      </div>
                    );
                  }
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
