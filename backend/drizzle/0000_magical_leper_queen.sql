CREATE TABLE "zones" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "zones_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"nom" text,
	"type_protection" text,
	"gestionnaire" text,
	"source" text,
	"date_maj" timestamp with time zone,
	"geometry" geometry(MULTIPOLYGON,4326) NOT NULL
);
--> statement-breakpoint
CREATE INDEX "zones_geometry_gist_idx" ON "zones" USING gist ("geometry");--> statement-breakpoint
CREATE INDEX "zones_type_protection_idx" ON "zones" USING btree ("type_protection");