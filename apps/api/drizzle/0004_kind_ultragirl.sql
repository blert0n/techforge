ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "attribute_prefix" text;
--> statement-breakpoint
UPDATE "categories"
SET "attribute_prefix" = CASE "slug"
  WHEN 'graphics-cards' THEN 'gpu'
  WHEN 'processors' THEN 'cpu'
  WHEN 'solid-state-drives' THEN 'storage'
  WHEN 'memory' THEN 'memory'
  WHEN 'monitors' THEN 'monitor'
  WHEN 'keyboards' THEN 'keyboard'
  WHEN 'mouse' THEN 'mouse'
  ELSE regexp_replace("slug", '[^a-z0-9]+', '_', 'g')
END
WHERE "attribute_prefix" IS NULL;
--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "attribute_prefix" SET NOT NULL;
