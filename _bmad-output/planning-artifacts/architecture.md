---
stepsCompleted: [1, 2, 3, 4, 5]
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

| Dimension                    | Niveau         | Justification                                                                                                                                                         |
| ---------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Domaine Technique**        | Moyenne-Haute  | Données géospatiales (PostGIS, spatial indexes GiST/SP-GiST), formats multiples (GeoJSON/MVT/Shapefile), simplification géométrique Douglas-Peucker, projections EPSG |
| **Complexité UI/UX**         | Moyenne        | Carte WebGL interactive MapLibre, responsive multi-device, animations micro-interactions, contexte intelligent hiérarchique, design system Tailwind+shadcn/ui         |
| **Intégrations Externes**    | Faible-Moyenne | API Adresse data.gouv.fr (geocoding), ingestion données multi-sources (ONCFS, Réserves Naturelles, Open Data départements)                                            |
| **Conformité Réglementaire** | Haute          | RGAA 4.1 AA obligatoire (service public), RGPD strict (hébergement UE, pas cookies tiers), Licence Ouverte v2.0, disclaimers légaux                                   |
| **Scalabilité Requise**      | Moyenne        | MVP 2-3 départements → expansion progressive 100+ départements, tuiles cache multi-niveaux, read replicas PostGIS                                                     |
| **Features Temps Réel**      | Faible         | Pas de collaboration live, pas de notifications push MVP                                                                                                              |
| **Multi-Tenancy**            | Aucun          | Données publiques, pas de comptes utilisateurs MVP                                                                                                                    |

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

## Évaluation Starter Template (Step 3)

### Choix Starter : create-next-app (Next.js Official CLI)

**Options Évaluées :**

1. **create-next-app** (Next.js Official CLI)
2. **T3 Stack** (create-t3-app - Next.js + tRPC + Prisma + NextAuth)
3. **Vite + React** (Client-side uniquement)

### Analyse Comparative

| Critère              | create-next-app       | T3 Stack                                     | Vite + React                    |
| -------------------- | --------------------- | -------------------------------------------- | ------------------------------- |
| **SSG Support**      | ✅ Natif App Router   | ✅ Natif                                     | ❌ Requires plugins             |
| **TypeScript**       | ✅ Configuration auto | ✅ Strict mode par défaut                    | ✅ Configuration manuelle       |
| **Tailwind CSS**     | ✅ Setup prompt       | ✅ Préconfigured                             | ⚠️ Installation manuelle        |
| **API Routes**       | ✅ Built-in           | ✅ tRPC (over-engineering)                   | ❌ Nécessite backend séparé     |
| **ORM Integration**  | ⚠️ Agnostic           | ✅ Prisma (incompatible PostGIS raw SQL)     | ⚠️ Agnostic                     |
| **Learning Curve**   | ✅ Standard Next.js   | ⚠️ Multiple abstractions (tRPC, Zod, Prisma) | ✅ Simple React                 |
| **SEO (SSG/SSR)**    | ✅ Natif              | ✅ Natif                                     | ❌ CSR only (react-snap requis) |
| **Bundle Size**      | ✅ Optimized          | ⚠️ Packages supplémentaires                  | ✅ Minimal                      |
| **Over-engineering** | ✅ Minimal            | ❌ tRPC/Prisma surplus pour MVP              | ✅ Minimal                      |

### Décision Finale

**✅ Choix : create-next-app (Next.js Official CLI)**

**Rationnelle :**

1. **Alignement Exigences PRD :**
    - SSG routes statiques `/departements/[slug]` natif (SEO requirement)
    - API Routes intégrées (pas besoin backend séparé pour MVP)
    - TypeScript strict mode supporté
    - Tailwind CSS setup prompt simple

2. **Évite Over-Engineering :**
    - T3 Stack impose Prisma (incompatible PostGIS raw SQL requirement)
    - T3 Stack impose tRPC (overkill pour 5 endpoints REST simples)
    - Vite nécessite plugins SSG (react-snap, vite-ssg) + backend séparé

3. **Simplicité Architecture :**
    - Documentation officielle Next.js extensive
    - Configuration minimale out-of-the-box
    - Drizzle ORM compatible (contrairement à Prisma T3)
    - Community ecosystem mature

4. **Scalabilité Future :**
    - Incremental Static Regeneration (ISR) disponible Phase 2
    - Edge Runtime compatible
    - Turbopack build tooling (Next.js 14+)

### Commande d'Initialisation

```bash
npx create-next-app@latest naturetranquille \
  --typescript \
  --tailwind \
  --app \
  --eslint \
  --src-dir \
  --import-alias "@/*"
```

**Options Sélectionnées :**

- `--typescript` : TypeScript strict mode
- `--tailwind` : Tailwind CSS préconfigured
- `--app` : App Router (Next.js 13+)
- `--eslint` : ESLint configuration auto
- `--src-dir` : Structure `/src` directory
- `--import-alias "@/*"` : Path aliases `@/components`, `@/lib`

### Post-Initialisation Installations

```bash
# Design System & UI
npx shadcn-ui@latest init  # Radix UI primitives
npm install lucide-react   # Icons accessibility-friendly

# Map & Geospatial
npm install maplibre-gl
npm install @types/maplibre-gl --save-dev

# Database & ORM
npm install drizzle-orm postgres
npm install -D drizzle-kit

# Validation & Data Fetching
npm install zod
npm install swr

# Testing
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @vitejs/plugin-react  # Vitest + React support

# Code Quality
npm install -D prettier prettier-plugin-tailwindcss
```

### Structure Projet Post-Init

```
naturetranquille/
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Homepage (carte)
│   │   ├── departements/
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # SSG département pages
│   │   └── api/                    # API Routes
│   │       ├── search/route.ts
│   │       ├── zones/route.ts
│   │       └── feedback/route.ts
│   ├── components/                  # React components
│   │   ├── ui/                     # shadcn/ui components
│   │   ├── map/
│   │   │   ├── MapComponent.tsx    # MapLibre wrapper
│   │   │   ├── ZonePopup.tsx
│   │   │   └── SearchBar.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── lib/
│   │   ├── db/                     # Drizzle ORM
│   │   │   ├── index.ts           # DB client
│   │   │   └── queries.ts         # Reusable queries
│   │   └── utils.ts               # Helpers
│   └── contexts/                   # React Context + useReducer
│       └── MapContext.tsx
├── drizzle/
│   ├── schema.ts                   # Database schema (source of truth)
│   └── migrations/                 # Auto-generated SQL
├── public/
│   └── tiles/                      # Static assets (if needed)
├── tests/
│   ├── unit/
│   └── integration/
├── .env.local                      # Local environment variables
├── drizzle.config.ts              # Drizzle Kit configuration
├── next.config.js                 # Next.js configuration
├── tailwind.config.ts             # Tailwind customization
├── tsconfig.json                  # TypeScript configuration
└── vitest.config.ts               # Vitest configuration
```

### Routing Strategy

**Static Routes (SSG) :**

- `/` : Homepage carte interactive
- `/departements/[slug]` : Pages départements (SEO optimized)
- `/a-propos` : About page
- `/sources` : Sources données & roadmap

**API Routes :**

- `GET /api/search?q={query}` : Geocoding search
- `GET /api/zones?bounds={bbox}` : Zones dans viewport
- `GET /api/zones/:id` : Détails zone protection
- `POST /api/feedback` : Formulaire signalement

**Data Fetching :**

- **Server Components** : SSG pages (generateStaticParams)
- **Client Components** : SWR pour data fetching interactif (carte)

### Environment Variables

```bash
# .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/naturetranquille"
TILE_SERVER_URL="http://localhost:7800"
NEXT_PUBLIC_MAPLIBRE_STYLE="https://demotiles.maplibre.org/style.json"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api"
```

**Notes :**

- `NEXT_PUBLIC_*` prefix expose variables côté client
- `DATABASE_URL` reste serveur-side only (sécurité)
- `TILE_SERVER_URL` serveur-side (proxy via API Routes)

---

## Décisions Architecturales Core (Step 4)

### Architecture Pattern Choisi

**✅ Next.js Fullstack (Frontend + Backend API Routes) + Tile Server Séparé**

**Rationnelle :**

- SSG natif pour SEO (exigence PRD routes `/departements/[slug]`)
- API Routes intégrées pour backend simple (5 endpoints REST)
- Unified TypeScript codebase (DX optimal)
- Tile server DOIT rester séparé (optimisation MVT génération)

**Architecture Deployed :**

```
┌─────────────────────────────────────────────────────────┐
│              VPS Unique (~€5/mois Hetzner/OVH)         │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Next.js 14+ App Router (TypeScript)             │  │
│  │                                                   │  │
│  │  ┌────────────────┐     ┌──────────────────┐    │  │
│  │  │ Pages (SSG)    │     │ API Routes       │    │  │
│  │  │ /departements/ │     │ /api/zones       │────┼──┼──→ Drizzle ORM
│  │  │ [slug]         │     │ /api/search      │    │  │
│  │  └────────────────┘     │ /api/feedback    │    │  │
│  │                         └──────────────────┘    │  │
│  │  ┌────────────────────────────────────────┐    │  │
│  │  │ Client Components ('use client')       │    │  │
│  │  │ - MapLibre GL JS 4.x                   │    │  │
│  │  │ - useReducer + Context state            │    │  │
│  │  │ - SWR data fetching                    │    │  │
│  │  └────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────┘  │
│                           ↓                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Drizzle ORM (node-postgres pool)                │  │
│  │  - Schema TypeScript (types inférés)             │  │
│  │  - Migrations auto (drizzle-kit)                 │  │
│  │  - Custom geometry type PostGIS                  │  │
│  └──────────────────────────────────────────────────┘  │
│                           ↓                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  PostgreSQL 15+ + PostGIS 3.4+                   │  │
│  │  - zones_protection (geometry GIST index)        │  │
│  │  - departements, communes                        │  │
│  └──────────────────────────────────────────────────┘  │
│                           ↑                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  pg_tileserv (port 7800)                         │  │
│  │  - MVT tiles: /tiles/{z}/{x}/{y}.mvt             │  │
│  │  - Connexion directe PostGIS                     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  Nginx (reverse proxy :80/:443, Let's Encrypt HTTPS)    │
└─────────────────────────────────────────────────────────┘
                           ↓
                  Cloudflare CDN (cache tiles gratuit)
```

---

### Category 1 : Data Architecture

#### 1.1 Database

**✅ PostgreSQL 15+ avec PostGIS 3.4+**

**Justification :**

- Standard industrie pour données géospatiales
- PostGIS extension mature (ST\_\* functions, spatial indexes)
- GIST/SP-GIST indexes performance optimale requêtes spatiales
- Support natif geometry types (Polygon, MultiPolygon, Point)
- EPSG:4326 projection (WGS84 standard web maps)

**Version Note :** Utiliser dernière version stable au moment initialisation stack (mars 2026)

#### 1.2 ORM & Database Access

**✅ Drizzle ORM**

**Justification :**

- Types TypeScript inférés automatiquement depuis schema (DX optimal)
- Migrations auto-générées via `drizzle-kit`
- Custom type `geometry` pour PostGIS compatible
- Raw SQL escape via `sql` template pour queries `ST_*` complexes
- Léger (~15KB), edge-runtime compatible Next.js
- SQL-like syntax (pas DSL propriétaire comme Prisma)

**Alternative Rejetée :**

- ❌ Prisma : Incompatible PostGIS raw SQL requirement (abstractions limitées)
- ❌ Raw SQL uniquement : Pas de types inférés, migrations manuelles fast tedieuses

**Exemple Schema :**

```typescript
// drizzle/schema.ts
import {pgTable, uuid, text, timestamp, customType} from 'drizzle-orm/pg-core';

const geometry = customType<{data: any}>({
    dataType() {
        return 'geometry(Polygon, 4326)';
    },
});

export const zonesProtection = pgTable('zones_protection', {
    id: uuid('id').primaryKey().defaultRandom(),
    nom: text('nom').notNull(),
    departement: text('departement').notNull(),
    geometry: geometry('geometry').notNull(),
    typeProtection: text('type_protection').notNull(),
    gestionnaire: text('gestionnaire'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Types inférés automatiquement
export type ZoneProtection = typeof zonesProtection.$inferSelect;
export type NewZoneProtection = typeof zonesProtection.$inferInsert;
```

**Queries Type-Safe + PostGIS :**

```typescript
// lib/db/queries.ts
import {db} from '@/lib/db';
import {zonesProtection} from '@/drizzle/schema';
import {sql, eq} from 'drizzle-orm';

// Query simple type-safe
export async function getZoneById(id: string) {
    return db.select().from(zonesProtection).where(eq(zonesProtection.id, id));
}

// Query PostGIS spatiale avec ST_*
export async function getZonesIntersecting(lng: number, lat: number) {
    return db.execute(sql`
    SELECT
      id,
      nom,
      departement,
      type_protection,
      ST_AsGeoJSON(geometry)::json as geojson,
      ST_Area(geometry::geography) as area_m2
    FROM zones_protection
    WHERE ST_Intersects(
      geometry,
      ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
    )
    ORDER BY ST_Distance(geometry, ST_MakePoint(${lng}, ${lat}))
    LIMIT 10
  `);
}
```

#### 1.3 Tile Server

**✅ pg_tileserv (CrunchyData)**

**Justification :**

- Binaire Go standalone (~15MB) - zéro dépendance runtime
- Connexion directe PostGIS (zero-config auto-détection tables)
- Configuration variables environnement ou `.toml` simple
- Déploiement trivial sur VPS (même serveur PostgreSQL/Next.js)
- Cache filesystem intégré basique
- MVT génération optimisée performance

**Alternatives Évaluées :**

- **t-rex** (Rust) : Performance maximale, cache multi-niveaux avancé, MAIS configuration TOML plus verbale. Réservé si bottleneck performance à 50+ départements.
- **tileserver-gl** (Node.js) : Stack JavaScript unifié, MAIS plus lourd, styling intégré non nécessaire (MapLibre côté client).

**Déploiement pg_tileserv :**

```bash
# VPS unique avec PostgreSQL + Next.js
wget https://github.com/CrunchyData/pg_tileserv/releases/download/v1.0.9/pg_tileserv_linux
chmod +x pg_tileserv_linux

# Configuration environnement
export DATABASE_URL="postgresql://user:pass@localhost:5432/naturetranquille"
export TILESERV_PORT=7800

# Lancer tile server
./pg_tileserv_linux
```

**Endpoint Tiles :**

```
http://localhost:7800/public.zones_protection/{z}/{x}/{y}.mvt
```

**Évolution Future :**
Migration vers **t-rex** (Rust) si performance critique à l'échelle (100+ départements, trafic élevé). Architecture permet swap transparent (même format MVT).

#### 1.4 Validation Données

**✅ Zod (Runtime + Compile-Time Schemas)**

**Justification :**

- Schema TypeScript inféré automatiquement (type-safe)
- Validation runtime API requests/responses
- Intégration Next.js API Routes native
- Error messages customizables pour UX
- Compose schemas (DRY principle)

**Exemple Validation :**

```typescript
// lib/schemas/zone.ts
import {z} from 'zod';

export const ZoneSearchParamsSchema = z.object({
    bounds: z.string().regex(/^-?\d+\.\d+,-?\d+\.\d+,-?\d+\.\d+,-?\d+\.\d+$/),
    zoom: z.coerce.number().min(0).max(18).optional(),
});

export const FeedbackSchema = z.object({
    email: z.string().email().optional(),
    departement: z.string().min(1).max(100),
    message: z.string().max(1000).optional(),
});

// API Route usage
export async function POST(request: Request) {
    const body = await request.json();
    const validated = FeedbackSchema.parse(body); // Throws if invalid
    // ... process feedback
}
```

#### 1.5 Caching Strategy

**✅ MVP : HTTP Cache Headers (Pas de Redis)**

**Justification :**

- Tiles MVT statiques : cache agressif CDN + browser
- API endpoints simples : computation faible (pas besoin cache applicatif)
- Redis over-engineering pour MVP 2-3 départements
- Cache multi-niveaux ajouté Phase 2 si performance dégrade

**Configuration Cache :**

```typescript
// next.config.js
module.exports = {
    async headers() {
        return [
            {
                source: '/api/tiles/:path*',
                headers: [
                    {key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=604800'},
                    // 1 jour browser, 1 semaine CDN
                ],
            },
            {
                source: '/api/zones',
                headers: [
                    {key: 'Cache-Control', value: 'public, max-age=300'},
                    // 5 minutes cache courte (données peuvent changer)
                ],
            },
        ];
    },
};
```

**pg_tileserv Cache :**

- Cache filesystem basique intégré (tiles pré-générées)
- Configuration `TILESERV_CACHE_MAX_AGE=86400` (1 jour)

**CDN Cloudflare (Gratuit) :**

- Cache tiles MVT automatique (content-type `application/vnd.mapbox-vector-tile`)
- Purge sélective lors mise à jour département

**Évolution Phase 2 :**

- Redis pour cache API responses complexes (si query times > 200ms)
- Cache pre-warming tiles niveaux zoom critiques (6-14)

---

### Category 2 : Authentication & Security

#### 2.1 Authentication MVP

**✅ Aucune Authentification (Accès Anonyme)**

**Justification :**

- MVP accès public libre (friction minimale)
- Pas de comptes utilisateurs requis fonctionnalités MVP
- Formulaire feedback anonyme suffisant

**Phase 2 (Contributions Modérées) :**

- NextAuth.js v5 (Auth.js) intégration future
- Providers : Email magic link, Google OAuth
- Architecture prévue : httpOnly cookies, refresh tokens

#### 2.2 API Security

**✅ Rate Limiting + Security Headers + Input Validation**

**Rate Limiting (Next.js Middleware) :**

```typescript
// middleware.ts
import {NextResponse} from 'next/server';
import {RateLimiter} from '@/lib/rate-limiter';

const limiter = new RateLimiter({
    max: 100, // 100 requêtes
    window: 15 * 60, // par 15 minutes
});

export function middleware(request: Request) {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    if (!limiter.check(ip)) {
        return new NextResponse('Too Many Requests', {
            status: 429,
            headers: {'Retry-After': '900'}, // 15 minutes
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/:path*',
};
```

**Security Headers (next.config.js) :**

```javascript
module.exports = {
  async headers() {
    return [input{
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api-adresse.data.gouv.fr https://tiles.example.com;"
        }
      ]
    }];
  }
};
```

**Input Validation :**

- ✅ Zod schemas validation (API requests)
- ✅ Drizzle ORM parameterized queries (SQL injection prevention)
- ✅ CORS whitelist configuration production

---

### Category 3 : API & Communication

#### 3.1 API Pattern

**✅ REST (5 Endpoints Simples)**

**Endpoint Specifications :**

```typescript
// GET /api/search?q={query}
// Autocomplete geocoding (API Adresse data.gouv.fr)
interface SearchResponse {
    results: Array<{
        label: string;
        coordinates: [number, number];
        type: 'commune' | 'code_postal' | 'lieu_dit';
    }>;
}

// GET /api/zones?bounds={west},{south},{east},{north}
// Zones dans viewport carte
interface ZonesResponse {
    zones: Array<{
        id: string;
        nom: string;
        departement: string;
        geojson: GeoJSON.Geometry;
    }>;
}

// GET /api/zones/:id
// Détails zone protection
interface ZoneDetailResponse {
    id: string;
    nom: string;
    departement: string;
    typeProtection: string;
    gestionnaire: string;
    areaM2: number;
    geojson: GeoJSON.Geometry;
    updatedAt: string;
}

// POST /api/feedback
// Signalement département non couvert
interface FeedbackRequest {
    email?: string;
    departement: string;
    message?: string;
}

// GET /api/departements/:slug
// Métadonnées département (SSG)
interface DepartementResponse {
    slug: string;
    nom: string;
    code: string;
    zonesCount: number;
    coverage: 'full' | 'partial' | 'none';
    lastUpdate: string;
}
```

**Justification REST simple :**

- 5 endpoints CRUD simples (pas besoin GraphQL/tRPC complexity)
- HTTP verbs standard (GET, POST)
- JSON responses uniformes
- Stateless (cache-friendly)

#### 3.2 Error Handling

**✅ Try/Catch Standard + HTTP Status Codes**

```typescript
// app/api/zones/route.ts
import {NextResponse} from 'next/server';
import {ZodError} from 'zod';

export async function GET(request: Request) {
    try {
        const {searchParams} = new URL(request.url);
        const bounds = searchParams.get('bounds');

        // Validation
        const validated = ZoneSearchParamsSchema.parse({bounds});

        // Business logic
        const zones = await fetchZonesInBounds(validated.bounds);

        return NextResponse.json({zones});
    } catch (error) {
        // Zod validation errors
        if (error instanceof ZodError) {
            return NextResponse.json({error: 'Invalid parameters', details: error.errors}, {status: 400});
        }

        // Generic server errors
        console.error('Zones fetch error:', error);
        return NextResponse.json({error: 'Failed to fetch zones'}, {status: 500});
    }
}
```

**HTTP Status Codes :**

- `200` : Success
- `400` : Bad Request (validation errors)
- `404` : Not Found
- `429` : Too Many Requests (rate limit)
- `500` : Internal Server Error

**Monitoring :**

- Console logging MVP (stdout)
- Sentry intégration Phase 2 (error tracking production)

#### 3.3 Geocoding API

**✅ API Adresse data.gouv.fr (BAN - Base Adresse Nationale)**

**Justification :**

- Service officiel gouvernement français
- Gratuit, 50 req/s rate limit
- Coverage nationale complète
- RGPD compliant (hébergement France)

**Implementation :**

```typescript
// app/api/search/route.ts
const BAN_API = 'https://api-adresse.data.gouv.fr/search';

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const query = searchParams.get('q');

    const response = await fetch(`${BAN_API}/?q=${encodeURIComponent(query)}&limit=5`);
    const data = await response.json();

    const results = data.features.map((f: any) => ({
        label: f.properties.label,
        coordinates: f.geometry.coordinates,
        type: f.properties.type,
    }));

    return NextResponse.json({results});
}
```

**Fallback :**

- Timeout 5s, fallback message "Service temporairement indisponible"
- Pas de cache côté serveur (API Adresse gère cache)

---

### Category 4 : Frontend Architecture

#### 4.1 State Management

**✅ useReducer + Context API (React natif)**

**Justification :**

- Zéro dépendance (React built-in)
- Logique de state lisible et prévisible (reducer pur)
- Context API suffit pour partager le state carte (un seul arbre de composants)
- Complexité état NatureTranquille MVP faible (3-4 propriétés carte)
- `useReducer` facilite debugging (actions typées, state immutable)

**Alternative Rejetée :**

- ❌ Zustand : Dépendance externe non justifiée pour la complexité MVP

**Exemple Implémentation :**

```typescript
// contexts/MapContext.tsx
'use client';
import { createContext, useContext, useReducer, ReactNode } from 'react';
import type { LngLatBounds } from 'maplibre-gl';

interface MapState {
  selectedZoneId: string | null;
  mapBounds: LngLatBounds | null;
  searchQuery: string;
}

type MapAction =
  | { type: 'SELECT_ZONE'; payload: string | null }
  | { type: 'UPDATE_BOUNDS'; payload: LngLatBounds }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'CLEAR_SELECTION' };

const initialState: MapState = {
  selectedZoneId: null,
  mapBounds: null,
  searchQuery: '',
};

function mapReducer(state: MapState, action: MapAction): MapState {
  switch (action.type) {
    case 'SELECT_ZONE':
      return { ...state, selectedZoneId: action.payload };
    case 'UPDATE_BOUNDS':
      return { ...state, mapBounds: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'CLEAR_SELECTION':
      return { ...state, selectedZoneId: null };
    default:
      return state;
  }
}

const MapStateContext = createContext<MapState | null>(null);
const MapDispatchContext = createContext<React.Dispatch<MapAction> | null>(null);

export function MapProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(mapReducer, initialState);
  return (
    <MapStateContext.Provider value={state}>
      <MapDispatchContext.Provider value={dispatch}>
        {children}
      </MapDispatchContext.Provider>
    </MapStateContext.Provider>
  );
}

// Hooks utilitaires
export function useMapState() {
  const ctx = useContext(MapStateContext);
  if (!ctx) throw new Error('useMapState must be used within MapProvider');
  return ctx;
}

export function useMapDispatch() {
  const ctx = useContext(MapDispatchContext);
  if (!ctx) throw new Error('useMapDispatch must be used within MapProvider');
  return ctx;
}
```

**Usage Composant :**

```typescript
'use client';
import { useMapState, useMapDispatch } from '@/contexts/MapContext';

export function ZoneDetails() {
  const { selectedZoneId } = useMapState();
  const dispatch = useMapDispatch();

  return (
    <button onClick={() => dispatch({ type: 'CLEAR_SELECTION' })}>
      Fermer
    </button>
  );
}
```

**Note Performance :**
Séparer `MapStateContext` et `MapDispatchContext` évite re-renders des composants qui ne lisent pas le state mais dispatchent des actions (pattern recommandé React docs).

#### 4.2 Data Fetching

**✅ SWR (Client) + Server Components (SSG)**

**SWR Client-Side :**

```typescript
'use client';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function ZonesList() {
  const { data, error, isLoading } = useSWR('/api/zones?bounds=...', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000 // 1 minute
  });

  if (isLoading) return <ZonesLoader />;
  if (error) return <ErrorMessage />;

  return <ZonesMap zones={data.zones} />;
}
```

**Server Components SSG :**

```typescript
// app/departements/[slug]/page.tsx
export async function generateStaticParams() {
  const departements = await db.select().from(departementsTable);
  return departements.map(d => ({ slug: d.slug }));
}

export default async function DepartementPage({ params }: { params: { slug: string } }) {
  const departement = await db.query.departements.findFirst({
    where: eq(departementsTable.slug, params.slug)
  });

  return (
    <div>
      <h1>{departement.nom}</h1>
      <p>{departement.zonesCount} zones protégées</p>
    </div>
  );
}
```

#### 4.3 MapLibre Integration

**✅ Client Component Isolé ('use client')**

```typescript
// components/map/MapComponent.tsx
'use client';
import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapDispatch } from '@/contexts/MapContext';

export function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const dispatch = useMapDispatch();

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: process.env.NEXT_PUBLIC_MAPLIBRE_STYLE!,
      center: [2.3522, 48.8566], // Paris défaut
      zoom: 5
    });

    // Add vector tiles source
    map.on('load', () => {
      map.addSource('zones', {
        type: 'vector',
        tiles: [`${process.env.NEXT_PUBLIC_TILE_SERVER_URL}/public.zones_protection/{z}/{x}/{y}.mvt`]
      });

      map.addLayer({
        id: 'zones-fill',
        type: 'fill',
        source: 'zones',
        'source-layer': 'public.zones_protection',
        paint: {
          'fill-color': '#4a9d7f',
          'fill-opacity': 0.6
        }
      });
    });

    // Track viewport changes
    map.on('moveend', () => {
      dispatch({ type: 'UPDATE_BOUNDS', payload: map.getBounds() });
    });

    return () => map.remove();
  }, []);

  return <div ref={mapRef} className="h-full w-full" />;
}
```

**Note SSR :**
MapLibre nécessite client-side rendering (`'use client'`). Next.js gère automatiquement exclusion SSR.

---

### Category 5 : Infrastructure & Deployment

#### 5.1 Hosting Strategy

**✅ VPS Unique (~€5/mois Hetzner/OVH) - MVP**

**Justification :**

- PostgreSQL + PostGIS + pg_tileserv + Next.js sur même serveur
- Connexion localhost ultra-rapide (pas latency réseau)
- Coût minimal MVP (2-3 départements, trafic faible)
- Scalabilité future : séparer DB → instance dédiée, CDN Cloudflare gratuit

**Providers Recommandés :**

- **Hetzner Cloud CX21** : 2 vCPU, 4GB RAM, ~€5/mois (datacenter Allemagne/Finlande)
- **OVH VPS Starter** : 2 vCPU, 4GB RAM, ~€3.50/mois (datacenter France)
- **Contabo VPS S** : 4 vCPU, 8GB RAM, ~€5/mois (datacenter Allemagne)

**Stack Déployé :**

```bash
# Ubuntu 22.04 LTS
sudo apt update && sudo apt install -y postgresql-15 postgresql-15-postgis-3 nginx certbot

# PostgreSQL + PostGIS
sudo -u postgres createdb naturetranquille
sudo -u postgres psql -d naturetranquille -c "CREATE EXTENSION postgis;"

# pg_tileserv (binaire Go)
wget https://github.com/CrunchyData/pg_tileserv/releases/download/v1.0.9/pg_tileserv_linux
chmod +x pg_tileserv_linux
# Systemd service configuration

# Next.js (build production)
npm run build
npm start  # Port 3000

# Nginx reverse proxy
location / {
  proxy_pass http://localhost:3000;
}

location /tiles {
  proxy_pass http://localhost:7800;
  proxy_cache tiles_cache;
  proxy_cache_valid 200 7d;
}
```

**HTTPS :**

```bash
sudo certbot --nginx -d naturetranquille.fr
```

#### 5.2 CI/CD Pipeline

**✅ GitHub Actions (Build, Test, Deploy)**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
    push:
        branches: [main]

jobs:
    deploy:
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v3

            - uses: actions/setup-node@v3
              with:
                  node-version: '20'
                  cache: 'npm'

            - name: Install dependencies
              run: npm ci

            - name: Run tests
              run: npm run test

            - name: Build
              run: npm run build
              env:
                  DATABASE_URL: ${{ secrets.DATABASE_URL }}

            - name: Deploy to VPS
              uses: easingthemes/ssh-deploy@v2
              env:
                  SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
                  REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
                  REMOTE_USER: deploy
                  TARGET: /var/www/naturetranquille

            - name: Restart PM2
              run: |
                  ssh deploy@${{ secrets.REMOTE_HOST }} \
                  "cd /var/www/naturetranquille && pm2 reload naturetranquille"
```

**Process Manager :**

```bash
# PM2 pour Next.js
pm2 start npm --name "naturetranquille" -- start
pm2 save
pm2 startup
```

#### 5.3 Database Migrations

**✅ Drizzle Kit (Auto-Generated SQL)**

```bash
# Workflow migrations
# 1. Modifier drizzle/schema.ts
# 2. Générer migration SQL
npx drizzle-kit generate:pg

# 3. Review migration auto-générée
cat drizzle/migrations/0001_add_column.sql

# 4. Appliquer production
npx drizzle-kit push:pg  # Direct execution
# OU runtime migration
import { migrate } from 'drizzle-orm/node-postgres/migrator';
await migrate(db, { migrationsFolder: './drizzle/migrations' });
```

**Exemple Migration Générée :**

```sql
-- drizzle/migrations/0001_init.sql
CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE TABLE "zones_protection (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "nom" text NOT NULL,
  "departement" text NOT NULL,
  "type_protection" text NOT NULL,
  "gestionnaire" text,
  "geometry" geometry(Polygon, 4326) NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

CREATE INDEX "idx_zones_geometry" ON "zones_protection" USING GIST("geometry");
CREATE INDEX "idx_zones_departement" ON "zones_protection"("departement");
```

#### 5.4 Monitoring

**✅ MVP : Console Logging (Stdout)**

**Phase 2 Monitoring :**

- **Sentry** : Error tracking (exceptions, unhandled rejections)
- **Prometheus + Grafana** : Metrics PostgreSQL (query times, connections)
- **Uptime monitoring** : UptimeRobot gratuit (ping HTTPS checks)

**Core Web Vitals :**

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />  {/* Vercel Analytics gratuit */}
      </body>
    </html>
  );
}
```

---

### Stack Technique Final Récapitulatif

| Layer             | Technology           | Version              | Justification                            |
| ----------------- | -------------------- | -------------------- | ---------------------------------------- |
| **Frontend**      | Next.js              | Latest stable (15.x) | SSG natif, API Routes, TypeScript strict |
|                   | React                | Latest (19.x)        | Server Components, hooks                 |
|                   | TypeScript           | Latest (5.x)         | Type safety end-to-end                   |
|                   | Tailwind CSS         | Latest (4.x)         | Utility-first, RGAA compliance           |
|                   | shadcn/ui            | Latest               | Radix primitives accessibles             |
|                   | MapLibre GL JS       | 4.x                  | WebGL maps, MVT tiles                    |
| **State**         | useReducer + Context | React built-in       | Natif React, zéro dépendance             |
| **Data Fetching** | SWR                  | 2.x                  | Cache auto, revalidation                 |
| **Validation**    | Zod                  | 3.x                  | Runtime + compile-time schemas           |
| **Backend**       | Next.js API Routes   | Latest               | REST endpoints, edge runtime             |
|                   | Drizzle ORM          | Latest               | Types inférés, migrations auto, PostGIS  |
|                   | node-postgres        | 8.x                  | Pool PostgreSQL                          |
| **Database**      | PostgreSQL           | Latest stable (16.x) | Relationnel robuste                      |
|                   | PostGIS              | Latest (3.4+)        | Spatial queries ST\_\*                   |
| **Tiles**         | pg_tileserv          | Latest               | MVT generation, zéro-config              |
| **Geocoding**     | API Adresse          | -                    | data.gouv.fr officiel                    |
| **Security**      | Next.js Middleware   | -                    | Rate limiting, headers                   |
| **CI/CD**         | GitHub Actions       | -                    | Build, test, deploy                      |
| **Hosting**       | VPS Linux            | Ubuntu 22.04 LTS     | PostgreSQL + Next.js + pg_tileserv       |

**Note Versions :** Toutes les technologies utilisent les dernières versions stables disponibles au moment de l'initialisation stack (mars 2026).

---

**Step 4 Complete.** Toutes les décisions architecturales core sont documentées.

---

## Patterns d'Implémentation & Règles de Cohérence (Step 5)

### 12 Conflits Potentiels Identifiés & Résolus

L'analyse de la stack technique a révélé **12 points de conflit** entre les différentes conventions des technologies choisies. Les patterns ci-dessous établissent des règles univoques.

---

### Pattern 1 : Naming Conventions

#### Base de Données (snake_case)

```sql
-- Tables : snake_case singulier
zones_protection
departements
communes
feedbacks

-- Colonnes : snake_case
nom, type_protection, created_at, updated_at

-- Index : idx_{table}_{colonnes}
idx_zones_protection_geometry
idx_zones_protection_departement
idx_departements_slug
```

**Règle :** Base de données = snake_case exclusivement. Drizzle ORM fait le mapping automatique vers camelCase TypeScript.

#### Code TypeScript (camelCase / PascalCase)

```typescript
// Composants React : PascalCase
(MapComponent, ZonePopup, SearchBar, ZoneDetails);

// Fonctions et variables : camelCase
(fetchZones, selectedZoneId, mapBounds, isLoading);

// Constants globales : SCREAMING_SNAKE_CASE
(MAX_ZOOM, DEFAULT_CENTER, API_BASE_URL, DEBOUNCE_DELAY);

// Types & Interfaces : PascalCase avec suffixe descriptif
(ZoneProtection, MapState, MapAction, SearchResult);
(FeedbackRequest, DepartementResponse);
```

#### API Routes (kebab-case URLs, camelCase params)

```typescript
// Routes : kebab-case
GET /api/zones-protection
GET /api/search-address
POST /api/user-feedback

// Query params : camelCase
?bounds=...&zoomLevel=10&departementCode=67

// JSON response body : camelCase
{ "zoneId": "...", "typeProtection": "...", "createdAt": "..." }
```

**Conflit Résolu :** Drizzle retourne `typeProtection` (camelCase) depuis `type_protection` (snake_case DB).

---

### Pattern 2 : Structure de Fichiers

#### Principes

1. **Par feature, pas par type** : Les composants liés à la carte sont dans `/components/map/`, pas séparés en `/components/`, `/hooks/`, `/types/`
2. **Tests dans `/tests/` (miroir structure)** : PAS co-localisés avec les composants
3. **Contexts dans `/contexts/`** : PAS dans `/stores/` ou `/state/`
4. **Drizzle schema dans `/drizzle/`** : À la racine projet (convention Drizzle Kit), PAS dans `/src/`

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (MapProvider ici)
│   ├── page.tsx                 # Homepage
│   ├── error.tsx                # Error boundary global
│   ├── loading.tsx              # Loading global
│   ├── a-propos/
│   │   └── page.tsx
│   ├── sources/
│   │   └── page.tsx
│   ├── departements/
│   │   └── [slug]/
│   │       ├── page.tsx         # SSG
│   │       └── not-found.tsx
│   └── api/
│       ├── search/route.ts
│       ├── zones/route.ts
│       ├── zones/[id]/route.ts
│       ├── feedback/route.ts
│       └── departements/[slug]/route.ts
│
├── components/
│   ├── ui/                      # shadcn/ui (auto-generated, ne pas modifier)
│   ├── map/
│   │   ├── MapComponent.tsx
│   │   ├── MapContainer.tsx     # Wrapper layout
│   │   ├── ZonePopup.tsx
│   │   ├── ZoneDetails.tsx
│   │   ├── SearchBar.tsx
│   │   └── GeolocationButton.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Sidebar.tsx
│
├── contexts/
│   └── MapContext.tsx           # useReducer + Context (MapState + MapDispatch)
│
├── hooks/
│   ├── useZones.ts              # SWR hook zones data
│   ├── useSearch.ts             # SWR hook geocoding + debounce
│   └── useGeolocation.ts        # Geolocation API avec fallback
│
├── lib/
│   ├── db/
│   │   ├── index.ts            # Drizzle client (connexion pool)
│   │   └── queries.ts          # Fonctions requêtes réutilisables
│   ├── validations/
│   │   └── schemas.ts          # Zod schemas (API + forms)
│   └── utils.ts                # Helpers généraux
│
├── types/
│   └── geo.ts                  # GeoJSON types, ZoneProtection types
│
└── constants/
    └── index.ts                # MAX_ZOOM, DEFAULT_CENTER, DEBOUNCE_DELAY

drizzle/                        # Drizzle ORM (racine, pas dans /src)
├── schema.ts                   # Source of truth schema
└── migrations/                 # SQL auto-générés

tests/
├── unit/
│   ├── lib/
│   └── hooks/
└── integration/
    └── api/
```

**Règles Fermes :**

- ❌ Jamais de logique métier dans les composants → passer par `hooks/` ou `lib/`
- ❌ Jamais d'import direct `drizzle-orm` dans les composants → toujours via `lib/db/queries.ts`
- ❌ Jamais de `useMapState()` sans `MapProvider` parent → vérifier layout.tsx

---

### Pattern 3 : Format des Réponses API

#### Convention Directe (PAS de wrapper)

```typescript
// ✅ Correct : réponse directe
return NextResponse.json({
  zones: [...],
  total: 42
});

// ❌ Incorrect : wrapper {data, error}
return NextResponse.json({
  data: { zones: [...] },
  error: null,
  status: 'success'
});
```

**Justification :** SWR côté client accède directement à `data.zones`, pas besoin d'unwrapper.

#### Erreurs : Structure Uniforme

```typescript
// Toutes les erreurs API suivent ce format
return NextResponse.json(
    {
        error: 'Message lisible', // Pour logs/debug
        code: 'VALIDATION_ERROR', // Pour traitement client si besoin
    },
    {status: 400},
);
```

#### Dates : ISO 8601 Strings

```typescript
// ✅ Correct
{ "createdAt": "2026-03-22T10:30:00.000Z" }

// ❌ Incorrect
{ "createdAt": 1742645400000 }  // timestamp milliseconds
{ "createdAt": "22/03/2026" }   // format FR non parsable JS
```

#### GeoJSON : Standard RFC 7946

```typescript
// ✅ Conforme spec GeoJSON
{
  "type": "Feature",
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[2.35, 48.85], ...]]
  },
  "properties": {
    "zoneId": "...",
    "nom": "Forêt de Fontainebleau"
  }
}
```

---

### Pattern 4 : State Management (useReducer + Context)

#### Règles Strictes

```typescript
// 1. Types d'action : SCREAMING_SNAKE_CASE
type MapAction =
    | {type: 'SELECT_ZONE'; payload: string | null}
    | {type: 'UPDATE_BOUNDS'; payload: LngLatBounds}
    | {type: 'SET_SEARCH_QUERY'; payload: string}
    | {type: 'CLEAR_SELECTION'};

// 2. Reducer : toujours immutable (spread)
function mapReducer(state: MapState, action: MapAction): MapState {
    switch (action.type) {
        case 'SELECT_ZONE':
            return {...state, selectedZoneId: action.payload};
        // ❌ Interdit : state.selectedZoneId = action.payload; return state;
    }
}

// 3. Accès : uniquement via hooks custom
// ✅ Correct
const {selectedZoneId} = useMapState();
const dispatch = useMapDispatch();

// ❌ Interdit : import direct du Context
import {MapStateContext} from '@/contexts/MapContext';
const ctx = useContext(MapStateContext);
```

#### State Global vs State Local

```typescript
// State GLOBAL (MapContext) : partagé entre plusieurs composants
- selectedZoneId : Map + ZoneDetails + Sidebar
- mapBounds : Map + API zones fetch
- searchQuery : SearchBar + API search

// State LOCAL (useState) : propre au composant
- isPopupVisible : useState dans ZonePopup
- inputValue : useState dans SearchBar (avant debounce)
- isMenuOpen : useState dans Header mobile
```

---

### Pattern 5 : Gestion des Erreurs

#### Hiérarchie des Error Boundaries

```typescript
// Niveau 1 : app/error.tsx (global, last resort)
// Niveau 2 : app/departements/[slug]/error.tsx (page spécifique)
// Niveau 3 : composants avec try/catch inline (opérations isolées)

// app/error.tsx
'use client';
export default function GlobalError({ error, reset }) {
  return (
    <div role="alert">
      <h2>Une erreur est survenue</h2>
      <button onClick={reset}>Réessayer</button>
    </div>
  );
}
```

#### API Routes : Try/Catch + Codes HTTP

```typescript
export async function GET(request: Request) {
    try {
        // ... logique
        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({error: 'Paramètres invalides', code: 'VALIDATION_ERROR'}, {status: 400});
        }
        // Log avec contexte [Context] prefix
        console.error('[API/zones] Fetch error:', error);
        return NextResponse.json({error: 'Erreur serveur'}, {status: 500});
    }
}
```

#### Logging : Préfixe [Contexte]

```typescript
// Convention : [Module] Message : détail
console.error('[MapComponent] Failed to load tiles:', error);
console.warn('[API/search] BAN API timeout, returning empty results');
console.info('[DB] Connection pool established, max: 10');
```

---

### Pattern 6 : Loading States

#### Simple (SWR boolean)

```typescript
// Pour composants avec SWR - utiliser isLoading directement
const { data, error, isLoading } = useSWR('/api/zones', fetcher);

if (isLoading) return <ZonesSkeleton />;
if (error) return <ErrorFallback message="Impossible de charger les zones" />;
```

#### Complexe (Enum Status)

```typescript
// Pour opérations multi-étapes : status enum
type FeedbackStatus = 'idle' | 'loading' | 'success' | 'error';

const [status, setStatus] = useState<FeedbackStatus>('idle');

// Transitions : idle → loading → success|error → idle
```

#### Skeleton UI (PAS de spinners)

```typescript
// ✅ Skeleton loading (meilleure UX, évite layout shift)
function ZonesSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
}

// ❌ Éviter : spinner générique seul (layout instable)
```

---

### Pattern 7 : Tests

#### Structure Tests (Miroir `/src`)

```
tests/
├── unit/
│   ├── lib/
│   │   ├── db/
│   │   │   └── queries.test.ts   # Tests requêtes DB
│   │   └── validations/
│   │       └── schemas.test.ts   # Tests Zod schemas
│   └── hooks/
│       ├── useZones.test.ts
│       └── useSearch.test.ts
└── integration/
    └── api/
        ├── zones.test.ts         # Tests API routes
        ├── search.test.ts
        └── feedback.test.ts
```

#### Convention Nommage Tests

```typescript
// Format : describe(composant) > it('should ...')
describe('ZoneSearchParamsSchema', () => {
  it('should validate valid bounds string', () => { ... });
  it('should reject invalid bounds format', () => { ... });
  it('should coerce zoom to number', () => { ... });
});

// Pas de : test('it works'), test('test 1')
```

#### Priorité Tests

1. **Priorité Haute** : Zod schemas, DB queries utilitaires, API validation
2. **Priorité Moyenne** : Custom hooks (useZones, useSearch), useReducer
3. **Priorité Basse** : UI components (snapshot tests seulement)

---

### Pattern 8 : Accessibilité (RGAA 4.1 AA)

#### Règles Systématiques

```typescript
// 1. Boutons interactifs : aria-label si pas de texte visible
<button
  onClick={handleClose}
  aria-label="Fermer le détail de la zone"
  className="min-h-[44px] min-w-[44px]"  // Touch target WCAG 2.5.5
>
  <X aria-hidden="true" />
</button>

// 2. Images/icônes décoratives : aria-hidden
<MapPin aria-hidden="true" />    // ✅ décoration

// 3. Contenu dynamique : aria-live
<div aria-live="polite" aria-atomic="true">
  {searchResults.length > 0 && `${searchResults.length} résultats trouvés`}
</div>

// 4. Carte MapLibre : alternative textuelle cachée
<section aria-label="Carte des zones sans chasse">
  <div ref={mapRef} />
  <ul className="sr-only" aria-label="Liste des zones visibles">
    {visibleZones.map(zone => (
      <li key={zone.id}>{zone.nom} - {zone.typeProtection}</li>
    ))}
  </ul>
</section>
```

#### Palette Validée (Contrastes WCAG AA)

| Couleur                                | Usage            | Ratio                |
| -------------------------------------- | ---------------- | -------------------- |
| `#4a9d7f` (zones) sur fond blanc       | Zones carte      | ≥ 3:1 (UI component) |
| `#1f6b51` (texte vert foncé) sur blanc | Labels           | ≥ 7:1 (AAA)          |
| `text-gray-900` sur blanc              | Corps de texte   | ≥ 19:1 (AAA)         |
| `text-gray-600` sur blanc              | Texte secondaire | ≥ 5.9:1 (AA)         |

---

### Anti-Patterns à Éviter

| ❌ Anti-Pattern                                | ✅ Pattern Correct                           |
| ---------------------------------------------- | -------------------------------------------- |
| Import `drizzle-orm` dans composants           | Via `lib/db/queries.ts` uniquement           |
| `useContext(MapStateContext)` direct           | Via `useMapState()` hook                     |
| Mutation state dans reducer                    | Immutable spread `{ ...state }`              |
| Response API `{ data: {...}, error: null }`    | Réponse directe `{ zones: [...] }`           |
| `console.log('[debug]')` sans contexte         | `console.error('[Module] Message:')`         |
| `useState` pour state partagé entre composants | `MapContext` useReducer                      |
| Logique métier dans composants JSX             | → `hooks/` ou `lib/`                         |
| Tests co-localisés `Component.test.tsx`        | Dans `tests/` (miroir structure)             |
| Spinner loader global seul                     | Skeleton UI Tailwind                         |
| Dates timestamp milliseconds JSON              | ISO 8601 strings                             |
| Types d'action camelCase `selectZone`          | SCREAMING_SNAKE_CASE `SELECT_ZONE`           |
| `img src` externe sans alt                     | `alt="description"` ou `alt=""` si décoratif |

---

### Enforcement : Configuration Outils

#### ESLint Rules Critiques

```json
// .eslintrc.json (ajouts post-init)
{
    "rules": {
        "no-console": ["warn", {"allow": ["error", "warn", "info"]}],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": "error"
    }
}
```

#### Prettier Config

```json
// .prettierrc
{
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "es5",
    "printWidth": 100,
    "plugins": ["prettier-plugin-tailwindcss"]
}
```

**Pre-commit Hook :**

```json
// package.json
{
    "lint-staged": {
        "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
        "*.{json,md}": ["prettier --write"]
    }
}
```

---

**Step 5 Complete.** Patterns d'implémentation documentés — 12 conflits identifiés et résolus avec règles univoques.

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

_Les sections suivantes seront complétées au fur et à mesure des étapes du workflow._
