### Story 1.2: Affichage visuel des zones sans chasse avec style WCAG AA


**User Story**
En tant que **Tom (déficient couleur modéré)**, je veux distinguer clairement les zones sans chasse du reste de la carte avec un contraste suffisant, même en plein soleil sur mon téléphone, afin de repérer immédiatement les zones d'intérêt.

**Acceptance Criteria**

**GIVEN** : MapLibre carte chargée avec tuiles zones (Story 1.1 complète)
**WHEN** : Les zones sans chasse s'affichent sur la carte
**THEN** :

- Polygones zones remplis couleur : `#10b981` (Tailwind green-500), opacité 0.6
- Contours polygones : stroke `#059669` (Tailwind green-600), largeur 2px
- Survol (hover) : opacité passe à 0.8, curseur change en `pointer`
- État sélectionné (clic) : contour devient `#047857` (green-700), largeur 3px, opacité 1
- Contraste fond OSM (gris/blanc) vs zones vertes : ≥ 3:1 (WCAG AA niveau graphique)
- Validation contraste avec outil axe DevTools Color Contrast Analyzer

**AND** : Légende carte affiche :

- 🟢 "Zone sans chasse identifiée"
- ⚪ "Pas de donnée (absence ≠ autorisation chasse)"

**AND** : Sur zoom très élevé (≥ 14), labels zones affichent le nom :

```javascript
map.addLayer({
    id: 'zones-label',
    type: 'symbol',
    source: 'zones-sans-chasse',
    'source-layer': 'zones',
    minzoom: 14,
    layout: {
        'text-field': ['get', 'nom'],
        'text-size': 14,
        'text-anchor': 'center',
    },
    paint: {
        'text-color': '#065f46', // green-900
        'text-halo-color': '#ffffff',
        'text-halo-width': 2,
    },
});
```

**Accessibility Integration**

- Contraste couleur/fond validé WCAG AA (≥ 3:1 pour éléments graphiques)
- Labels zones avec halo blanc (lisibilité sur OSM varié)
- Légende accessible avec `<ul>` sémantique et icônes texte alt
- Pattern fills alternatif disponible pour utilisateurs daltoniens (option settings Phase 2)

**Performance & Technical Acceptance**

- Hover state réactif < 16ms (60 FPS)
- Pas de repaint complet carte sur hover (uniquement couche zones)
- Style layers compilé côté MapLibre (pas de calcul JS par frame)

---

