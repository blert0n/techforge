import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  alt?: string;
  className?: string;
  priority?: boolean;
};

export function BrandMark({
  alt = "TechForge logo",
  className,
  priority = false,
}: BrandMarkProps) {
  return (
    <Image
      alt={alt}
      className={cn("size-8 shrink-0 object-contain", className)}
      height={219}
      priority={priority}
      src="/logo.png"
      width={219}
    />
  );
}

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  nameClassName?: string;
  priority?: boolean;
};

export function BrandLogo({
  className,
  markClassName,
  nameClassName,
  priority = false,
}: BrandLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <BrandMark alt="" className={markClassName} priority={priority} />
      <span className={nameClassName}>TechForge</span>
    </span>
  );
}
