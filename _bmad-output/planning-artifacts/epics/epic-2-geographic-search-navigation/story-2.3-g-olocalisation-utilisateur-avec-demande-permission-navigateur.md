### Story 2.3: Géolocalisation utilisateur avec demande permission navigateur


**User Story**
En tant que **Marie**, je veux cliquer sur un bouton GPS et autoriser la géolocalisation pour centrer automatiquement la carte sur ma position actuelle, afin de voir rapidement les zones sans chasse près de moi.

**Acceptance Criteria**

**GIVEN** : La carte MapLibre est affichée avec contrôles standards
**WHEN** : L'utilisateur clique sur le bouton géolocalisation (icône GPS)
**THEN** :

- Le navigateur demande la permission `navigator.geolocation.getCurrentPosition()`
- **Si permission accordée** :
    - La carte centre sur la position utilisateur avec zoom 12 :

        ```javascript
        navigator.geolocation.getCurrentPosition((position) => {
            const {longitude, latitude} = position.coords;
            map.flyTo({
                center: [longitude, latitude],
                zoom: 12,
                duration: 1000,
            });

            // Marqueur position utilisateur
            new maplibregl.Marker({color: '#3b82f6'}).setLngLat([longitude, latitude]).addTo(map);
        });
        ```

    - ARIA live annonce : "Position trouvée, carte centrée sur votre position"

- **Si permission refusée** :
    - Toast notification : "Géolocalisation refusée. Utilisez la recherche pour trouver un lieu."
    - Pas de changement carte

- **Si erreur technique** (GPS désactivé, timeout) :
    - Toast : "Impossible d'obtenir votre position. Vérifiez les paramètres GPS."

**AND** : État bouton GPS :

- Par défaut : icône GPS gris
- Recherche position : spinner + icône GPS bleu
- Position trouvée : icône GPS vert
- Erreur : icône GPS rouge

**Accessibility Integration**

- Bouton GPS avec `aria-label="Centrer la carte sur ma position"`
- États bouton annoncés :
    - Recherche : `aria-busy="true"`, `aria-label="Recherche de votre position en cours..."`
    - Succès : `aria-label="Carte centrée sur votre position"`
    - Erreur : `aria-label="Impossible de géolocaliser, utilisez la recherche"`
- Toast notifications accessibles (ARIA live regions, auto-dismiss après 5s)

**Performance & Technical Acceptance**

- Demande géolocalisation timeout 10s (évite attente infinie)
- Pas de requête position continue (une seule fois au clic)
- Marqueur position supprimé si nouveau zoom manuel utilisateur

---

