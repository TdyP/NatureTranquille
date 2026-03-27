### Story 3.1: Popup/sidebar détails zone au clic sur polygone


**User Story**
En tant que **Marie**, je veux cliquer sur une zone verte de la carte et voir immédiatement ses détails (nom, type, gestionnaire) affichés dans une popup ou sidebar, afin de valider que c'est bien une zone sans chasse officielle.

**Acceptance Criteria**

**GIVEN** : La carte affiche les zones sans chasse (Epic 1 complet)
**WHEN** : L'utilisateur clique/tape sur un polygone zone
**THEN** :

- **Desktop (≥ 1024px)** :
    - Sidebar gauche 400px slide-in depuis le bord
    - Contenu sidebar : détails zone (voir structure ci-dessous)
    - Carte redimensionne pour laisser place sidebar (animation 300ms)
    - Bouton fermeture `X` en haut-droite sidebar

- **Mobile/Tablet (< 1024px)** :
    - Bottom sheet slide-up depuis le bas (40vh initial, expansible 80vh)
    - Swipe down pour fermer
    - Overlay semi-transparent derrière bottom sheet
    - Tap overlay ou bouton `X` ferme bottom sheet

**AND** : Structure détails zone affichés :

```tsx
<div className="zone-details">
    <h2 className="text-xl font-semibold">{zone.nom}</h2>

    <dl className="mt-4 space-y-2">
        <div>
            <dt className="text-sm font-medium text-muted-foreground">Type de protection</dt>
            <dd className="text-base">{zone.type_protection}</dd>
        </div>

        <div>
            <dt className="text-sm font-medium text-muted-foreground">Gestionnaire</dt>
            <dd className="text-base">{zone.gestionnaire || 'Non renseigné'}</dd>
        </div>

        <div>
            <dt className="text-sm font-medium text-muted-foreground">Date de mise à jour</dt>
            <dd className="text-base">{formatDate(zone.date_maj)}</dd>
        </div>

        <div>
            <dt className="text-sm font-medium text-muted-foreground">Source</dt>
            <dd className="text-base">
                {zone.source_url ? (
                    <a
                        href={zone.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        {zone.source}
                    </a>
                ) : (
                    zone.source
                )}
            </dd>
        </div>
    </dl>
</div>
```

**AND** : Métadonnées zone chargées depuis propriétés tuiles MVT (Story 0.3) :

- Pas d'appel API supplémentaire (données incluses dans tuile)
- `map.on('click', 'zones-fill', event => { ... })` récupère `event.features[0].properties`

**Accessibility Integration**

- Sidebar/Bottom sheet avec `role="dialog"` et `aria-labelledby` pointant vers le titre zone
- Focus trap activé :
    - Focus automatique sur titre zone à l'ouverture
    - `Tab` cycle uniquement dans dialog
    - `Shift+Tab` cycle reverse
    - Focus retourne au polygone cliqué après fermeture
- Bouton fermeture `X` :
    - `aria-label="Fermer les détails de la zone"`
    - Taille ≥ 44x44px (touch target)
- Clavier :
    - `Esc` ferme dialog
    - `Enter` sur polygone ouvre dialog (alternative au clic)
- Annonce lecteur écran : "Détails de la zone {nom} ouverts"

**Performance & Technical Acceptance**

- Ouverture sidebar/bottom sheet < 300ms (animation smooth)
- Pas de requête réseau (données tuiles MVT utilisées)
- Composant shadcn/ui `Sheet` (Radix Dialog primitives)

---

