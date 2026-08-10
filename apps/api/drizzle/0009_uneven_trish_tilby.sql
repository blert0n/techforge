CREATE TABLE IF NOT EXISTS "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"order_number" text NOT NULL,
	"user_id" text NOT NULL,
	"shipping_address_id" text,
	"shipping_address" jsonb NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"payment_status" text DEFAULT 'pending' NOT NULL,
	"payment_method" text NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"subtotal" numeric(12, 2) NOT NULL,
	"shipping_total" numeric(12, 2) DEFAULT '0' NOT NULL,
	"tax_total" numeric(12, 2) DEFAULT '0' NOT NULL,
	"discount_total" numeric(12, 2) DEFAULT '0' NOT NULL,
	"total" numeric(12, 2) NOT NULL,
	"placed_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_items" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"product_id" integer,
	"product_name" text NOT NULL,
	"product_slug" text NOT NULL,
	"sku" text NOT NULL,
	"image_url" text,
	"unit_price" numeric(12, 2) NOT NULL,
	"quantity" integer NOT NULL,
	"line_total" numeric(12, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_totals_nonnegative') THEN
		ALTER TABLE "orders" ADD CONSTRAINT "orders_totals_nonnegative" CHECK ("subtotal" >= 0 AND "shipping_total" >= 0 AND "tax_total" >= 0 AND "discount_total" >= 0 AND "total" >= 0);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'order_items_quantity_check') THEN
		ALTER TABLE "order_items" ADD CONSTRAINT "order_items_quantity_check" CHECK ("quantity" > 0);
	END IF;
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'order_items_prices_nonnegative') THEN
		ALTER TABLE "order_items" ADD CONSTRAINT "order_items_prices_nonnegative" CHECK ("unit_price" >= 0 AND "line_total" >= 0);
	END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_user_id_user_id_fk') THEN
		ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE restrict;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'orders_shipping_address_id_address_id_fk') THEN
		ALTER TABLE "orders" ADD CONSTRAINT "orders_shipping_address_id_address_id_fk" FOREIGN KEY ("shipping_address_id") REFERENCES "public"."address"("id") ON DELETE set null;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'order_items_order_id_orders_id_fk') THEN
		ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade;
	END IF;
	IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'order_items_product_id_products_id_fk') THEN
		ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null;
	END IF;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "orders_order_number_idx" ON "orders" USING btree ("order_number");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_user_placed_at_idx" ON "orders" USING btree ("user_id", "placed_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "orders_status_idx" ON "orders" USING btree ("status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_items_order_id_idx" ON "order_items" USING btree ("order_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_items_product_id_idx" ON "order_items" USING btree ("product_id");
