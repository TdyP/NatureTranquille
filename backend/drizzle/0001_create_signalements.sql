CREATE TABLE "signalements" (
	"id" serial PRIMARY KEY,
	"type" varchar(50) NOT NULL,
	"localisation" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"email" varchar(255),
	"ip_hash" varchar(64) NOT NULL,
	"status" varchar(20) DEFAULT 'nouveau',
	"notes_internes" text,
	"zone_id" integer,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "signalements_type_check" CHECK (type IN ('erreur', 'suggestion', 'nouvelle-donnee', 'autre')),
	CONSTRAINT "signalements_status_check" CHECK (status IN ('nouveau', 'en-cours', 'resolu', 'rejete'))
);
--> statement-breakpoint
CREATE INDEX "idx_signalements_status" ON "signalements" USING btree ("status");
--> statement-breakpoint
CREATE INDEX "idx_signalements_created_at" ON "signalements" USING btree ("created_at" DESC);
--> statement-breakpoint
CREATE INDEX "idx_signalements_ip_hash" ON "signalements" USING btree ("ip_hash", "created_at");
