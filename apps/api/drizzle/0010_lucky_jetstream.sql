CREATE TABLE IF NOT EXISTS "recently_viewed_products" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"guest_token_hash" text,
	"product_id" integer NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conname = 'recently_viewed_products_exactly_one_owner_check'
			AND conrelid = 'public.recently_viewed_products'::regclass
	) THEN
		ALTER TABLE "recently_viewed_products"
			ADD CONSTRAINT "recently_viewed_products_exactly_one_owner_check"
			CHECK (("user_id" IS NOT NULL) <> ("guest_token_hash" IS NOT NULL));
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conname = 'recently_viewed_products_user_id_user_id_fk'
			AND conrelid = 'public.recently_viewed_products'::regclass
	) THEN
		ALTER TABLE "recently_viewed_products"
			ADD CONSTRAINT "recently_viewed_products_user_id_user_id_fk"
			FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conname = 'recently_viewed_products_product_id_products_id_fk'
			AND conrelid = 'public.recently_viewed_products'::regclass
	) THEN
		ALTER TABLE "recently_viewed_products"
			ADD CONSTRAINT "recently_viewed_products_product_id_products_id_fk"
			FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "recently_viewed_products_user_product_idx" ON "recently_viewed_products" USING btree ("user_id", "product_id") WHERE "recently_viewed_products"."user_id" IS NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "recently_viewed_products_guest_product_idx" ON "recently_viewed_products" USING btree ("guest_token_hash", "product_id") WHERE "recently_viewed_products"."guest_token_hash" IS NOT NULL;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recently_viewed_products_user_viewed_at_idx" ON "recently_viewed_products" USING btree ("user_id", "viewed_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recently_viewed_products_guest_viewed_at_idx" ON "recently_viewed_products" USING btree ("guest_token_hash", "viewed_at");
