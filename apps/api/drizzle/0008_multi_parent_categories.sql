CREATE TABLE IF NOT EXISTS "category_parents" (
	"category_id" integer NOT NULL,
	"parent_id" integer NOT NULL,
	CONSTRAINT "category_parents_category_id_parent_id_pk" PRIMARY KEY("category_id", "parent_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category_parents" ADD CONSTRAINT "category_parents_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "category_parents" ADD CONSTRAINT "category_parents_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
INSERT INTO "category_parents" ("category_id", "parent_id")
SELECT "id", "parent_id" FROM "categories" WHERE "parent_id" IS NOT NULL
ON CONFLICT DO NOTHING;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "category_parents_parent_id_idx" ON "category_parents" USING btree ("parent_id");
--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN IF EXISTS "parent_id";
