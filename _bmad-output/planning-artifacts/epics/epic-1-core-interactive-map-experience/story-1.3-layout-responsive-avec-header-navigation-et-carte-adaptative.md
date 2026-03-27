### Story 1.3: Layout responsive avec header, navigation et carte adaptative


**User Story**
En tant que **Marie (utilisatrice mobile principalement)**, je veux accéder à la carte en plein écran sur mon smartphone avec un header discret, tout en pouvant facilement ouvrir le menu navigation pour accéder aux pages Sources et À propos.

**Acceptance Criteria**

**GIVEN** : L'application Next.js est déployée
**WHEN** : L'utilisateur accède au site sur différents appareils
**THEN** :

**Mobile (< 768px)** :

- Header fixe en haut : logo, titre "NatureTranquille", bouton menu hamburger (44x44px minimum)
- Carte occupe 100vh - header height (plein écran)
- Menu navigation slide-in depuis gauche sur clic hamburger (overlay)
- Menu contient : Accueil, Sources, À propos, Feedback
- Swipe right ou clic overlay ferme le menu

**Tablet (≥ 768px, < 1024px)** :

- Header plus large avec navigation inline (liens texte visibles)
- Carte occupe 100vh - header height

**Desktop (≥ 1024px)** :

- Header avec navigation complète inline
- Carte occupe 100vh - header height OU layout avec sidebar:
    - Sidebar gauche 320px (zone détails, voir Story 3.1)
    - Carte occupe le reste de la largeur
    - Sidebar collapsible (bouton toggle)

**AND** : Composants shadcn/ui utilisés :

- `Sheet` pour menu mobile (overlay + slide-in)
- `Button` pour hamburger et navigation
- `NavigationMenu` pour desktop navigation

**AND** : Layout défini dans `/app/layout.tsx` :

```tsx
export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="fr">
            <body className="font-sans antialiased">
                <Header />
                <main className="h-[calc(100vh-64px)]">{children}</main>
            </body>
        </html>
    );
}
```

**Accessibility Integration**

- Header navigation :
    - `<nav>` avec `aria-label="Navigation principale"`
    - Liens avec texte descriptif (pas icônes seules)
    - Bouton hamburger : `aria-label="Ouvrir le menu"`, `aria-expanded="false|true"`
- Menu mobile :
    - Focus trap activé quand ouvert
    - `Esc` ferme le menu
    - Focus retourne au bouton hamburger après fermeture
- Skip link "Aller au contenu principal" fonctionnel (bypass header)
- Tous boutons ≥ 44x44px (WCAG touch target)

**Performance & Technical Acceptance**

- Layout shift CLS < 0.1 (header height fixe, pas de flash)
- Menu animation < 200ms (transition smooth)
- Responsive breakpoints Tailwind standards (sm, md, lg, xl)

---

