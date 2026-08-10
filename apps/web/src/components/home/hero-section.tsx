import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative flex min-h-105 items-center overflow-hidden rounded-2xl bg-black sm:min-h-120 sm:rounded-[32px] lg:h-130">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/home/main.webp"
          alt="Premium gaming workstation"
          fill
          priority
          className="object-cover opacity-60"
        />
      </div>

      <div className="relative z-10 max-w-2xl px-5 py-10 text-center sm:px-8 sm:py-12 lg:px-16 lg:py-20 lg:text-left">
        <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm">
          New Release
        </span>

        <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          Forge your ultimate workstation.
        </h1>

        <p className="mb-8 max-w-lg text-base leading-relaxed text-gray-300 sm:mx-auto sm:text-lg lg:mx-0 md:text-xl">
          Experience uncompromised performance with the latest RTX 40-Series and
          14th Gen Intel processors.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
          <Link
            className="inline-flex h-10 items-center justify-center rounded-full bg-white px-8 text-center text-black hover:bg-gray-200 sm:w-auto"
            href="/category"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
}
