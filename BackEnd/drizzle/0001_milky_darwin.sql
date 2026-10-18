CREATE TABLE "auth_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(30) NOT NULL,
	"token_hash" varchar(64) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "auth_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "nomor_induk" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "tanggal_lahir" date;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "kelas" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_changed_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "token_version" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "auth_tokens" ADD CONSTRAINT "auth_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "auth_token_user_type_idx" ON "auth_tokens" USING btree ("user_id","type");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_nomor_induk_unique" UNIQUE("nomor_induk");

-- Backfill: user lama tidak boleh dipaksa mengganti password setelah migrasi.
UPDATE "users" SET "password_changed_at" = "created_at" WHERE "password_changed_at" IS NULL;
