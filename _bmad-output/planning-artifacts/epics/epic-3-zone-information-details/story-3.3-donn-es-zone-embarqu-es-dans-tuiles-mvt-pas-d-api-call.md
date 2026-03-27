### Story 3.3: Données zone embarquées dans tuiles MVT (pas d'API call)


**User Story**
En tant que **développeur**, je veux inclure toutes les métadonnées nécessaires dans les tuiles MVT, afin d'afficher les détails zone sans appel API supplémentaire et garantir performance optimale.

**Acceptance Criteria**

**GIVEN** : Le pipeline tuiles MVT est configuré (Story 0.3)
**WHEN** : Une tuile est générée par le backend
**THEN** :

- La requête SQL PostGIS inclut toutes colonnes nécessaires :

```sql
SELECT
  id,
  nom,
  type_protection,
  gestionnaire,
  date_maj,
  source,
  source_url,
  ST_AsMVTGeom(
    geometry,
    ST_TileEnvelope({z}, {x}, {y}),
    4096,
    256,
    true
  ) AS geom
FROM zones
WHERE ST_Intersects(
  geometry,
  ST_TileEnvelope({z}, {x}, {y})
)
```

- Les propriétés sont accessibles côté client :

```javascript
map.on('click', 'zones-fill', (event) => {
    const zone = event.features[0].properties;
    console.log(zone);
    // { id, nom, type_protection, gestionnaire, date_maj, source, source_url }
});
```

**AND** : Optimisation taille tuile :

- Colonnes texte limitées (noms courts préférés)
- `date_maj` formatée ISO 8601 string (pas timestamp)
- `source_url` nullable (non inclus si NULL dans BDD)
- Taille tuile finale < 50KB en moyenne

**AND** : Validation tuiles :

```bash
# Inspection tuile avec mbview
mbview tiles/10/523/357.mvt

# Vérification propriétés avec tippecanoe
tile-join --no-tile-size-limit -o test.mbtiles tiles/
```

**Accessibility Integration**

- N/A (infrastructure données)

**Performance & Technical Acceptance**

- Requête SQL tuile < 100ms (index spatial utilisé)
- Taille moyenne tuile zoom 10 : ~30KB
- Taille moyenne tuile zoom 14 : ~50KB (plus de détails géométrie)
- Pas de requête `/api/zones/{id}` nécessaire lors du clic

**Technical Notes**

- Validation que tous champs obligatoires sont non-NULL dans BDD
- Migration SQL Phase 2 : ajout colonnes `superficie_ha`, `perimetre_km` (optionnel)

---

---

