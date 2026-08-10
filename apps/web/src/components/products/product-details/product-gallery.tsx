"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function ProductGallery({
  images,
  name,
}: {
  images: { url: string; altText: string | null }[];
  name: string;
}) {
  const [selected, setSelected] = useState(0);
  const image = images[selected];

  return (
    <div className="w-full lg:w-1/2">
      <div
        className={
          images.length > 1 ? "grid gap-3 sm:grid-cols-[4.5rem_1fr]" : undefined
        }
      >
        {images.length > 1 ? (
          <div className="order-2 flex gap-2 sm:order-1 sm:flex-col">
            {images.map((item, index) => (
              <Button
                key={item.url}
                type="button"
                variant="outline"
                onClick={() => setSelected(index)}
                className={`h-auto aspect-square w-16 shrink-0 p-2 sm:w-full ${selected === index ? "border-2 border-primary" : ""}`}
              >
                <Image
                  src={item.url}
                  alt={item.altText ?? `${name} thumbnail`}
                  width={100}
                  height={100}
                  className="h-full w-full object-contain"
                />
              </Button>
            ))}
          </div>
        ) : null}
        <div className="relative flex aspect-[4/3] max-h-[30rem] items-center justify-center overflow-hidden rounded-3xl border border-border bg-card p-8 sm:order-2">
          {image ? (
            <Image
              src={image.url}
              alt={image.altText ?? name}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-contain p-10"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
