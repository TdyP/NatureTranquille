### Story 6.4: Deep linking départements avec carte auto-zoomée


**User Story**
En tant que **Tom cliquant sur un lien Google `/departements/bas-rhin-67`**, je veux arriver directement sur une carte centrée sur le Bas-Rhin avec les zones affichées, sans manipulation supplémentaire.

**Acceptance Criteria**

**GIVEN** : L'utilisateur accède à `/departements/bas-rhin-67` via lien externe
**WHEN** : La page charge
**THEN** :

- Carte MapLibre initialisée avec bounds département Bas-Rhin :

    ```typescript
    // Composant Map.tsx
    interface MapProps {
      initialCenter?: [number, number];
      initialZoom?: number;
      initialBounds?: [[number, number], [number, number]];
      highlightDepartement?: string;
    }

    export function Map({ initialBounds, highlightDepartement }: MapProps) {
      useEffect(() => {
        const map = new maplibregl.Map({
          container: 'map',
          style: OSM_STYLE_URL
        });

        map.on('load', () => {
          // Charger couche zones
          map.addSource('zones', { ... });
          map.addLayer({ ... });

          // Zoom sur bounds département
          if (initialBounds) {
            map.fitBounds(initialBounds, { padding: 50, duration: 0 });
          }

          // Highlight département optionnel (filter ou outline)
          if (highlightDepartement) {
            map.setFilter('zones-fill', ['==', ['get', 'code_departement'], highlightDepartement]);
          }
        });
      }, []);
    }
    ```

**AND** : Calcul bounds département côté serveur (Story 6.1) passé via props :

```tsx
// app/departements/[slug]/page.tsx
export default async function DepartementPage({params}) {
    const dept = await getDepartementBySlug(params.slug);
    const bounds = await getDepartementBounds(dept.code); // [[minLng, minLat], [maxLng, maxLat]]

    return <Map initialBounds={bounds} highlightDepartement={dept.code} />;
}
```

**AND** : État URL conservé (optionnel Phase 2) :

- URL avec query params : `/departements/bas-rhin-67?zone=12`
- Zoom initial sur zone spécifique si `?zone=ID`
- Partage URL direct état carte (utile pour signalements)

**Accessibility Integration**

- Page titre unique : "Zones sans chasse dans le Bas-Rhin"
- Annonce lecteur écran : "Carte centrée sur le Bas-Rhin, X zones affichées"
- Navigation breadcrumb fonctionnelle (retour liste départements)

**Performance & Technical Acceptance**

- Carte charge avec bounds pré-calculés (pas de fitBounds animation inutile)
- LCP < 2.5s (carte départment visible rapidement)
- Tuiles zoom département < 100KB total
- Deep link fonctionnel avec JavaScript désactivé (SSR carte statique screenshot Phase 2)

**Technical Notes**

- Bounds département cachés côté serveur (Redis/mémoire) pour éviter recalcul PostGIS chaque requête
- Phase 2 : génération image statique carte département (fallback JS disabled)

---

---

