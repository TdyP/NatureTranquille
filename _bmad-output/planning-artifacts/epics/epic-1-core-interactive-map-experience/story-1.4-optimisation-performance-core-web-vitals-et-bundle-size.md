### Story 1.4: Optimisation performance Core Web Vitals et bundle size


**User Story**
En tant que **Tom (connexion 3G rurale)**, je veux que le site charge rapidement même avec ma connexion lente, afin de ne pas abandonner avant de voir la carte.

**Acceptance Criteria**

**GIVEN** : L'application Next.js est buildée pour production (`npm run build`)
**WHEN** : L'utilisateur accède au site sur connexion 3G simulée (Chrome DevTools)
**THEN** :

- **LCP (Largest Contentful Paint)** < 2.5s (carte visible)
- **FID (First Input Delay)** < 100ms (carte réactive au premier clic)
- **CLS (Cumulative Layout Shift)** < 0.1 (pas de saut layout)
- **TTI (Time to Interactive)** < 5s
- **Bundle JavaScript initial** < 200KB gzipped (hors MapLibre GL JS)
- **MapLibre GL JS** (~500KB) chargé avec code-splitting (dynamic import) :

```tsx
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => <div className="h-full flex items-center justify-center">Chargement de la carte...</div>,
});
```

**AND** : Optimisations appliquées :

- Images optimisées avec composant `next/image` (WebP, lazy loading)
- Fonts hébergées localement (pas Google Fonts CDN) ou `font-display: swap`
- CSS Tailwind purgé (seules classes utilisées)
- Tuiles MVT cached avec `Cache-Control: public, max-age=86400`
- Service Worker optionnel Phase 2 (offline support)

**AND** : Monitoring performance :

- Lighthouse CI score ≥ 90 (Performance)
- Real User Monitoring (RUM) Phase 2 avec Vercel Analytics ou Plausible

**Accessibility Integration**

- Loading state carte annoncé avec `aria-live="polite"` : "Chargement de la carte en cours..."
- Spinner visible + texte (pas spinner seul)
- Validation axe DevTools sans erreurs critiques
- Tests NVDA (lecteur écran Windows) : page complète navigable

**Performance & Technical Acceptance**

- Tests Lighthouse (mode navigation, 3G throttling) :
    - Performance ≥ 90
    - Accessibility ≥ 95
    - Best Practices ≥ 90
    - SEO ≥ 90
- Bundle analysis avec `@next/bundle-analyzer` :
    - Visualisation treemap bundles
    - Pas de dépendances lourdes inutiles (ex: moment.js → date-fns)

**Technical Notes**

- Build production : `npm run build && npm start`
- Analyse bundle : `ANALYZE=true npm run build`
- Tests performance : Lighthouse CI intégré GitHub Actions Phase 2

---

---

