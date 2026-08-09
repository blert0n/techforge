"use client";

import Link from "next/link";
import {
  ShoppingCart,
  MapPin,
  Menu,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { utilityLinks, categories, accountActions } from "./header.constants";
import { SearchInput } from "@/components/ui/search-input";
import { useSession } from "@/lib/auth-client";
import { BrandLogo } from "@/components/layout/brand-logo";
import { signOut } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    const { error } = await signOut();
    setIsSigningOut(false);
    if (error) {
      toast.error(error.message || "Unable to log out.", {
        position: "top-center",
      });
      return;
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="flex items-center justify-between bg-secondary px-4 py-2 text-xs text-secondary-foreground md:px-8">
        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="flex items-center gap-1 transition-colors hover:text-primary"
          >
            <MapPin className="h-3 w-3" />
            Ship to: United States
          </Link>

          <Link
            href="/deals"
            className="hidden transition-colors hover:text-primary md:block"
          >
            Today's Deals
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {utilityLinks
            .filter((link) => ["Track Order", "Help"].includes(link.label))
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 px-4 py-4 md:gap-8 md:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-2xl font-bold tracking-tight"
        >
          <BrandLogo markClassName="size-8" priority />
        </Link>

        <div className="hidden flex-1 md:flex">
          <div className="flex w-full max-w-3xl">
            <Select defaultValue="All Categories">
              <SelectTrigger className="hidden w-48 rounded-r-none lg:flex">
                <SelectValue />
              </SelectTrigger>

              <SelectContent
                side="bottom"
                align="start"
                sideOffset={4}
                alignItemWithTrigger={false}
              >
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <SearchInput
              placeholder="Search for GPUs, CPUs, monitors, and more..."
              className="rounded-l-md min-w-96"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-6">
          {accountActions.map(
            ({ href, desktopTop, desktopLabel, icon: Icon, dropdown }) =>
              href === "/account/dashboard" && user ? (
                <DropdownMenu key={href}>
                  <DropdownMenuTrigger
                    render={
                      <button
                        className="group flex cursor-pointer flex-col text-left text-foreground transition-colors hover:text-primary"
                        type="button"
                      />
                    }
                  >
                    <span className="hidden text-xs text-muted-foreground group-hover:text-primary md:block">
                      Hello, {user.name}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-medium">
                      <Icon className="h-5 w-5 md:hidden" />
                      <span className="hidden items-center md:flex">
                        {desktopLabel}
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </span>
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56"
                    sideOffset={10}
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="px-2 py-2">
                        <span className="block truncate font-medium text-foreground">
                          {user.name}
                        </span>
                        <span className="block truncate font-normal">
                          {user.email}
                        </span>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      render={
                        <Link
                          href="/account/dashboard"
                          className="cursor-pointer px-2 py-2"
                        />
                      }
                    >
                      <UserRound /> My account
                    </DropdownMenuItem>
                    {user.role === "admin" ? (
                      <DropdownMenuItem
                        render={
                          <Link
                            href="/admin/dashboard"
                            className="cursor-pointer px-2 py-2"
                          />
                        }
                      >
                        <LayoutDashboard /> Admin dashboard
                      </DropdownMenuItem>
                    ) : null}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer px-2 py-2"
                      disabled={isSigningOut}
                      variant="destructive"
                      onClick={() => void handleSignOut()}
                    >
                      <LogOut /> {isSigningOut ? "Logging out..." : "Log out"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={href}
                  href={href === "/account/dashboard" ? "/sign-in" : href}
                  className="group flex flex-col text-foreground transition-colors hover:text-primary"
                >
                  <span className="hidden text-xs text-muted-foreground group-hover:text-primary md:block">
                    {desktopTop}
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <Icon className="h-5 w-5 md:hidden" />
                    <span className="hidden items-center md:flex">
                      {desktopLabel}
                      {dropdown && <ChevronDown className="ml-1 h-3 w-3" />}
                    </span>
                  </span>
                </Link>
              ),
          )}

          <Link
            href="/cart"
            className="
              flex
              items-center
              gap-2
              text-foreground
              transition-colors
              hover:text-primary
            "
          >
            <div className="relative inline-flex">
              <ShoppingCart className="h-6 w-6" />

              <span
                className="
                  absolute
                  -right-2
                  -top-1
                  flex
                  h-4
                  w-4
                  items-center
                  justify-center
                  rounded-full
                  bg-primary
                  text-[10px]
                  font-bold
                  text-primary-foreground
                "
              >
                2
              </span>
            </div>

            <span className="hidden text-sm font-medium md:block">Cart</span>
          </Link>
        </div>
      </div>

      <nav className="overflow-x-auto border-t border-border px-4 py-2 md:px-8">
        <ul className="flex items-center gap-6 whitespace-nowrap text-sm font-medium">
          <Menu className="h-4 w-4" />

          {categories
            .filter((category) => category.value !== "all")
            .map((category) => (
              <li key={category.value}>
                <Link
                  href={`/category/${category.value.replaceAll(" ", "-").toLowerCase()}`}
                  className="transition-colors hover:text-primary"
                >
                  {category.label}
                </Link>
              </li>
            ))}
        </ul>
      </nav>

      {children}
    </header>
  );
}
