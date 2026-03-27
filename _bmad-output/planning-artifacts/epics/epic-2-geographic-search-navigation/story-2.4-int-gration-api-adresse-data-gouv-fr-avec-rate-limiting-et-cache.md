### Story 2.4: Intégration API Adresse data.gouv.fr avec rate limiting et cache


**User Story**
En tant que **développeur**, je veux intégrer l'API Adresse data.gouv.fr de manière robuste avec gestion rate limiting et cache local, afin d'assurer disponibilité recherche même en cas de pics trafic.

**Acceptance Criteria**

**GIVEN** : L'application est déployée avec recherche géographique (Story 2.1)
**WHEN** : Plusieurs utilisateurs effectuent des recherches simultanées
**THEN** :

- Chaque requête Search input est debounced 300ms client-side (évite flood)
- Résultats API Adresse sont cachés côté client (sessionStorage) :

    ```javascript
    const cacheKey = `search:${query}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);

    const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}&limit=5`);
    const data = await res.json();
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
    ```

- Cache expiré après 1h (timestamp validation)
- Rate limiting respecté : API Adresse permet 50 req/s (largement suffisant)

**AND** : Fallback si API Adresse indisponible :

- Base locale codes postaux `/public/cp.json` (JSON statique) :
    ```json
    {
      "67000": { "nom": "Strasbourg", "departement": "Bas-Rhin", "lat": 48.5734, "lng": 7.7521 },
      ...
    }
    ```
- Recherche code postal → match exact JSON local
- Recherche ville → fuzzy match simple (startsWith ou includes)
- Toast notification : "Recherche limitée aux codes postaux (API temporairement indisponible)"

**AND** : Monitoring :

- Logs backend comptent requêtes API Adresse (pas d'authentification nécessaire, API publique)
- Alertes si taux erreur API > 5%

**Accessibility Integration**

- N/A (logique backend/API)

**Performance & Technical Acceptance**

- Cache hit rate ≥ 60% (requêtes fréquentes : Paris, Lyon, Marseille)
- Fallback JSON local < 100KB (uniquement codes postaux France, ~42000 entrées compressées)
- API Adresse data.gouv.fr SLA : 99.5% uptime (monitoring externe StatusCake Phase 2)

**Technical Notes**

- API Adresse data.gouv.fr documentation : https://adresse.data.gouv.fr/api-doc/adresse
- Pas de clé API requise (service public gratuit)
- Alternative Phase 2 : Nominatim OSM (self-hosted, plus lourd mais autonome)

---

