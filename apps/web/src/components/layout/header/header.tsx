"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Menu,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Heart,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { allCategoriesOption, accountActions } from "./header.constants";
import { SearchInput } from "@/components/ui/search-input";
import { useCurrentUser } from "@/hooks/use-current-user";
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
import { useNavigationCategories } from "@/hooks/use-catalog";
import { cartQueryKey, useCart } from "@/hooks/use-cart";
import { useDebounce } from "@/hooks/use-debounce";
import { getProducts, type StorefrontProduct } from "@/services/products";

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  const { user } = useCurrentUser();
  const { data: cart } = useCart();
  const queryClient = useQueryClient();
  const cartItemCount = cart?.items.length ?? 0;
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StorefrontProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: navigationCategories = [] } = useNavigationCategories();
  const navigationCategoryIds = new Set(
    navigationCategories.map((category) => category.id),
  );
  const topLevelCategories = navigationCategories.filter(
    (category) =>
      !category.parentIds.some((parentId) =>
        navigationCategoryIds.has(parentId),
      ),
  );
  const categories = [
    allCategoriesOption,
    ...navigationCategories.map((category) => ({
      value: category.slug,
      label: category.name,
    })),
  ];
  const selectedCategoryLabel =
    categories.find((category) => category.value === selectedCategory)?.label ??
    allCategoriesOption.label;

  async function searchProducts(query: string, category = selectedCategory) {
    const search = query.trim();
    if (!search) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const data = await getProducts({
      category: category === "all" ? undefined : category,
      search,
    });
    setSearchResults(data?.items ?? []);
    setIsSearching(false);
  }

  const debouncedSearch = useDebounce(searchProducts);

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
    await queryClient.resetQueries({ queryKey: cartQueryKey });
    router.replace("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="flex items-center justify-between bg-secondary px-4 py-2 text-xs text-secondary-foreground md:px-8"></div>

      <div className="flex items-center justify-between gap-4 px-4 py-4 md:gap-8 md:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-2xl font-bold tracking-tight"
        >
          <BrandLogo markClassName="size-8" priority />
        </Link>

        <div className="hidden flex-1 md:flex">
          <div className="relative flex w-full max-w-3xl">
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                const category = value ?? "all";
                setSelectedCategory(category);
                if (searchQuery.trim()) debouncedSearch(searchQuery, category);
              }}
            >
              <SelectTrigger className="hidden w-48 rounded-r-none lg:flex">
                <SelectValue className="capitalize">
                  {selectedCategoryLabel}
                </SelectValue>
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
              onFocus={() => setIsSearchOpen(true)}
              onQueryChange={(query) => {
                setSearchQuery(query);
                setIsSearchOpen(true);
                if (query.trim()) debouncedSearch(query);
                else void searchProducts(query);
              }}
              placeholder={`Search in ${selectedCategoryLabel.toLowerCase()}...`}
              className="rounded-l-md min-w-96"
            />
            {isSearchOpen && searchQuery.trim() ? (
              <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-lg border border-border bg-card shadow-lg lg:left-48">
                {isSearching ? (
                  <p className="px-4 py-3 text-sm text-muted-foreground">
                    Searching...
                  </p>
                ) : searchResults.length ? (
                  <ul className="max-h-96 divide-y divide-border overflow-y-auto scroll-smooth overscroll-contain">
                    {searchResults.map((product) => (
                      <li key={product.id}>
                        <Link
                          href={`/products/${product.slug}`}
                          className="block px-4 py-3 transition-colors hover:bg-muted"
                          onClick={() => setIsSearchOpen(false)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative size-10 shrink-0 overflow-hidden rounded bg-muted">
                              {product.imageUrl ? (
                                <Image
                                  alt={product.imageAltText ?? product.name}
                                  className="object-contain"
                                  fill
                                  sizes="40px"
                                  src={product.imageUrl}
                                />
                              ) : null}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {product.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {product.brand} · ${" "}
                                {(
                                  product.discountPrice ?? product.price
                                ).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-3 text-sm text-muted-foreground">
                    No matching products found.
                  </p>
                )}
              </div>
            ) : null}
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
                    <DropdownMenuItem
                      render={
                        <Link
                          href="/account/wishlist"
                          className="cursor-pointer px-2 py-2"
                        />
                      }
                    >
                      <Heart /> Wishlist
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
                  href={
                    !user &&
                    (href === "/account/dashboard" ||
                      href === "/account/orders")
                      ? "/sign-in"
                      : href
                  }
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

              {cartItemCount > 0 ? (
                <span
                  className="
                    absolute
                    -right-2
                    -top-1
                    flex
                    h-4
                    min-w-4
                    items-center
                    justify-center
                    rounded-full
                    bg-primary
                    px-1
                    text-[10px]
                    font-bold
                    text-primary-foreground
                  "
                >
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              ) : null}
            </div>

            <span className="hidden text-sm font-medium md:block">Cart</span>
          </Link>
        </div>
      </div>

      <nav className="overflow-x-auto border-t border-border px-4 py-2 md:px-8">
        <ul className="flex items-center gap-6 whitespace-nowrap text-sm font-medium">
          <Menu className="h-4 w-4" />

          <li>
            <Link
              href="/category"
              className="transition-colors hover:text-primary"
            >
              All Categories
            </Link>
          </li>

          {topLevelCategories.map((category) => {
            const children = navigationCategories.filter((item) =>
              item.parentIds.includes(category.id),
            );

            return (
              <li key={category.id}>
                {children.length ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <button
                          className="flex cursor-pointer items-center gap-1 transition-colors hover:text-primary"
                          type="button"
                        />
                      }
                    >
                      {category.name}
                      <ChevronDown className="size-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-52" sideOffset={10}>
                      <DropdownMenuItem
                        render={
                          <Link
                            className="cursor-pointer px-2 py-2 font-medium"
                            href={`/category/${category.slug}`}
                          />
                        }
                      >
                        View all {category.name}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {children.map((child) => (
                        <DropdownMenuItem
                          key={child.id}
                          render={
                            <Link
                              className="cursor-pointer px-2 py-2"
                              href={`/category/${child.slug}`}
                            />
                          }
                        >
                          {child.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    href={`/category/${category.slug}`}
                    className="transition-colors hover:text-primary"
                  >
                    {category.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {children}
    </header>
  );
}
