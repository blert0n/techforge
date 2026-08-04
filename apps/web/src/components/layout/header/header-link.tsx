import Link from "next/link";
import { ChevronDown, LucideIcon } from "lucide-react";

interface HeaderLinkProps {
  href: string;
  icon?: LucideIcon;
  mobileLabel?: string;
  desktopTop?: string;
  desktopLabel?: string;
  dropdown?: boolean;
}

export function HeaderLink({
  href,
  icon: Icon,
  mobileLabel,
  desktopTop,
  desktopLabel,
  dropdown,
}: HeaderLinkProps) {
  return (
    <Link
      href={href}
      className="
        group
        flex
        flex-col
        text-foreground
        transition-colors
        hover:text-primary
      "
    >
      {desktopTop && (
        <span
          className="
            hidden
            text-xs
            text-muted-foreground
            group-hover:text-primary
            md:block
          "
        >
          {desktopTop}
        </span>
      )}

      <span className="flex items-center gap-1 text-sm font-medium">
        {Icon && <Icon className="h-5 w-5 md:hidden" />}

        <span className="hidden md:flex md:items-center">
          {desktopLabel}

          {dropdown && <ChevronDown className="ml-1 h-3 w-3" />}
        </span>

        <span className="md:hidden">{mobileLabel}</span>
      </span>
    </Link>
  );
}
