CREATE TABLE IF NOT EXISTS "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"rating" integer NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"helpful_upvotes" integer DEFAULT 0 NOT NULL,
	"helpful_downvotes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conname = 'reviews_rating_range_check'
			AND conrelid = 'public.reviews'::regclass
	) THEN
		ALTER TABLE "reviews"
			ADD CONSTRAINT "reviews_rating_range_check"
			CHECK ("rating" BETWEEN 1 AND 5);
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conname = 'reviews_helpful_vote_counts_nonnegative'
			AND conrelid = 'public.reviews'::regclass
	) THEN
		ALTER TABLE "reviews"
			ADD CONSTRAINT "reviews_helpful_vote_counts_nonnegative"
			CHECK ("helpful_upvotes" >= 0 AND "helpful_downvotes" >= 0);
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conname = 'reviews_product_id_products_id_fk'
			AND conrelid = 'public.reviews'::regclass
	) THEN
		ALTER TABLE "reviews"
			ADD CONSTRAINT "reviews_product_id_products_id_fk"
			FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
	END IF;

	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint
		WHERE conname = 'reviews_user_id_user_id_fk'
			AND conrelid = 'public.reviews'::regclass
	) THEN
		ALTER TABLE "reviews"
			ADD CONSTRAINT "reviews_user_id_user_id_fk"
			FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "reviews_user_product_idx" ON "reviews" USING btree ("user_id", "product_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "reviews_product_created_at_idx" ON "reviews" USING btree ("product_id", "created_at");
