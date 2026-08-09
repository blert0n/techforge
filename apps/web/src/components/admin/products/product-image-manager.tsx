"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  ImageIcon,
  ImagePlus,
  Link2,
  Search,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { uploadProductImage } from "@/services/products";

export type ProductImageValue = {
  url: string;
  altText: string;
};

type ImageBackgroundPreference = "transparent" | "white";

type ProductImageManagerProps = {
  brandName?: string;
  error?: string;
  images: ProductImageValue[];
  maxImages?: number;
  onAdd: (image: ProductImageValue) => void;
  onAltTextChange: (index: number, altText: string) => void;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
  productName: string;
};

function isValidHostedImageUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function ProductImageManager({
  brandName,
  error,
  images,
  maxImages = 4,
  onAdd,
  onAltTextChange,
  onMove,
  onRemove,
  productName,
}: ProductImageManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [backgroundPreference, setBackgroundPreference] =
    useState<ImageBackgroundPreference>("transparent");
  const [url, setUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productName || images.length) return;
    setAltText("");
    setUrl("");
    setSearchQuery("");
  }, [images.length, productName]);

  function openDialog() {
    const suggestedQuery = [brandName, productName].filter(Boolean).join(" ");
    setSearchQuery(suggestedQuery);
    if (!altText) setAltText(productName);
    setIsOpen(true);
  }

  function addImage(uploadedUrl: string) {
    const normalizedUrl = uploadedUrl.trim();

    if (!isValidHostedImageUrl(normalizedUrl)) {
      toast.error("Enter a valid hosted image URL.", {
        position: "top-center",
      });
      return;
    }

    if (images.some((image) => image.url === normalizedUrl)) {
      toast.error("That image is already in the gallery.", {
        position: "top-center",
      });
      return;
    }

    if (images.length >= maxImages) {
      toast.error(`A product can have up to ${maxImages} images.`, {
        position: "top-center",
      });
      return;
    }

    onAdd({ url: normalizedUrl, altText: altText.trim() || productName });
    setAltText(productName);
    toast.success("Image added to the product gallery.", {
      position: "top-center",
    });
  }

  async function uploadAndAdd(source: string | File) {
    if (images.length >= maxImages) {
      toast.error(`A product can have up to ${maxImages} images.`, {
        position: "top-center",
      });
      return;
    }

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadProductImage(source);
      addImage(uploadedUrl);
      if (typeof source === "string") setUrl("");
    } catch (uploadError) {
      toast.error(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload the image.",
        {
          position: "top-center",
        },
      );
    } finally {
      setIsUploading(false);
    }
  }

  const backgroundTerms =
    backgroundPreference === "transparent"
      ? "product isolated transparent background PNG"
      : "product isolated white background";
  const encodedSearch = encodeURIComponent(
    `${searchQuery.trim()} ${backgroundTerms}`.trim(),
  );
  const googleImageFilter =
    backgroundPreference === "transparent"
      ? "ic:trans"
      : "ic:specific,isc:white";
  const searchProviders = [
    {
      label:
        backgroundPreference === "transparent"
          ? "Google transparent"
          : "Google white background",
      href: `https://www.google.com/search?tbm=isch&tbs=${googleImageFilter}&q=${encodedSearch}`,
    },
    {
      label: "Bing fallback",
      href: `https://www.bing.com/images/search?q=${encodedSearch}`,
    },
  ];

  return (
    <>
      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-border p-5">
          <div className="flex items-center gap-2">
            <ImagePlus className="size-5 text-primary" />
            <div>
              <h2 className="font-semibold text-foreground">Product images</h2>
              <p className="text-xs text-muted-foreground">
                {images.length}/{maxImages} images
              </p>
            </div>
          </div>
          <Button
            onClick={openDialog}
            size="sm"
            type="button"
            variant="outline"
          >
            <ImagePlus />
            Manage
          </Button>
        </div>

        <div className="p-5">
          {images.length ? (
            <div className="grid grid-cols-3 gap-2">
              {images.slice(0, 6).map((image, index) => (
                <button
                  className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                  key={`${image.url}-${index}`}
                  onClick={openDialog}
                  type="button"
                >
                  <img
                    alt={image.altText || productName}
                    className="size-full object-contain p-1"
                    src={image.url}
                  />
                  {index === 0 ? (
                    <span className="absolute inset-x-1 bottom-1 rounded bg-primary px-1 py-0.5 text-[9px] font-semibold text-primary-foreground">
                      Primary
                    </span>
                  ) : null}
                </button>
              ))}
              {images.length > 6 ? (
                <button
                  className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-xs font-medium text-muted-foreground"
                  onClick={openDialog}
                  type="button"
                >
                  +{images.length - 6} more
                </button>
              ) : null}
            </div>
          ) : (
            <button
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-8 text-center transition-colors hover:bg-muted/40"
              onClick={openDialog}
              type="button"
            >
              <ImageIcon className="size-7 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Add product images
              </span>
              <span className="text-xs text-muted-foreground">
                Search online or upload an image
              </span>
            </button>
          )}
          {error ? (
            <p className="mt-2 text-xs text-destructive">{error}</p>
          ) : null}
          <p className="mt-3 text-xs text-muted-foreground">
            The first image is the primary catalog image. Drag-free controls are
            available in the media dialog.
          </p>
        </div>
      </section>

      {isOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4 backdrop-blur-sm"
              role="presentation"
            >
              <div
                aria-labelledby="product-media-title"
                aria-modal="true"
                className="flex max-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
                role="dialog"
              >
                <header className="flex items-start justify-between gap-4 border-b border-border p-5">
                  <div>
                    <h2
                      className="text-lg font-semibold text-foreground"
                      id="product-media-title"
                    >
                      Product media
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Add a source URL or file. Images are stored in Cloudinary
                      before they are added to this product.
                    </p>
                  </div>
                  <Button
                    aria-label="Close product media dialog"
                    onClick={() => setIsOpen(false)}
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                  >
                    <X />
                  </Button>
                </header>

                <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                  <div className="space-y-6 border-b border-border p-5 lg:border-r lg:border-b-0">
                    <section className="space-y-3">
                      <div>
                        <h3 className="font-medium text-foreground">
                          Search online
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Verify usage rights and prefer manufacturer-approved
                          product photography.
                        </p>
                      </div>
                      <div className="relative">
                        <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto size-4 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          onChange={(event) =>
                            setSearchQuery(event.target.value)
                          }
                          placeholder="Product title or SKU"
                          value={searchQuery}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Required background</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={() =>
                              setBackgroundPreference("transparent")
                            }
                            type="button"
                            variant={
                              backgroundPreference === "transparent"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            Transparent
                          </Button>
                          <Button
                            onClick={() => setBackgroundPreference("white")}
                            type="button"
                            variant={
                              backgroundPreference === "white"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            White background
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Google receives both an isolated-product query and the
                          matching transparent or white color filter.
                        </p>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {searchProviders.map((provider) => (
                          <Button
                            disabled={!searchQuery.trim()}
                            key={provider.label}
                            nativeButton={false}
                            render={
                              <a
                                href={provider.href}
                                rel="noreferrer"
                                target="_blank"
                              />
                            }
                            size="sm"
                            variant="outline"
                          >
                            <ExternalLink />
                            {provider.label}
                          </Button>
                        ))}
                      </div>
                    </section>

                    <section className="space-y-4 rounded-xl border border-border bg-muted/25 p-4">
                      <div className="flex items-center gap-2">
                        <Link2 className="size-4 text-primary" />
                        <div>
                          <h3 className="font-medium text-foreground">
                            Add image
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Paste an image URL from your search, or upload a
                            file directly.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="new-product-image-url">Image URL</Label>
                        <Input
                          id="new-product-image-url"
                          onChange={(event) => setUrl(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              void uploadAndAdd(url.trim());
                            }
                          }}
                          placeholder="https://cdn.example.com/product/front.webp"
                          value={url}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="new-product-image-alt">Alt text</Label>
                        <Input
                          id="new-product-image-alt"
                          maxLength={250}
                          onChange={(event) => setAltText(event.target.value)}
                          placeholder="Product name and viewing angle"
                          value={altText}
                        />
                      </div>
                      <Button
                        className="w-full"
                        disabled={
                          !url.trim() ||
                          images.length >= maxImages ||
                          isUploading
                        }
                        onClick={() => void uploadAndAdd(url.trim())}
                        type="button"
                      >
                        <Upload
                          className={isUploading ? "animate-pulse" : undefined}
                        />
                        {isUploading ? "Uploading…" : "Upload & add to gallery"}
                      </Button>
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-xs text-muted-foreground">
                          or
                        </span>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                      <input
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) void uploadAndAdd(file);
                          event.target.value = "";
                        }}
                        ref={fileInputRef}
                        type="file"
                      />
                      <Button
                        className="w-full"
                        disabled={images.length >= maxImages || isUploading}
                        onClick={() => fileInputRef.current?.click()}
                        type="button"
                        variant="outline"
                      >
                        <ImagePlus /> Upload from computer
                      </Button>
                    </section>
                  </div>

                  <section className="min-w-0 p-5">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-foreground">
                          Product gallery
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Position 1 is used as the primary image.
                        </p>
                      </div>
                      <Badge variant="outline">
                        {images.length}/{maxImages}
                      </Badge>
                    </div>

                    {images.length ? (
                      <div className="space-y-3">
                        {images.map((image, index) => (
                          <article
                            className="flex flex-col gap-3 rounded-xl border border-border p-3 sm:flex-row sm:items-center"
                            key={`${image.url}-${index}`}
                          >
                            <div className="relative flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted sm:size-24">
                              <img
                                alt={image.altText || productName}
                                className="size-full object-contain p-2"
                                src={image.url}
                              />
                              {index === 0 ? (
                                <Badge className="absolute top-1 left-1">
                                  <Star /> Primary
                                </Badge>
                              ) : null}
                            </div>
                            <div className="min-w-0 flex-1 space-y-2">
                              <p
                                className="truncate text-xs text-muted-foreground"
                                title={image.url}
                              >
                                {image.url}
                              </p>
                              <Input
                                aria-label={`Alt text for image ${index + 1}`}
                                maxLength={250}
                                onChange={(event) =>
                                  onAltTextChange(index, event.target.value)
                                }
                                placeholder="Alt text"
                                value={image.altText}
                              />
                              <div className="flex flex-wrap gap-1">
                                {index > 0 ? (
                                  <Button
                                    onClick={() => onMove(index, 0)}
                                    size="xs"
                                    type="button"
                                    variant="outline"
                                  >
                                    <Star /> Make primary
                                  </Button>
                                ) : null}
                                <Button
                                  aria-label={`Move image ${index + 1} up`}
                                  disabled={index === 0}
                                  onClick={() => onMove(index, index - 1)}
                                  size="icon-xs"
                                  type="button"
                                  variant="ghost"
                                >
                                  <ArrowUp />
                                </Button>
                                <Button
                                  aria-label={`Move image ${index + 1} down`}
                                  disabled={index === images.length - 1}
                                  onClick={() => onMove(index, index + 1)}
                                  size="icon-xs"
                                  type="button"
                                  variant="ghost"
                                >
                                  <ArrowDown />
                                </Button>
                                <Button
                                  aria-label={`Remove image ${index + 1}`}
                                  onClick={() => onRemove(index)}
                                  size="icon-xs"
                                  type="button"
                                  variant="destructive"
                                >
                                  <Trash2 />
                                </Button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-center">
                        <ImageIcon className="size-8 text-muted-foreground" />
                        <p className="font-medium text-foreground">
                          No images added
                        </p>
                        <p className="max-w-xs text-sm text-muted-foreground">
                          Search for source material, upload it to your image
                          host, then paste the resulting URL here.
                        </p>
                      </div>
                    )}
                  </section>
                </div>

                <footer className="flex items-center justify-between gap-3 border-t border-border p-4">
                  <p className="text-xs text-muted-foreground">
                    Gallery order is saved with the product.
                  </p>
                  <Button onClick={() => setIsOpen(false)} type="button">
                    Done
                  </Button>
                </footer>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
