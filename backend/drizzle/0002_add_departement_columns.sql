ALTER TABLE zones
  ADD COLUMN IF NOT EXISTS code_departement varchar(3),
  ADD COLUMN IF NOT EXISTS nom_departement text;

CREATE INDEX IF NOT EXISTS idx_zones_code_departement ON zones (code_departement);
