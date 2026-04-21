### Story 7.2: Événements customs analytics (select_address, click_zone)

**User Story**
En tant que **porteur du projet**, je veux que les deux interactions clés — sélection d'une adresse et clic sur une zone — déclenchent des événements analytics custom dans Umami, afin de mesurer les actions utilisateurs qui aboutissent réellement à une navigation sur la carte.

**Acceptance Criteria**

**GIVEN** : Le script Umami est intégré (Story 7.1) et `NEXT_PUBLIC_UMAMI_WEBSITE_ID` est renseigné
**WHEN** : L'utilisateur sélectionne une adresse dans l'autocomplete ou clique sur une zone de la carte
**THEN** :

**Événement `select_address`** — déclenché dans `SearchBar` lors du clic sur une suggestion de l'autocomplete :

```typescript
// components/SearchBar.tsx
const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    window.umami?.track('select_address', {
        label: suggestion.label,
        type: suggestion.type, // 'municipality' | 'postcode' | 'street'
    });
    // ... logic zoom carte
};
```

**Événement `click_zone`** — déclenché dans le composant `Map` lors du clic sur un polygone de la carte :

```typescript
// components/Map.tsx
map.on('click', 'zones-fill', (event) => {
    const zone = event.features?.[0]?.properties;
    if (zone) {
        window.umami?.track('click_zone', {
            zone_name: zone.nom,
            zone_type: zone.type_protection,
        });
        // ... affichage détails zone
    }
});
```

**AND** : Les deux événements apparaissent dans le tableau de bord Umami sous "Custom events" avec leurs propriétés respectives

**AND** : Les événements utilisent l'opérateur optional chaining (`?.`) pour être silencieux si `window.umami` n'est pas encore chargé ou non configuré

**AND** : Aucune donnée personnelle identifiable n'est transmise (pas d'IP, pas d'email, pas d'identifiant utilisateur) — uniquement des données comportementales agrégées

**Accessibility Integration**

N/A (tracking invisible, aucune interaction UI ajoutée)

**Performance & Technical Acceptance**

- Appels `window.umami?.track()` synchrones et non bloquants (< 1ms d'impact)
- Aucun appel réseau supplémentaire visible dans le critical path des interactions (fire-and-forget)
- Tests unitaires vérifient que `window.umami.track` est appelé avec les bons arguments :

```typescript
// components/__tests__/SearchBar.test.tsx
it('tracks select_address event on suggestion selection', () => {
    const mockTrack = jest.fn();
    Object.defineProperty(window, 'umami', {
        value: {track: mockTrack},
        writable: true,
    });

    // ... simulate suggestion click
    expect(mockTrack).toHaveBeenCalledWith('select_address', {
        label: 'Strasbourg (67000)',
        type: 'municipality',
    });
});
```
