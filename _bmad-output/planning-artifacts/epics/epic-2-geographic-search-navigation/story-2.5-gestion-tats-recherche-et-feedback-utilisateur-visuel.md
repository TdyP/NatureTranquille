### Story 2.5: Gestion états recherche et feedback utilisateur visuel


**User Story**
En tant que **Marie**, je veux voir clairement quand la recherche est en cours, quand des résultats sont trouvés, ou quand aucun résultat ne correspond à ma saisie, afin de comprendre l'état de ma recherche à tout moment.

**Acceptance Criteria**

**GIVEN** : L'utilisateur interagit avec la barre de recherche (Story 2.1)
**WHEN** : L'utilisateur tape dans l'input
**THEN** :

- **État initial** (input vide) : Placeholder "Rechercher une ville, code postal, département..."
- **État typing** (< 3 caractères) : Aucun feedback (attente debounce)
- **État loading** (≥ 3 caractères, requête API en cours) :
    - Spinner affiché à droite de l'input
    - ARIA live region annonce : "Recherche en cours..."
- **État success** (résultats trouvés) :
    - Liste suggestions affichée sous input
    - ARIA live region annonce : "X suggestions disponibles"
- **État empty** (aucun résultat) :
    - Message sous input : "Aucun résultat trouvé pour '{query}'"
    - ARIA live region annonce : "Aucun résultat trouvé"
- **État error** (API erreur) :
    - Message sous input : "Recherche temporairement indisponible, réessayez"
    - ARIA live region annonce : "Erreur de recherche"
    - Fallback JSON local activé automatiquement

**AND** : Composant états visuels :

```tsx
{
    isLoading && <Spinner className="h-4 w-4 animate-spin" />;
}
{
    !isLoading && suggestions.length === 0 && query.length >= 3 && (
        <p className="text-sm text-muted-foreground">Aucun résultat trouvé pour "{query}"</p>
    );
}
{
    error && <p className="text-sm text-destructive">Recherche temporairement indisponible</p>;
}
```

**AND** : Reset recherche :

- Bouton `X` à droite de l'input (affiché si query non vide)
- Clic `X` → efface input, ferme suggestions, ARIA live : "Recherche réinitialisée"

**Accessibility Integration**

- ARIA live region avec `aria-live="polite"` et `aria-atomic="true"`
- États input annoncés :
    - `aria-busy="true"` pendant loading
    - `aria-invalid="true"` si erreur API
- Messages erreur associés avec `aria-describedby` :
    ```tsx
    <input aria-describedby="search-error" />
    <p id="search-error" role="alert">{errorMessage}</p>
    ```
- Spinner avec `aria-label="Recherche en cours"`

**Performance & Technical Acceptance**

- Transition états < 100ms (pas de lag visuel)
- ARIA live announcements pas spammés (debounce 300ms appliqué)
- Test avec NVDA : tous états correctement annoncés

---

---

