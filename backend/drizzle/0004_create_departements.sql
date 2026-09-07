CREATE TABLE "departements" (
	"code" varchar(3) PRIMARY KEY,
	"nom" text NOT NULL
);--> statement-breakpoint

INSERT INTO "departements" ("code", "nom") VALUES
	('04', 'Alpes-de-Haute-Provence'),
	('15', 'Cantal'),
	('68', 'Haut-Rhin'),
	('73', 'Savoie'),
	('74', 'Haute-Savoie')
ON CONFLICT ("code") DO NOTHING;
