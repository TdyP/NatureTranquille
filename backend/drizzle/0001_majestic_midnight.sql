ALTER TABLE "zones" ADD COLUMN "code_departement" varchar(3);--> statement-breakpoint
ALTER TABLE "zones" ADD COLUMN "nom_departement" text;--> statement-breakpoint
CREATE INDEX "idx_zones_code_departement" ON "zones" USING btree ("code_departement");