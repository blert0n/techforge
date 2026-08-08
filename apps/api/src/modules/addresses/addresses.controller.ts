import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import type { RouteHandler } from "@hono/zod-openapi";

import { db } from "../../db/client.js";
import { address } from "../../db/schema/index.js";
import type {
  createAddressRoute,
  deleteAddressRoute,
  getAddressRoute,
  listAddressesRoute,
  updateAddressRoute,
} from "./addresses.routes.js";

function serializeAddress(record: typeof address.$inferSelect) {
  return {
    id: record.id,
    type: record.type as "Home" | "Work" | "Other",
    firstName: record.firstName,
    lastName: record.lastName,
    phone: record.phone,
    line1: record.line1,
    line2: record.line2 ?? undefined,
    city: record.city,
    state: record.state,
    postalCode: record.postalCode,
    country: record.country,
    isDefault: record.isDefault,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export const listAddresses: RouteHandler<typeof listAddressesRoute> = async (
  c,
) => {
  const user = c.get("user");
  const addresses = await db.query.address.findMany({
    where: eq(address.userId, user.id),
    orderBy: (address, { desc }) => [
      desc(address.isDefault),
      desc(address.createdAt),
    ],
  });

  return c.json(addresses.map(serializeAddress), 200);
};

export const getAddress: RouteHandler<typeof getAddressRoute> = async (c) => {
  const user = c.get("user");
  const { id } = c.req.valid("param");
  const result = await db
    .select()
    .from(address)
    .where(and(eq(address.id, id), eq(address.userId, user.id)))
    .limit(1);
  const savedAddress = result[0];

  if (!savedAddress) {
    return c.json({ message: "Address not found" }, 404);
  }

  return c.json(serializeAddress(savedAddress), 200);
};

export const createAddress: RouteHandler<typeof createAddressRoute> = async (
  c,
) => {
  const user = c.get("user");
  const body = c.req.valid("json");
  const savedAddress = await db.transaction(async (tx) => {
    if (body.isDefault) {
      await tx
        .update(address)
        .set({ isDefault: false })
        .where(eq(address.userId, user.id));
    }

    const [created] = await tx
      .insert(address)
      .values({
        ...body,
        id: randomUUID(),
        userId: user.id,
        line2: body.line2 ?? null,
      })
      .returning();

    return created;
  });

  return c.json(serializeAddress(savedAddress), 201);
};

export const updateAddress: RouteHandler<typeof updateAddressRoute> = async (
  c,
) => {
  const user = c.get("user");
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  const existing = await db
    .select({ id: address.id })
    .from(address)
    .where(and(eq(address.id, id), eq(address.userId, user.id)))
    .limit(1);

  if (!existing[0]) {
    return c.json({ message: "Address not found" }, 404);
  }

  const savedAddress = await db.transaction(async (tx) => {
    if (body.isDefault) {
      await tx
        .update(address)
        .set({ isDefault: false })
        .where(eq(address.userId, user.id));
    }

    const [updated] = await tx
      .update(address)
      .set(body)
      .where(and(eq(address.id, id), eq(address.userId, user.id)))
      .returning();

    return updated;
  });

  return c.json(serializeAddress(savedAddress), 200);
};

export const deleteAddress: RouteHandler<typeof deleteAddressRoute> = async (
  c,
) => {
  const user = c.get("user");
  const { id } = c.req.valid("param");
  const [deleted] = await db
    .delete(address)
    .where(and(eq(address.id, id), eq(address.userId, user.id)))
    .returning({ id: address.id });

  if (!deleted) {
    return c.json({ message: "Address not found" }, 404);
  }

  return c.json({ message: "Address deleted" }, 200);
};
