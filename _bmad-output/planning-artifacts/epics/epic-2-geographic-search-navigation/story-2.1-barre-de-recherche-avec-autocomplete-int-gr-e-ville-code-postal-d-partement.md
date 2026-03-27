### Story 2.1: Barre de recherche avec autocomplete intégrée (ville, code postal, département)


**User Story**
En tant que **Tom**, je veux taper "Strasbourg" dans une barre de recherche et voir des suggestions apparaître immédiatement, afin de sélectionner rapidement la ville et zoomer sur la carte.

**Acceptance Criteria**

**GIVEN** : La carte MapLibre est affichée (Epic 1 complet)
**WHEN** : L'utilisateur tape dans la barre de recherche
**THEN** :

- Input de recherche affiché dans le header (desktop) ou au-dessus de la carte (mobile)
- Après 300ms de debounce, une requête est envoyée à l'API Adresse data.gouv.fr :
    ```
    GET https://api-adresse.data.gouv.fr/search/?q={query}&limit=5
    ```
- Résultats affichés en liste déroulante sous l'input :
    - Ville : "Strasbourg, Bas-Rhin (67000)"
    - Code postal : "67000 (Strasbourg)"
    - Département : "Bas-Rhin (67)"
- Navigation clavier dans suggestions : flèches haut/bas, `Enter` sélectionne, `Esc` ferme
- Clic sur suggestion → zoom carte sur bbox retournée par API

**AND** : Composant `/app/components/SearchBar.tsx` :

```tsx
'use client';
import {useState, useEffect} from 'react';
import {Command, CommandInput, CommandList, CommandItem} from '@/components/ui/command';

export function SearchBar({onSelectLocation}) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (query.length < 3) return;

        const timeout = setTimeout(async () => {
            const res = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}&limit=5`);
            const data = await res.json();
            setSuggestions(data.features);
        }, 300);

        return () => clearTimeout(timeout);
    }, [query]);

    return (
        <Command>
            <CommandInput
                placeholder="Rechercher une ville, code postal, département..."
                value={query}
                onValueChange={setQuery}
            />
            <CommandList>
                {suggestions.map((feature) => (
                    <CommandItem key={feature.properties.id} onSelect={() => onSelectLocation(feature)}>
                        {feature.properties.label}
                    </CommandItem>
                ))}
            </CommandList>
        </Command>
    );
}
```

**AND** : Gestion erreurs :

- API indisponible → fallback sur base locale codes postaux (JSON statique `/public/cp.json`)
- Réseau timeout → message "Recherche temporairement indisponible, réessayez"
- Zéro résultats → "Aucun résultat trouvé pour '{query}'"

**Accessibility Integration**

- Input avec `<label>` explicite : "Rechercher un lieu"
- Suggestions liste avec `role="listbox"`, items avec `role="option"`
- ARIA live region annonce nombre résultats : "5 suggestions disponibles"
- Navigation clavier complète :
    - `Tab` focus input
    - Flèches haut/bas : navigation suggestions
    - `Enter` : sélection
    - `Esc` : fermeture liste et retour input
- Focus visible sur suggestion active (outline 2px, background highlight)

**Performance & Technical Acceptance**

- Debounce 300ms évite flood requêtes API (rate limit 50 req/s)
- API Adresse data.gouv.fr : < 200ms temps réponse (95th percentile)
- Fallback local CP JSON < 100KB (codes postaux France uniquement)
- Composant SearchBar React optimisé (pas de re-render inutiles)

---

