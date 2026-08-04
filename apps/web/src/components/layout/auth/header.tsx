import Link from "next/link";
import { Cpu } from "lucide-react";

import { cn } from "@/lib/utils";

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
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary">
          <Cpu className="size-4 text-primary-foreground" />
        </span>
        TechForge
      </Link>
      {children}
    </header>
  );
}
