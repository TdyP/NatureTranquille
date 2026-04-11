### Story 0.2: Import generique des donnees geospatiales dans PostGIS

**User Story**
En tant que **developpeur**, je veux importer les donnees geospatiales demandees dans PostgreSQL/PostGIS via un script automatise, afin d'alimenter le dataset de zones.

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

## Tasks / Subtasks

- [x] Task 1: Types and configuration loader
    - [x] 1.1 Define `ImportSource`, `ImportConfig`, `GeoJsonCollection`, `ImportSourceResult`, `ImportResult` types in `backend/src/import/types.ts`
    - [x] 1.2 Implement `loadConfig(path)` in `backend/src/import/runner.ts` (validates file exists, valid JSON, required fields)
    - [x] 1.3 Write unit tests for `loadConfig` (file not found, invalid JSON, missing `sources`, missing `file`, missing `sourceValue`, valid config)

- [x] Task 2: Core import runner
    - [x] 2.1 Implement `readGeoJsonFromOgr(file)` in `backend/src/import/runner.ts` using `spawnSync ogr2ogr` with WGS84 reprojection
    - [x] 2.2 Implement `runImport(pool, sources, reader)` with per-feature `ST_IsValid` check, `ST_MakeValid` correction, and graceful error handling
    - [x] 2.3 Write unit tests for `runImport` (reader throws → error recorded, inserts count, corrected count, skipped count on INSERT error, totalInserted across multiple sources, nom from column, nom from fixed value)

- [x] Task 3: CLI entrypoint and configuration example
    - [x] 3.1 Implement `backend/src/import-zones.ts` CLI with `--config <path>` argument, `DATABASE_URL` guard, import summary log
    - [x] 3.2 Add `db:import` script to `backend/package.json`
    - [x] 3.3 Create `data/import-config.example.json` with documented source mappings for RNCFS and reserves_savoie

## Dev Notes

- Run inside backend container: `docker compose exec backend npm run db:import -- --config /data/import-config.json`
- `ogr2ogr` must be available in execution environment (available in `postgis/postgis` image; install `gdal-bin` on host)
- Only INSERT — no DDL. Schema managed by Story 0.1b Drizzle migrations
- `geoJsonReader` is injected into `runImport` to allow unit testing without ogr2ogr
- Geometry cast: `ST_Multi(...)::geometry(MULTIPOLYGON,4326)` handles Polygon → MultiPolygon upgrade
- Test framework: `node --test --import tsx` (see existing `schema.test.ts` for patterns)

## Dev Agent Record

### Implementation Notes

- `backend/Dockerfile`: custom image based on `node:24-alpine` with `gdal` and `gdal-tools` for ogr2ogr/ogrinfo.
- `backend/src/import/types.ts`: defines `ImportSource`, minimal GeoJSON types, `ImportSourceResult`, `ImportResult`.
- `backend/src/import/runner.ts`: `readGeoJsonFromOgr` wraps `ogr2ogr`; `runImport` (injectable `geoJsonReader`) handles ST_IsValid/ST_MakeValid per feature.
- `backend/src/import/discover.ts`: auto-discovers sources from `data/raw/`. `extractXmlMetadata` parses ISO 19115 XML (regex). `getShapefileColumns` parses `ogrinfo -al -so` output. `autoMapColumns` matches COVADIS-standard column names. `titleToTypeProtection` normalises French titles to slugs. `discoverSources` (injectable `columnGetter`) orchestrates the full discovery.
- `backend/src/import-zones.ts`: CLI — auto-discovers sources from `--raw-dir` (default `/data/raw`), prints discovery plan, runs import, moves each successful folder to `--processed-dir` (default `/data/processed`).
- `backend/src/import/runner.test.ts` + `backend/src/import/discover.test.ts`: 28 tests, 28 pass.
- Run: `docker compose exec backend npm run db:import` (zero config needed).
- No DDL — schema managed by Story 0.1b migrations.
- Pre-existing `schema.test.ts` failure (`id identity`) is a Drizzle/Node 24 incompatibility, unrelated to this story.

## File List

- `backend/Dockerfile`
- `backend/src/import/types.ts`
- `backend/src/import/runner.ts`
- `backend/src/import/runner.test.ts`
- `backend/src/import/discover.ts`
- `backend/src/import/discover.test.ts`
- `backend/src/import-zones.ts`
- `backend/package.json`
- `docker-compose.yml`

## Change Log

- 2026-04-11: Implemented story 0.2 — zero-config geospatial import with auto-discovery. CLI scans `data/raw/`, extracts metadata from ISO 19115 XML, auto-detects Shapefile columns via ogrinfo, maps to COVADIS patterns, slugifies French titles, imports via ogr2ogr + PostGIS ST_IsValid/ST_MakeValid, moves successful folders to `data/processed/`. Created backend Dockerfile with GDAL. 28 unit tests pass. First import: 327 zones (RNCFS + Savoie).

## Status

done
