ALTER TABLE zones
  ADD COLUMN IF NOT EXISTS code_departement varchar(3),
  ADD COLUMN IF NOT EXISTS nom_departement text;

UPDATE zones SET code_departement = '04', nom_departement = 'Alpes-de-Haute-Provence'
  WHERE source LIKE '%_S_004';

UPDATE zones SET code_departement = '15', nom_departement = 'Cantal'
  WHERE source LIKE '%_S_015';

UPDATE zones SET code_departement = '68', nom_departement = 'Haut-Rhin'
  WHERE source LIKE '%_S_068';

UPDATE zones SET code_departement = '73', nom_departement = 'Savoie'
  WHERE source LIKE '%_S_073';

UPDATE zones SET code_departement = '74', nom_departement = 'Haute-Savoie'
  WHERE source LIKE '%_S_074';

CREATE INDEX IF NOT EXISTS idx_zones_code_departement ON zones (code_departement);
