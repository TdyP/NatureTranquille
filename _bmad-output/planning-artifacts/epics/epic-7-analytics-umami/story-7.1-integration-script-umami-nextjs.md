### Story 7.1: Intégration du script Umami dans Next.js

**User Story**
En tant que **développeur**, je veux ajouter le script de tracking Umami dans le layout global Next.js, afin que toutes les pages soient trackées automatiquement sans cookies et en conformité RGPD.

**Acceptance Criteria**

**GIVEN** : Le projet Next.js est fonctionnel
**WHEN** : Le développeur configure les variables d'environnement Umami et démarre l'application
**THEN** :

- Le composant `Script` de `next/script` est ajouté dans `app/layout.tsx` avec `strategy="afterInteractive"`
- Le script charge le tracker Umami depuis l'URL configurée via `NEXT_PUBLIC_UMAMI_SCRIPT_URL`
- L'attribut `data-website-id` utilise la valeur de `NEXT_PUBLIC_UMAMI_WEBSITE_ID`
- En l'absence de `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, le script n'est pas rendu (tracking silencieusement désactivé)

```tsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="fr">
            <body>
                {children}
                {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
                    <Script
                        src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? 'https://cloud.umami.is/script.js'}
                        data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
                        strategy="afterInteractive"
                    />
                )}
            </body>
        </html>
    );
}
```

**AND** : Un fichier `types/umami.d.ts` déclare le type global `window.umami` :

```typescript
// types/umami.d.ts
declare global {
    interface Window {
        umami?: {
            track: (eventName: string, data?: Record<string, unknown>) => void;
        };
    }
}

export {};
```

**AND** : Le fichier `.env.example` documente les deux variables :

```bash
# Umami Analytics (optional - tracking disabled if not set)
NEXT_PUBLIC_UMAMI_WEBSITE_ID=
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://cloud.umami.is/script.js
```

**AND** : Le README.md mentionne la configuration optionnelle Umami (section Analytics)

**Accessibility Integration**

N/A (script de tracking invisible, aucun impact sur l'interface utilisateur)

**Performance & Technical Acceptance**

- `strategy="afterInteractive"` garantit que le script ne bloque pas le rendu initial (LCP non impacté)
- Le script ne charge aucun cookie (vérifié via DevTools → Application → Cookies)
- Bundle JavaScript initial non impacté (script chargé de manière asynchrone post-hydratation)
- En local sans `NEXT_PUBLIC_UMAMI_WEBSITE_ID` défini : aucun appel réseau vers Umami
