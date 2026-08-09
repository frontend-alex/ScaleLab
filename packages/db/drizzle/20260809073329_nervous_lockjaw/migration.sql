ALTER TABLE "users" ADD COLUMN "password_hash" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "name";