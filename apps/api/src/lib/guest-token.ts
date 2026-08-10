import { createHash, randomUUID } from "node:crypto";

export function hashGuestToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createGuestToken() {
  return randomUUID();
}

export function isGuestToken(
  value: string | null | undefined,
): value is string {
  return Boolean(
    value &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    ),
  );
}
