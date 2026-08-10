ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "cart_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "checkout_key" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "stripe_checkout_session_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "stripe_payment_intent_id" text;--> statement-breakpoint

-- Existing orders predate checkout idempotency. Give each one a stable, unique key
-- before enforcing the new non-null invariant.
UPDATE "orders"
SET "checkout_key" = md5("id" || ':' || clock_timestamp()::text || ':' || random()::text)
WHERE "checkout_key" IS NULL;--> statement-breakpoint

ALTER TABLE "orders" ALTER COLUMN "checkout_key" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "orders_checkout_key_idx" ON "orders" USING btree ("checkout_key");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "orders_stripe_checkout_session_idx" ON "orders" USING btree ("stripe_checkout_session_id");
