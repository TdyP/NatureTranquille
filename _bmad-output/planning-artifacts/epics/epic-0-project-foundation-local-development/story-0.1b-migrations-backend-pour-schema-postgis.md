### Story 0.1b: Migrations backend pour schema PostGIS

**User Story**
En tant que **developpeur backend**, je veux gerer la structure de base de donnees via des migrations versionnees, afin de garantir un schema coherent et reproductible sur tous les environnements.

**Acceptance Criteria**

**GIVEN** : Le backend est configure avec un outil de migration SQL (ou ORM)
**WHEN** : Le developpeur execute les migrations backend
**THEN** :

- La table `zones` est creee dans le schema `public`
- Les colonnes structurelles sont creees : `id`, `nom`, `type_protection`, `gestionnaire`, `source`, `date_maj`, `geometry` (type `MULTIPOLYGON`, SRID 4326)
- Les index necessaires sont crees par migration backend : index spatial GiST sur `geometry` et index sur `type_protection`
- Les migrations sont idempotentes, versionnees, et executables de facon deterministe en local et CI
- Aucun script d'import de donnees n'effectue de `CREATE/ALTER/DROP` sur la structure

**AND** : Les migrations sont stockees dans le backend et documentees
**AND** : Une commande unique permet d'appliquer les migrations sur une base vide

**Accessibility Integration**
N/A (infrastructure backend)

**Performance & Technical Acceptance**

- Application des migrations < 30s sur base vide
- Verification schema : `\d+ zones` confirme colonnes + index attendus
- Le workflow CI echoue si une migration est invalide

---

## Status

done

## Dev Agent Record

### Implementation Notes

- Drizzle ORM (`drizzle-orm` + `drizzle-kit`) added as dependency in `backend/package.json`.
- `drizzle.config.ts` at backend root configures the `postgresql` dialect, pointing to `src/db/schema.ts` and outputting migrations to `drizzle/`.
- `src/db/schema.ts`: defines `zones` table with `customType` for `geometry(MULTIPOLYGON,4326)`, a GiST index on `geometry`, and a B-tree index on `type_protection`. `id` is `GENERATED ALWAYS AS IDENTITY`.
- `src/db/client.ts`: initialises the shared `Pool` + `drizzle` instance (consumed by `index.ts`; removes the previously duplicated pool).
- `src/db/migrate.ts`: programmatic migration runner using `drizzle-orm/node-postgres/migrator` — single-command apply (`npm run db:migrate`).
- `drizzle/0000_magical_leper_queen.sql`: Drizzle-generated versioned SQL migration (table + two indexes). Idempotent on re-apply via Drizzle's journal tracking.
- Three npm scripts added: `db:generate`, `db:migrate`, `db:check`.
- `index.ts` updated to reuse the shared pool from `client.ts`.
- Unit tests in `src/db/schema.test.ts` cover all 6 assertions (table name, all columns present, PK identity, geometry notNull, timezone, geometry SQL type) — 6/6 pass.

## File List

- `AGENTS.MD`
- `backend/package.json`
- `backend/package-lock.json`
- `backend/drizzle.config.ts`
- `backend/src/db/schema.ts`
- `backend/src/db/client.ts`
- `backend/src/db/migrate.ts`
- `backend/src/db/schema.test.ts`
- `backend/src/index.ts`
- `backend/drizzle/0000_magical_leper_queen.sql`
- `backend/drizzle/meta/_journal.json`
- `backend/drizzle/meta/0000_snapshot.json`
- `.github/workflows/ci.yml`

## Change Log

- 2026-03-27: Implemented story 0.1b — Drizzle ORM migrations for PostGIS schema. Added `zones` table, GiST + B-tree indexes, shared DB client, programmatic migration runner, and unit tests.
- 2026-03-27: Code review fixes — `db:check` corrected to `drizzle-kit check`; DATABASE_URL guard added to `drizzle.config.ts`; `customType` `fromDriver`/`toDriver` added to schema; client.ts type annotation removed; identity assertion added to id test; `date_maj` test switched to `getSQLType()`; CI workflow created at `.github/workflows/ci.yml`.
