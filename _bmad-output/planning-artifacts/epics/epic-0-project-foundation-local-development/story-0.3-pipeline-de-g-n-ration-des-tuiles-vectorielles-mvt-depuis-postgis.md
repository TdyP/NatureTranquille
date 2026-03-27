### Story 0.3: Pipeline de génération des tuiles vectorielles MVT depuis PostGIS


**User Story**
En tant que **développeur**, je veux générer et servir dynamiquement des tuiles vectorielles MVT depuis PostgreSQL/PostGIS, afin que le frontend MapLibre puisse afficher les zones sans chasse de manière performante à tous les niveaux de zoom.

**Acceptance Criteria**

**GIVEN** : Les donnees zones sont importees dans PostGIS (Story 0.2 complete)
**WHEN** : Le backend reçoit une requête tuile MVT `GET /tiles/{z}/{x}/{y}.mvt`
**THEN** :

- Le backend exécute une requête SQL utilisant `ST_AsMVT()` avec `ST_TileEnvelope()` pour générer la tuile
- Les géométries sont simplifiées selon le niveau de zoom :
    - Zoom 0-6 : `ST_Simplify(geometry, 0.01)` (vue France entière)
    - Zoom 7-10 : `ST_Simplify(geometry, 0.001)` (vue régionale)
    - Zoom 11+ : Pas de simplification (vue détaillée)
- Les propriétés suivantes sont incluses dans la tuile : `id`, `nom`, `type_protection`, `gestionnaire`, `date_maj`, `source`
- Réponse HTTP avec headers : `Content-Type: application/vnd.mapbox-vector-tile`, `Cache-Control: public, max-age=86400`
- Tuile vide retourne 204 No Content (pas d'erreur)

**AND** : Cache tuiles côté serveur (Redis ou mémoire) pour éviter recalculs
**AND** : Logs affichent temps génération tuile (objectif < 100ms)

**Accessibility Integration**
N/A (API tuiles)

**Performance & Technical Acceptance**

- Génération tuile < 100ms (99th percentile)
- Taille tuile moyenne < 50KB (après compression gzip)
- Query optimization : index spatial utilisé (`EXPLAIN ANALYZE` confirme)
- Cache hit rate ≥ 80% après quelques minutes utilisation

**Technical Notes**

- Utilisation `pg_tileserv`, `t-rex`, ou endpoint Express custom avec SQL `ST_AsMVT()`
- Validation tuiles avec `mbview` ou `mapbox-gl-inspect`

---

