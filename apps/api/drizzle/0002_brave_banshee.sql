CREATE TABLE IF NOT EXISTS "address" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" text NOT NULL,
    "type" text NOT NULL,
    "first_name" text NOT NULL,
    "last_name" text NOT NULL,
    "phone" text NOT NULL,
    "line_1" text NOT NULL,
    "line_2" text,
    "city" text NOT NULL,
    "state" text NOT NULL,
    "postal_code" text NOT NULL,
    "country" text NOT NULL,
    "is_default" boolean DEFAULT false NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint


ALTER TABLE "address"
DROP CONSTRAINT IF EXISTS "address_user_id_user_id_fk";
--> statement-breakpoint

ALTER TABLE "address"
ADD CONSTRAINT "address_user_id_user_id_fk"
FOREIGN KEY ("user_id")
REFERENCES "public"."user"("id")
ON DELETE CASCADE
ON UPDATE NO ACTION;


CREATE INDEX IF NOT EXISTS "address_user_id_idx"
ON "address" USING btree ("user_id");
--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "address_one_default_per_user_idx"
ON "address" USING btree ("user_id")
WHERE "is_default" = true;