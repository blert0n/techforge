"use client";

import { Camera, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const STAGE_SIZE = 320;

export function AvatarPicker({
  image,
  onChange,
}: {
  image?: string | null;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [removed, setRemoved] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [center, setCenter] = useState({ x: 160, y: 160 });
  const dragStart = useRef<{
    x: number;
    y: number;
    center: typeof center;
  } | null>(null);
  const diameter = 220 / zoom;
  const radius = diameter / 2;

  useEffect(() => {
    if (image && !preview && !removed) setPreview(image);
  }, [image, preview, removed]);

  function choose(selected?: File) {
    if (!selected) return;
    setRemoved(false);
    setFile(selected);
    setDraft(URL.createObjectURL(selected));
    setZoom(1);
    setCenter({ x: 160, y: 160 });
  }

  function move(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragStart.current) return;
    const next = {
      x: Math.min(
        STAGE_SIZE - radius,
        Math.max(
          radius,
          dragStart.current.center.x + event.clientX - dragStart.current.x,
        ),
      ),
      y: Math.min(
        STAGE_SIZE - radius,
        Math.max(
          radius,
          dragStart.current.center.y + event.clientY - dragStart.current.y,
        ),
      ),
    };
    setCenter(next);
  }

  async function applyCrop() {
    if (!file || !draft) return;
    const bitmap = await createImageBitmap(file);
    const baseScale =
      Math.max(STAGE_SIZE / bitmap.width, STAGE_SIZE / bitmap.height) * zoom;
    const displayedWidth = bitmap.width * baseScale;
    const displayedHeight = bitmap.height * baseScale;
    const left = (STAGE_SIZE - displayedWidth) / 2;
    const top = (STAGE_SIZE - displayedHeight) / 2;
    const sourceSize = diameter / baseScale;
    const sourceX = (center.x - radius - left) / baseScale;
    const sourceY = (center.y - radius - top) / baseScale;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.beginPath();
    context.arc(256, 256, 256, 0, Math.PI * 2);
    context.clip();
    context.drawImage(
      bitmap,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      512,
      512,
    );
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    if (!blob) return;
    const avatar = new File([blob], "avatar.png", { type: "image/png" });
    setPreview(URL.createObjectURL(avatar));
    setRemoved(false);
    onChange(avatar);
    setDraft(null);
  }

  return (
    <>
      <div className="relative mx-auto size-24 shrink-0">
        <div className="grid size-24 place-items-center overflow-hidden rounded-full border-2 border-border bg-muted">
          {preview ? (
            <img
              alt="Profile preview"
              className="size-full object-cover object-center"
              src={preview}
            />
          ) : (
            <Camera className="size-7 text-muted-foreground" />
          )}
        </div>
        {preview && (
          <Button
            aria-label="Remove profile photo"
            className="absolute -top-1 -right-1 rounded-full border-2 border-background"
            size="icon-xs"
            type="button"
            variant="destructive"
            onClick={() => {
              setPreview(null);
              setRemoved(true);
              onChange(null);
            }}
          >
            <X />
          </Button>
        )}
        <Button
          aria-label="Choose profile photo"
          className="absolute -right-1 -bottom-1 rounded-full border-2 border-background"
          size="icon-xs"
          type="button"
          onClick={() => inputRef.current?.click()}
        >
          <Plus />
        </Button>
        <input
          ref={inputRef}
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          type="file"
          onChange={(event) => choose(event.target.files?.[0])}
        />
      </div>

      {draft && file && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="font-bold">Crop profile photo</h2>
                <p className="text-sm text-muted-foreground">
                  Drag the circle to choose the visible area.
                </p>
              </div>
              <Button
                aria-label="Close"
                size="icon-sm"
                type="button"
                variant="ghost"
                onClick={() => setDraft(null)}
              >
                <X />
              </Button>
            </div>
            <div
              ref={stageRef}
              className="relative mx-auto size-80 touch-none overflow-hidden rounded-lg bg-muted"
              onPointerMove={move}
              onPointerUp={() => {
                dragStart.current = null;
              }}
            >
              <img
                alt="Crop source"
                className="absolute max-w-none select-none"
                draggable={false}
                src={draft}
                style={{
                  width: `${STAGE_SIZE * zoom}px`,
                  height: `${STAGE_SIZE * zoom}px`,
                  left: `${(STAGE_SIZE - STAGE_SIZE * zoom) / 2}px`,
                  top: `${(STAGE_SIZE - STAGE_SIZE * zoom) / 2}px`,
                  objectFit: "cover",
                }}
              />
              <div
                className="absolute rounded-full border-2 border-white shadow-[0_0_0_999px_rgb(0_0_0/0.45)]"
                style={{
                  width: diameter,
                  height: diameter,
                  left: center.x - radius,
                  top: center.y - radius,
                }}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  dragStart.current = {
                    x: event.clientX,
                    y: event.clientY,
                    center,
                  };
                }}
              />
            </div>
            <label className="mt-5 flex items-center gap-3 text-sm">
              <span>Zoom</span>
              <input
                className="flex-1"
                max="2"
                min="0.7"
                step="0.05"
                type="range"
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
              />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDraft(null)}
              >
                Cancel
              </Button>
              <Button type="button" onClick={() => void applyCrop()}>
                Use photo
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
