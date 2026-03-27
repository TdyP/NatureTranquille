### Story 2.2: Zoom automatique carte sur résultat sélectionné


**User Story**
En tant que **Tom**, après avoir sélectionné "Strasbourg" dans la recherche, je veux que la carte zoome automatiquement sur cette zone avec animation fluide, afin de voir immédiatement les zones sans chasse alentours.

**Acceptance Criteria**

**GIVEN** : L'utilisateur a sélectionné une suggestion de recherche (Story 2.1)
**WHEN** : L'événement `onSelectLocation(feature)` est déclenché
**THEN** :

- La carte MapLibre zoom sur la bbox (bounding box) retournée par l'API :
    ```javascript
    const bbox = feature.bbox; // [minLng, minLat, maxLng, maxLat]
    map.fitBounds(bbox, {
        padding: {top: 50, bottom: 50, left: 50, right: 50},
        maxZoom: 12,
        duration: 1000, // animation 1s
    });
    ```
- Pendant l'animation (1s), l'utilisateur peut voir la transition smooth
- Après zoom, les zones sans chasse dans la bbox sont affichées (si présentes)
- Un marqueur temporaire peut être affiché au centre de la bbox (optionnel) :
    ```javascript
    new maplibregl.Marker({color: '#3b82f6'}) // Tailwind blue-500
        .setLngLat([feature.geometry.coordinates[0], feature.geometry.coordinates[1]])
        .addTo(map);
    ```

**AND** : Si l'API retourne un point (pas de bbox) :

- Zoom sur le point avec niveau zoom 12 :
    ```javascript
    map.flyTo({
        center: feature.geometry.coordinates,
        zoom: 12,
        duration: 1000,
    });
    ```

**AND** : Annonce accessibilité après zoom :

- ARIA live region annonce : "Carte zoomée sur Strasbourg, Bas-Rhin"
- Focus peut retourner sur carte (ou rester sur input selon UX)

**Accessibility Integration**

- ARIA live region avec `aria-live="polite"` annonce le zoom
- Animation respecte `prefers-reduced-motion` :
    ```javascript
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    map.fitBounds(bbox, {
        padding: 50,
        maxZoom: 12,
        duration: prefersReducedMotion ? 0 : 1000,
    });
    ```
- Marqueur temporaire (si ajouté) avec `aria-label="Position recherchée"`

**Performance & Technical Acceptance**

- Animation zoom fluide ≥ 30 FPS mobile, ≥ 60 FPS desktop
- Pas de freeze interface pendant animation
- Tuiles nouvelles zones chargées pendant animation (seamless)

---

