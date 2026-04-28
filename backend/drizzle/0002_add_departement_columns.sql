ALTER TABLE zones
  ADD COLUMN IF NOT EXISTS code_departement varchar(3),
  ADD COLUMN IF NOT EXISTS nom_departement text;

UPDATE zones SET code_departement = '67', nom_departement = 'Bas-Rhin'
  WHERE source = 'bas_rhin';

UPDATE zones SET code_departement = '68', nom_departement = 'Haut-Rhin'
  WHERE source = 'haut_rhin';

UPDATE zones SET code_departement = '74', nom_departement = 'Haute-Savoie'
  WHERE source = 'haute_savoie';

UPDATE zones SET code_departement = '73', nom_departement = 'Savoie'
  WHERE source = 'reserves_savoie';

UPDATE zones SET code_departement = '04', nom_departement = 'Alpes-de-Haute-Provence'
  WHERE source = 'alpes_haute_provence';

UPDATE zones SET code_departement = '15', nom_departement = 'Cantal'
  WHERE source = 'cantal';

UPDATE zones SET code_departement = '18', nom_departement = 'Cher'
  WHERE source = 'cher';

CREATE INDEX IF NOT EXISTS idx_zones_code_departement ON zones (code_departement);
