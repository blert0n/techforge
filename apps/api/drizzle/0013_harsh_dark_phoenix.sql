CREATE TABLE IF NOT EXISTS "wishlist_items" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"product_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'wishlist_items_user_id_user_id_fk'
      AND conrelid = 'public.wishlist_items'::regclass
  ) THEN
    ALTER TABLE "wishlist_items"
      ADD CONSTRAINT "wishlist_items_user_id_user_id_fk"
      FOREIGN KEY ("user_id") REFERENCES "public"."user"("id")
      ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'wishlist_items_product_id_products_id_fk'
      AND conrelid = 'public.wishlist_items'::regclass
  ) THEN
    ALTER TABLE "wishlist_items"
      ADD CONSTRAINT "wishlist_items_product_id_products_id_fk"
      FOREIGN KEY ("product_id") REFERENCES "public"."products"("id")
      ON DELETE cascade ON UPDATE no action;
  END IF;
END $$;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "wishlist_items_user_product_idx" ON "wishlist_items" USING btree ("user_id","product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "wishlist_items_product_id_idx" ON "wishlist_items" USING btree ("product_id");
