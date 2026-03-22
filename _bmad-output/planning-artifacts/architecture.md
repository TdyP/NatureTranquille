---
stepsCompleted: [1, 2, 3]
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-NatureTranquille-2026-02-27.md'
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/planning-artifacts/research/technical-stockage-donnees-geolocalisees-pour-carte-research-2026-03-09.md'
workflowType: 'architecture'
project_name: 'NatureTranquille'
user_name: 'Teddy'
date: '2026-03-22'
---

# Architecture NatureTranquille

**Projet** : NatureTranquille  
**Auteur** : Teddy  
**Date de création** : 22 mars 2026

---

Ce document construit de manière collaborative les décisions architecturales pour le projet NatureTranquille à travers une découverte étape par étape.

Les sections suivantes seront complétées progressivement au fil des étapes du workflow.

---

## Documents d'Entrée

Les documents suivants ont été chargés et serviront de base pour les décisions architecturales :

1. **Product Brief** : Vision produit, problématique, utilisateurs cibles, MVP scope
2. **PRD (Product Requirements Document)** : Exigences fonctionnelles et non-fonctionnelles complètes, contraintes techniques, stratégie de déploiement par phases
3. **UX Design Specification** : Design system complet (Tailwind + shadcn/ui), parcours utilisateurs, patterns d'interface, accessibilité RGAA 4.1
4. **Recherche Technique** : Analyse comparative des technologies de stockage géospatial, patterns d'architecture, recommandations PostGIS/MapLibre/MVT

---

## Contexte Projet (Step 1 - Initialisation)

**Application Web** : NatureTranquille - Cartographie des zones sans chasse en France

**Stack Technique Identifié (depuis PRD/Research)** :
- Frontend : NextJS 14+ App Router, React, TypeScript, MapLibre GL JS 4.x, Tailwind CSS
- Backend API : Node.js/Express ou Python/FastAPI (à décider Step 3)
- Base de données : PostgreSQL 15+ avec PostGIS 3.4+
- Tile Server : pg_tileserv, t-rex, ou tileserver-gl (à décider Step 4)
- Format tiles : MVT (Mapbox Vector Tiles)
- Hébergement : Scalingo (France) ou CleverCloud (France) - conformité RGPD

**Contraintes Clés** :
- Performance < 2s chargement initial (75th percentile 3G mobile)
- Accessibilité RGAA 4.1 niveau AA obligatoire
- Conformité RGPD (hébergement UE, pas de cookies tiers)
- MVP : 2-3 départements Grand Est, expansion progressive vers couverture nationale

---

## Prochaines Étapes

Le workflow d'architecture suivra les étapes suivantes :

**Step 2 - Analyse Contexte** : Synthèse des exigences architecturales extraites des documents d'entrée

**Step 3 - Architecture Frontend** : Décisions structure NextJS, state management, intégration MapLibre

**Step 4 - Architecture Backend & Données** : Choix API design, architecture PostGIS, stratégie tiles

**Step 5 - Infrastructure & Déploiement** : CI/CD, environnements, monitoring, scaling

**Step 6 - Sécurité** : Authentification (future), rate limiting, CORS, RGPD, sécurisation données

**Step 7 - Documentation & Validation** : ADR (Architecture Decision Records), diagrammes, validation cohérence

---

## Analyse de Contexte Projet

### Vue d'Ensemble des Exigences

**Description Projet :**

NatureTranquille est une application web cartographique publique visant à démocratiser l'accès aux zones sans chasse en France. L'application agrège des données géospatiales publiques éparpillées (RNCFS, réserves naturelles, open data départementaux, terrains privés) et les rend accessibles via une carte interactive simple, inspirée de l'expérience Google Maps.

**Utilisateurs Cibles :**
- **Tom** (38 ans) : Parent cherchant zones sécurisées pour balades familiales en forêt
- **Marie** (52 ans) : Photographe animalière planifiant spots d'affût sans perturbation humaine
- **Mireille** (64 ans) : Retraitée cueilleuse de champignons, peu tech-savvy, besoin d'interface ultra-simple

**Fonctionnalité Centrale (Magic Moment) :**
"J'ouvre le site → je vois les zones vertes près de moi → je clique → j'ai l'info qu'il me faut → je pars en balade"

---

### Exigences Fonctionnelles

**MVP (Phase 1 - Q2 2026) :**

1. **Carte Interactive :**
   - Affichage polygones géospatiaux (zones sans chasse) sur carte OSM via MapLibre GL JS
   - Navigation fluide (zoom, pan, rotation) 60 FPS minimum
   - Zones vertes immédiatement visibles au chargement (pas de configuration)
   - Support multi-échelle : France entière → départements → zones locales

2. **Recherche Géographique :**
   - Barre recherche autocomplete (communes, codes postaux)
   - API Adresse data.gouv.fr (Base Adresse Nationale)
   - Debounce 300ms, résultats limités à 5 suggestions
   - Zoom automatique vers résultat sélectionné

3. **Géolocalisation Mobile :**
   - Auto-zoom position utilisateur si permission accordée
   - Cercle précision GPS visible
   - Fallback silencieux si refus : vue France + message courtois

4. **Détails Zones :**
   - Clic/tap zone → popup instantanée (< 500ms) avec métadonnées
   - Informations : nom zone, statut "Chasse interdite", type protection, gestionnaire, date MAJ, source
   - Desktop : sidebar 400px slide-in
   - Mobile : bottom sheet 40-80vh swipe-dismissable

5. **Contexte Intelligent :**
   - Hiérarchie automatique : géoloc > dernière zone consultée > France
   - Mémorisation `lastViewedRegion` au clic zone (intention explicite)
   - Bouton "Vue France" 🏠 pour réinitialisation manuelle

6. **Feedback Utilisateur :**
   - Formulaire signalement départements non couverts
   - Email optionnel, message optionnel
   - Toast confirmation succès, stockage signalements base données

7. **Assistance Viewport Vide :**
   - Détection viewport sans zones visibles (timeout 2s)
   - Toast info générique : "Aucune zone identifiée, explorez d'autres zones ou voir roadmap"
   - Lien vers page Sources de données / roadmap expansion

**Post-MVP (Phase 2 - Q3-Q4 2026) :**
- Filtres par type de zone (RNCFS, Réserves Naturelles, Terrains Privés)
- Analytics anonymes (Umami privacy-friendly)
- Formulaire feedback intégré (amélioration données, erreurs)
- Expansion 15 départements couverts

**Phase 3 (2027+) :**
- Couverture nationale 100 départements
- API publique pour développeurs tiers
- Fonctionnalités communautaires (contributions modérées)
- Application mobile native si demande forte

---

### Exigences Non-Fonctionnelles

**Performance (Critiques) :**
- ⚡ **Chargement initial < 2s** (75th percentile, 3G mobile) — Non-négociable
- ⚡ **Détails zone < 500ms** au clic (métadonnées embarquées dans tiles MVT)
- ⚡ **Navigation 60 FPS** minimum (zoom, pan fluide sans lag perceptible)
- ⚡ **Bundle JS initial < 200KB** (hors MapLibre GL JS ~500KB gzipped)
- 📊 **Core Web Vitals :** LCP < 2.5s, FID < 100ms, CLS < 0.1

**Accessibilité (RGAA 4.1 Niveau AA Obligatoire) :**
- ♿ **Navigation clavier complète** : carte, recherche, contrôles, focus visible
- ♿ **Contrastes WCAG AA** : ratios ≥ 4.5:1 texte normal, ≥ 3:1 éléments interactifs (palette validée)
- ♿ **ARIA landmarks, labels, roles** : structure sémantique HTML5
- ♿ **Screen readers support** : alternative textuelle carte (liste zones sous carte)
- ♿ **Boutons tactiles ≥ 44px** mobile (WCAG critère succès 2.5.5)

**Responsive Design :**
- 📱 **Mobile-first (< 768px)** : carte plein écran, bottom sheet détails, contrôles floating 44px
- 🖥️ **Desktop (≥ 1024px)** : header 64px, sidebar 400px conditionnelle, contrôles 40px bottom-right
- 📟 **Tablet (768-1023px)** : hybrid approche, modal/bottom sheet selon hauteur

**RGPD & Privacy :**
- 🔒 **Hébergement UE** TBD (décision indépendante du développement)
- 🔒 **Pas de cookies tiers** au MVP (pas de tracking publicitaire)
- 🔒 **Analytics anonymes uniquement** (post-MVP : Umami privacy-friendly)
- 🔒 **Pas de comptes utilisateurs MVP** (anonyme, friction minimale)

**SEO & Découvrabilité :**
- 🔍 **Routes statiques SSG** NextJS : `/`, `/departements/[slug]`, `/regions/[slug]`
- 🔍 **Métadonnées dynamiques** par département : `<title>`, OpenGraph, Schema.org
- 🔍 **Sitemap XML** généré automatiquement (départements couverts)
- 🔍 **Pas de content farming** : simplicité, pas de texte généré artificiellement

**Conformité Légale :**
- ⚖️ **Licence Ouverte v2.0** : données publiques, attribution sources obligatoire
- ⚖️ **Disclaimers obligatoires** : "Carte affiche UNIQUEMENT zones connues, absence zone ≠ chasse autorisée partout"
- ⚖️ **Sources citées** : gestionnaires affichés (ONF, Parcs Naturels, Préfectures)
- ⚖️ **Page Sources de données** : méthodologie, roadmap, appel contribution

**Scalabilité Progressive :**
- 📈 **MVP 2-3 départements** → architecture doit supporter **100+ départements** sans refonte
- 📈 **Read replicas PostGIS** anticipées (lecture >> écriture)
- 📈 **Horizontal scaling tile servers** (stateless, cache-friendly)
- 📈 **Cache multi-niveaux tiles** : memory (tile server) → Redis (optionnel) → CDN UE

---

### Échelle & Complexité Projet

**Évaluation Complexité Globale : MOYENNE avec Spécialisation Géospatiale**

| Dimension | Niveau | Justification |
|-----------|---------|---------------|
| **Domaine Technique** | Moyenne-Haute | Données géospatiales (PostGIS, spatial indexes GiST/SP-GiST), formats multiples (GeoJSON/MVT/Shapefile), simplification géométrique Douglas-Peucker, projections EPSG |
| **Complexité UI/UX** | Moyenne | Carte WebGL interactive MapLibre, responsive multi-device, animations micro-interactions, contexte intelligent hiérarchique, design system Tailwind+shadcn/ui |
| **Intégrations Externes** | Faible-Moyenne | API Adresse data.gouv.fr (geocoding), ingestion données multi-sources (ONCFS, Réserves Naturelles, Open Data départements) |
| **Conformité Réglementaire** | Haute | RGAA 4.1 AA obligatoire (service public), RGPD strict (hébergement UE, pas cookies tiers), Licence Ouverte v2.0, disclaimers légaux |
| **Scalabilité Requise** | Moyenne | MVP 2-3 départements → expansion progressive 100+ départements, tuiles cache multi-niveaux, read replicas PostGIS |
| **Features Temps Réel** | Faible | Pas de collaboration live, pas de notifications push MVP |
| **Multi-Tenancy** | Aucun | Données publiques, pas de comptes utilisateurs MVP |

**Domaine Technique Principal :** Full-Stack Web Application Géospatiale  
**Stack :** Frontend NextJS + Backend API REST + PostGIS Database + Tile Server MVT

**Composants Architecturaux Estimés (MVP) :**
1. **Frontend Web Application** (NextJS 14+ App Router, MapLibre GL JS)
2. **Backend API REST** (recherche geocoding, feedback, métadonnées zones)
3. **Base Données PostGIS** (single source of truth données géospatiales)
4. **Tile Server** (génération/serving MVT depuis PostGIS)
5. **Pipeline Ingestion Données** (ETL GDAL/OGR transformations multi-sources)
6. **CDN/Cache Tiles** (optionnel MVP, critique à l'échelle)

---

### Contraintes Techniques & Dépendances

**Stack Technique Validé (PRD/Research) :**

- ✅ **Frontend :** NextJS 14+ App Router, React, TypeScript, MapLibre GL JS 4.x, Tailwind CSS
- ✅ **Design System :** Tailwind CSS + shadcn/ui (Radix UI primitives accessibilité native)
- ✅ **Base Données :** PostgreSQL 15+ avec extension PostGIS 3.4+
- ⏳ **Backend API :** Node.js/Express ou Python/FastAPI (à décider Step 3)
- ⏳ **Tile Server :** pg_tileserv, t-rex, ou tileserver-gl (à décider Step 4)
- ✅ **Format Tiles :** MVT (Mapbox Vector Tiles) format binaire compact
- ✅ **Geocoding API :** API Adresse data.gouv.fr (Base Adresse Nationale) — gratuit, 50 req/s
- ⏳ **Hébergement :** TBD (décision indépendante du développement)

**Dépendances Externes :**
- API Adresse data.gouv.fr (SLA non garanti, fallback à prévoir si timeout)
- Tiles OSM (fond de carte OpenStreetMap, CDN public)
- Sources données géospatiales (ONCFS/OFB, Réserves Naturelles de France, Open Data départements)

**Contraintes de Performance :**
- Simplification géométrique obligatoire par niveau zoom (Douglas-Peucker algorithm)
- Métadonnées embarquées dans tiles MVT (éviter API calls pour détails zones)
- Bundle splitting NextJS (code splitting routes, lazy loading composants)
- Tuiles vectorielles MVT préférées à GeoJSON (10x plus léger, rendu côté client)

**Contraintes de Scalabilité :**
- Architecture doit anticiper 100+ départements (pas d'optimisations prématurées mais design évolutif)
- PostGIS partitioning par département optionnel (si >50 départements et performance dégrade)
- Horizontal scaling tile servers requis (stateless, cache-friendly)

---

### Préoccupations Transversales Identifiées

Ces préoccupations affecteront **multiples composants** et **toutes les phases** de développement :

**1. Performance Géospatiale Multi-Échelle**
- **Impact Composants :** PostGIS (indexes spatiaux), Tile Server (génération MVT), Frontend (rendering MapLibre)
- **Décisions Architecturales Requises :**
  - Stratégie simplification géométrique par zoom (Douglas-Peucker threshold par niveau)
  - Clustering visuel si densité zones élevée (Supercluster côté client ou pré-calculé)
  - Cache tiles multi-niveaux (memory, Redis, CDN) avec invalidation intelligente
  - Budget performance < 2s load, < 500ms détails → tuiles MVT obligatoires (pas GeoJSON)

**2. Accessibilité RGAA 4.1 AA (Contrainte Légale)**
- **Impact Composants :** Frontend (navigation clavier, ARIA), Design System (contrastes validés)
- **Décisions Architecturales Requises :**
  - shadcn/ui (Radix UI primitives) fournit accessibilité native mais tests manuels requis
  - Alternative textuelle carte : générer liste zones sous carte (hidden visuellement, accessible screen readers)
  - Focus management navigation clavier carte (trap focus dans popups, Esc dismiss)
  - Validation contrastes palette colors avant implémentation (WebAIM Contrast Checker)

**3. Ingestion & Qualité Données Multi-Sources**
- **Impact Composants :** Pipeline ETL, PostGIS (validation), Backend API (métadonnées)
- **Décisions Architecturales Requises :**
  - GDAL/OGR pour transformation formats hétérogènes → GeoJSON unifié → PostGIS
  - Validation qualité automatique : `ST_IsValid`, géométries repair `ST_MakeValid`, projections EPSG:4326
  - Détection doublons géospatiaux (ST_Intersects, ST_Area overlap threshold)
  - Normalisation métadonnées (gestionnaire, type protection, date MAJ) avec mapping par source
  - Stratégie mise à jour incrémentale (éviter reload complet département)

**4. Sécurité & Privacy (RGPD)**
- **Impact Composants :** Backend API (rate limiting), Frontend (pas de cookies tiers), Hébergement (UE)
- **Décisions Architecturales Requises :**
  - Rate limiting API publique (nginx limit_req ou middleware Express/FastAPI)
  - Input validation SQL injection (parameterized queries PostGIS, ORM si applicable)
  - CORS configuration restrictive (whitelist domaines autorisés)
  - Pas de JWT/auth MVP mais architecture doit anticiper ajout futur (httpOnly cookies, refresh tokens)
  - Hébergement UE obligatoire (décision finale TBD mais contrainte architecturale)

**5. Génération & Caching Tiles MVT**
- **Impact Composants :** PostGIS (source), Tile Server (génération), CDN/Cache (delivery)
- **Décisions Architecturales Requises :**
  - Choix tile server (pg_tileserv, t-rex, tileserver-gl) selon critères : performance, cache natif, latency
  - Stratégie pre-seeding tiles MVP (départements couverts, niveaux zoom 6-14)
  - Cache multi-niveaux : memory (tile server) → Redis (optionnel mais recommandé) → CDN UE
  - Invalidation cache lors mise à jour données département (versioning tiles ou purge sélective)
  - TileJSON endpoint pour config MapLibre côté client

**6. Expansion Progressive Départements (Scalabilité)**
- **Impact Composants :** PostGIS (partitioning optionnel), Tile Server (horizontal scaling), Frontend (roadmap UI)
- **Décisions Architecturales Requises :**
  - Modèle données PostGIS doit supporter ajout départements sans migration schema
  - Read replicas PostGIS anticipées (lecture >> écriture, ~90% reads tiles/API)
  - Horizontal scaling tile servers (stateless, load balancer round-robin)
  - Monitoring performance PostGIS par département (query times, index usage)
  - UI roadmap départements couverts (transparent pour utilisateurs)

---

### Récapitulatif Portée Architecturale

**Que devons-nous architecturer ?**

✅ **Application Web Full-Stack Géospatiale :**
- Frontend carte interactive NextJS + MapLibre (MVP critique)
- Backend API REST minimal (recherche, feedback, métadonnées)
- Base données PostGIS (single source of truth géospatial)
- Tile Server MVT (performance rendering carte)
- Pipeline ingestion données ETL (qualité multi-sources)

✅ **Contraintes Architecturales Non-Négociables :**
- Performance < 2s load, < 500ms détails, 60 FPS navigation
- Accessibilité RGAA 4.1 AA (légal obligatoire)
- RGPD strict (hébergement UE, pas cookies tiers)
- Scalabilité progressive 3 → 100+ départements sans refonte
- Responsive mobile-first (< 768px), tablet, desktop

✅ **Spécificités Géospatiales :**
- PostGIS avec indexes spatiaux GiST/SP-GiST
- Simplification géométrique adaptative (Douglas-Peucker)
- Tuiles vectorielles MVT (format binaire compact)
- Cache multi-niveaux tiles (memory, Redis, CDN)
- Validation qualité données (ST_IsValid, projections, doublons)

❌ **Hors Scope MVP :**
- Comptes utilisateurs, authentification
- Features temps réel, notifications push
- Application mobile native
- API publique pour développeurs tiers
- Contributions communautaires modérées

---

**La portée architecturale est maintenant clairement définie. Nous pouvons procéder aux décisions architecturales détaillées.**

---

## Évaluation Starter Template

### Domaine Technologique Principal

**Full-Stack Web Application Géospatiale** basé sur l'analyse des exigences projet :
- Frontend carte interactive (NextJS + MapLibre GL JS)
- Backend API REST minimal (endpoints recherche, feedback, métadonnées)
- Base données spatiale (PostgreSQL + PostGIS)

### Options Starter Considérées

**1. create-next-app (Next.js Official CLI)**
- NextJS 14+ App Router, TypeScript, Tailwind CSS intégrés
- Configuration minimale, structure claire
- Maintenu officiellement Vercel

**2. create-t3-app (T3 Stack)**
- NextJS + tRPC + Prisma + NextAuth
- Full-stack type safety end-to-end
- Configuration opinionated complète

**3. create-vite (Vite + React)**
- Build tooling ultra-rapide
- Client-side only, pas de SSG/SSR
- Flexibilité maximale

### Starter Sélectionné : create-next-app (Next.js Official CLI)

**Rationale de Sélection :**

**Alignement Exigences Projet :**
- ✅ **NextJS 14+ App Router** : SSG routes statiques requises pour SEO (`/departements/[slug]`)
- ✅ **TypeScript** : Type safety validée dans stack technique
- ✅ **Tailwind CSS** : Design system défini (palette nature sophistiquée)
- ✅ **Configuration minimale** : Pas de dépendances superflues, contrôle architecture total

**Philosophie "Just Enough" :**
- shadcn/ui s'intègre proprement sur cette base (installation post-init recommandée)
- MapLibre GL JS ajouté via npm install standard (pas de conflit)
- Backend API flexible : choix Express vs FastAPI reste ouvert
- Pas d'ORM imposé : PostGIS raw SQL spatial queries (`ST_*` functions) requis

**Alternatives Écartées :**
- ❌ **T3 Stack** : Prisma ORM incompatible approche PostGIS raw SQL, tRPC over-engineering API REST simple MVP, NextAuth prématuré (pas de comptes utilisateurs MVP)
- ❌ **Vite** : Pas de SSG/SSR (exigence SEO routes statiques impossibles), framework routing/data fetching manquant

**Commande d'Initialisation :**

```bash
npx create-next-app@latest naturetranquille \
  --typescript \
  --tailwind \
  --app \
  --eslint \
  --src-dir \
  --import-alias "@/*"
```

**Flags Expliqués :**
- `--typescript` : Active TypeScript strict mode
- `--tailwind` : Installe Tailwind CSS + PostCSS + Autoprefixer
- `--app` : Utilise App Router (vs Pages Router legacy)
- `--eslint` : Configure ESLint avec règles Next.js recommandées
- `--src-dir` : Organise code dans `/src` (séparation claire code vs config)
- `--import-alias "@/*"` : Alias imports `@/components` vs `../../../components`

### Décisions Architecturales Fournies par Starter

**Langage & Runtime :**
- **TypeScript 5.x** : Strict mode activé (`strict: true` tsconfig)
- **Node.js 18+** : Runtime requis Next.js 14+
- **React 18+** : Server Components & Client Components supportés

**Styling Solution :**
- **Tailwind CSS 3.x** : Utility-first CSS framework
- **PostCSS** : Transformations CSS (autoprefixer, nesting)
- **CSS Modules** : Supporté nativement Next.js (alternative Tailwind)
- Configuration : `tailwind.config.ts` (paths content, theme extend)

**Build Tooling :**
- **Turbopack** : Build tooling Next.js 14+ (remplace Webpack progressivement)
- **Bundle Optimization** : Code splitting automatique par route
- **Image Optimization** : `next/image` component optimisé
- **Font Optimization** : `next/font` Google Fonts optimisation automatique

**Linting & Formatting :**
- **ESLint** : Config `eslint-config-next` (règles React/Next.js/TypeScript)
- **Prettier** : À installer manuellement post-init (recommandé)
- Configuration : `.eslintrc.json` généré automatiquement

**Structure Projet :**

```
naturetranquille/
├── src/
│   ├── app/                    # App Router directory (routes = filesystem)
│   │   ├── layout.tsx          # Root layout (metadata, providers)
│   │   ├── page.tsx            # Homepage route (/)
│   │   ├── globals.css         # Tailwind directives (@tailwind base/components/utilities)
│   │   └── departements/
│   │       └── [slug]/        # Dynamic route (/departements/bas-rhin)
│   │           └── page.tsx
│   ├── components/             # React components réutilisables
│   ├── lib/                    # Utilitaires, helpers, config
│   └── types/                  # TypeScript types/interfaces custom
├── public/                     # Assets statiques (images, fonts)
├── .next/                      # Build output (git ignored)
├── node_modules/
├── package.json
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind configuration
├── next.config.js              # Next.js configuration
├── postcss.config.js           # PostCSS configuration
├── .eslintrc.json              # ESLint configuration
└── .gitignore
```

**Routing & Navigation :**
- **App Router** : Routes filesystem-based (`src/app/*/page.tsx`)
- **Dynamic Routes** : `[slug]` bracket syntax (`/departements/[slug]`)
- **Layouts** : `layout.tsx` partagés hiérarchiquement
- **Navigation** : `<Link>` component Next.js (prefetch automatique)

**Data Fetching :**
- **Server Components** : Fetch data directement dans composants (async/await)
- **Client Components** : `'use client'` directive pour interactivité
- **Streaming** : `<Suspense>` boundaries pour loading progressif
- **Caching** : Fetch requests cachées par défaut Next.js 14+

**Environment Variables :**
- `.env.local` : Variables environnement locales (git ignored)
- `process.env.*` : Accès variables côté serveur
- `NEXT_PUBLIC_*` : Variables exposées côté client (attention sécurité)

**Development Experience :**
- **Fast Refresh** : HMR (Hot Module Replacement) instantané
- **TypeScript Errors** : Affichés overlay développement
- **Dev Server** : `npm run dev` (port 3000 par défaut)
- **Build Production** : `npm run build` → SSG pages statiques générées
- **Preview Production** : `npm run start` (teste build local)

### Post-Initialisation Immédiate

**Installations Complémentaires Requises MVP :**

```bash
# shadcn/ui CLI (design system)
npx shadcn-ui@latest init

# MapLibre GL JS (carte interactive)
npm install maplibre-gl
npm install -D @types/maplibre-gl

# Lucide Icons (iconographie cohérente)
npm install lucide-react

# Testing (Vitest recommandé vs Jest)
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom

# Prettier (code formatting)
npm install -D prettier eslint-config-prettier
```

**Configurations Post-Init :**
1. shadcn/ui : Sélectionner style "Default", base color "Slate", CSS variables "Yes"
2. Tailwind : Étendre palette couleurs nature (primary, neutral, success dans `tailwind.config.ts`)
3. ESLint : Ajouter `eslint-config-prettier` pour éviter conflits Prettier
4. TypeScript : Ajouter paths aliases `@/components`, `@/lib`, `@/types` (pré-configuré)

**Note :** L'initialisation projet via `create-next-app` devrait être la **première story d'implémentation** (Story ID: SETUP-001).

---

*Les sections suivantes seront complétées au fur et à mesure des étapes du workflow.*
