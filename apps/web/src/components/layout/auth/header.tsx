import Link from "next/link";

import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/layout/brand-logo";

interface HeaderProps {
  className?: string;
  children?: React.ReactNode;
}

export function Header({ className, children }: HeaderProps) {
  return (
    <header
      className={cn(
        "flex w-full items-center justify-between border-b border-border bg-card px-6 py-4",
        className,
      )}
    >
      <Link
        href="/"
        className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-foreground"
      >
        <BrandLogo markClassName="size-9" priority />
      </Link>
      {children}
    </header>
  );
}
