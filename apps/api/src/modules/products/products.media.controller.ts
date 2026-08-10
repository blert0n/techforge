import type { Context } from "hono";
import { createHash } from "node:crypto";
import { env } from "../../config/env";

function cloudinaryConfiguration() {
  const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } =
    env;
  if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET || !CLOUDINARY_CLOUD_NAME)
    return null;
  return {
    apiKey: CLOUDINARY_API_KEY,
    apiSecret: CLOUDINARY_API_SECRET,
    cloudName: CLOUDINARY_CLOUD_NAME,
  };
}

function createCloudinarySignature(
  params: Record<string, string>,
  apiSecret: string,
) {
  const value = Object.entries(params)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, item]) => `${key}=${item}`)
    .join("&");
  return createHash("sha1").update(`${value}${apiSecret}`).digest("hex");
}

async function uploadToCloudinary(file: string | File, folder: string) {
  const config = cloudinaryConfiguration();
  if (!config) throw new Error("Cloudinary is not configured.");

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signatureParams = { folder, timestamp };
  const formData = new FormData();
  formData.set("file", file);
  formData.set("api_key", config.apiKey);
  formData.set("timestamp", timestamp);
  formData.set("folder", signatureParams.folder);
  formData.set(
    "signature",
    createCloudinarySignature(signatureParams, config.apiSecret),
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
    { method: "POST", body: formData },
  );
  const payload = (await response.json()) as {
    secure_url?: string;
    error?: { message?: string };
  };
  if (!response.ok || !payload.secure_url) {
    throw new Error(
      payload.error?.message ?? "Cloudinary could not upload the image.",
    );
  }
  return payload.secure_url;
}

async function uploadMedia(c: Context, folder: string) {
  try {
    const contentType = c.req.header("content-type") ?? "";
    let file: string | File;

    if (contentType.includes("application/json")) {
      const body = await c.req.json<{ sourceUrl?: string }>();
      const sourceUrl = body.sourceUrl?.trim();
      if (!sourceUrl)
        return c.json({ message: "Provide a valid HTTP(S) image URL." }, 400);
      try {
        const parsedUrl = new URL(sourceUrl);
        if (!["http:", "https:"].includes(parsedUrl.protocol))
          throw new Error();
      } catch {
        return c.json({ message: "Provide a valid HTTP(S) image URL." }, 400);
      }
      file = sourceUrl;
    } else {
      const body = await c.req.parseBody();
      const uploadedFile = body.file;
      if (
        !(uploadedFile instanceof File) ||
        !uploadedFile.type.startsWith("image/")
      ) {
        return c.json({ message: "Choose an image file to upload." }, 400);
      }
      file = uploadedFile;
    }

    const url = await uploadToCloudinary(file, folder);
    return c.json({ url }, 201);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to upload the image.";
    return c.json({ message }, cloudinaryConfiguration() ? 502 : 503);
  }
}

export function uploadProductMedia(c: Context) {
  return uploadMedia(c, "techforge/products");
}

export function uploadUserAvatarMedia(c: Context) {
  return uploadMedia(c, "techforge/avatars");
}
