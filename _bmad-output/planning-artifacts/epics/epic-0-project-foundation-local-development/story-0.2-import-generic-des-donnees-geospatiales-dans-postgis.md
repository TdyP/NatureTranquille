### Story 0.2: Import generique des donnees geospatiales dans PostGIS

**User Story**
En tant que **developpeur**, je veux importer les donnees geospatiales demandees dans PostgreSQL/PostGIS via un script automatise, afin d'alimenter le dataset de zones sans modifier la structure de base.

**Acceptance Criteria**

**GIVEN** : PostgreSQL + PostGIS est demarre et accessible
**AND** : Les migrations backend sont appliquees (Story 0.1b complete)
**AND** : Les fichiers de donnees (Shapefile/GeoJSON/GeoPackage) a ingerer sont places dans `/data/raw/`
**WHEN** : Le developpeur execute le script d'import avec les parametres cibles
**THEN** :

- Le script ingere toutes les donnees explicitement demandees par configuration/arguments
- Le script n'utilise aucun hardcode de territoire ou de source metier
- Les donnees sont ecrites dans la table `zones` (schema `public`)
- Le script n'execute aucune operation DDL (`CREATE TABLE`, `ALTER TABLE`, `DROP`, `CREATE INDEX`)
- Le script valide les geometries avec `ST_IsValid()` et corrige avec `ST_MakeValid()` si necessaire
- Le log final affiche le detail des imports executes et le total des zones ecrites

**AND** : Les donnees sont normalisees (projection WGS84, geometries valides)
**AND** : Script gere les erreurs gracieusement (fichier absent, geometrie invalide)

**Accessibility Integration**
N/A (data pipeline)

**Performance & Technical Acceptance**

- Import complet < 60s pour ~50-100 zones (dataset pilote)
- Requete test `SELECT COUNT(*) FROM zones WHERE ST_Intersects(geometry, ST_MakeEnvelope(...))` < 50ms
- Utilisation GDAL/OGR (`ogr2ogr`) pour transformation formats

---

---
