### Story 0.2: Import des données RNCFS + Réserves locales Savoie dans PostGIS


**User Story**
En tant que **développeur**, je veux importer les données géographiques RNCFS + réserves Savoie dans PostgreSQL/PostGIS via un script automatisé, afin de disposer du dataset de zones sans chasse pour le développement.

**Acceptance Criteria**

**GIVEN** : PostgreSQL + PostGIS container est démarré et accessible
**AND** : Les fichiers de données (Shapefile/GeoJSON/GeoPackage) RNCFS + Savoie sont placés dans `/data/raw/`
**WHEN** : Le développeur exécute `./scripts/import-data.sh`
**THEN** :

- Les données RNCFS sont importées dans la table `zones_sans_chasse` (schéma `public`)
- Les données Savoie sont importées et fusionnées dans la même table
- Les colonnes créées : `id`, `nom`, `type_protection`, `gestionnaire`, `source`, `date_maj`, `geometry` (type MULTIPOLYGON, SRID 4326)
- Un index spatial est créé sur la colonne `geometry` : `CREATE INDEX idx_zones_geom ON zones_sans_chasse USING GIST(geometry)`
- Un index sur `type_protection` pour filtrage performant
- Script valide les géométries avec `ST_IsValid()` et corrige avec `ST_MakeValid()` si nécessaire
- Log final affiche : "✅ X zones RNCFS importées, Y zones Savoie importées, total Z zones"

**AND** : Les données sont normalisées (projection WGS84, géométries valides)
**AND** : Script gère les erreurs gracieusement (fichier absent, géométrie invalide)

**Accessibility Integration**
N/A (data pipeline)

**Performance & Technical Acceptance**

- Import complet < 60s pour ~50-100 zones (dataset pilote)
- Requête test `SELECT COUNT(*) FROM zones_sans_chasse WHERE ST_Intersects(geometry, ST_MakeEnvelope(...))` < 50ms
- Utilisation GDAL/OGR (`ogr2ogr`) pour transformation formats

---

