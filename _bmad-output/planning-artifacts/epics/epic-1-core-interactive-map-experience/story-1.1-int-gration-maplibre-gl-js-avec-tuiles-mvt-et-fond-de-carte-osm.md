### Story 1.1: Intégration MapLibre GL JS avec tuiles MVT et fond de carte OSM


**User Story**
En tant que **utilisateur arrivant sur le site**, je veux voir immédiatement une carte interactive avec un fond OSM et les zones sans chasse chargées depuis les tuiles MVT, afin de commencer mon exploration sans friction.

**Acceptance Criteria**

**GIVEN** : Le développeur a complété Story 0.3 (tuiles MVT disponibles sur `/tiles/{z}/{x}/{y}.mvt`)
**WHEN** : L'utilisateur accède à `http://localhost:3000`
**THEN** :

- La carte MapLibre GL JS s'initialise avec centre France (lat: 46.2276, lng: 2.2137, zoom: 6)
- Le fond de carte OSM est chargé depuis un style MapLibre compatible (ex: `https://demotiles.maplibre.org/style.json` ou style custom)
- Une couche vectorielle affiche les zones sans chasse depuis `http://localhost:4000/tiles/{z}/{x}/{y}.mvt`
- Les contrôles standards sont actifs : zoom (+/-), rotation (N), géolocalisation (bouton GPS)
- La carte est responsive et occupe 100vh sur mobile, avec sidebar desktop (Story 1.3)

**AND** : Initialisation carte :

```javascript
const map = new maplibregl.Map({
    container: 'map',
    style: OSM_STYLE_URL,
    center: [2.2137, 46.2276],
    zoom: 6,
    attributionControl: true,
});

map.on('load', () => {
    map.addSource('zones-sans-chasse', {
        type: 'vector',
        tiles: ['http://localhost:4000/tiles/{z}/{x}/{y}.mvt'],
        maxzoom: 14,
    });

    map.addLayer({
        id: 'zones-fill',
        type: 'fill',
        source: 'zones-sans-chasse',
        'source-layer': 'zones',
        paint: {
            'fill-color': '#10b981', // Tailwind green-500
            'fill-opacity': 0.6,
        },
    });
});
```

**Accessibility Integration**

- Container carte avec `role="application"` et `aria-label="Carte interactive des zones sans chasse en France"`
- Skip link "Aller à la carte" en début de page (focus direct sur map container)
- Navigation clavier :
    - Flèches directionnelles : pan (déplacement carte)
    - `+` / `-` : zoom in/out
    - `Shift` + flèches : rotation
    - `Tab` : focus entre contrôles (zoom, géolocation)
- Focus visible sur boutons contrôles (outline 2px, contraste ≥ 3:1)

**Performance & Technical Acceptance**

- Chargement carte initial < 2s (75th percentile 3G)
- Tuiles MVT niveau zoom 6 (France) < 100KB total
- Frame rate ≥ 30 FPS sur mobile lors du pan/zoom
- Composant React carte dans `/app/components/Map.tsx` (client component avec `'use client'`)

---

