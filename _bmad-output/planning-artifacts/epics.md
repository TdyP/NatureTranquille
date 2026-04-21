---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-02-add-epic-7-analytics']
inputDocuments:
    - '_bmad-output/planning-artifacts/prd.md'
    - '_bmad-output/planning-artifacts/architecture.md'
    - '_bmad-output/planning-artifacts/ux-design-specification.md'
---

# NatureTranquille - Epic Breakdown

## Overview

Ce document fournit la décomposition complète en epics et stories pour NatureTranquille, transformant les exigences du PRD, de l'UX Design et de l'Architecture en stories implémentables.

## Requirements Inventory

### Functional Requirements

**FR1** : Les utilisateurs peuvent visualiser une carte interactive de la France avec zones sans chasse affichées distinctement

**FR2** : Les utilisateurs peuvent zoomer et déplacer la carte pour explorer différentes régions géographiques

**FR3** : Les utilisateurs peuvent identifier visuellement les zones sans chasse (différenciation claire zone protégée vs zone non couverte)

**FR4** : Les utilisateurs peuvent utiliser leur géolocalisation pour centrer automatiquement la carte sur leur position actuelle

**FR5** : La carte s'affiche de manière responsive sur tous appareils (mobile, tablette, desktop) avec interface adaptée à la taille d'écran

**FR6** : Les utilisateurs peuvent rechercher une zone géographique par nom de ville

**FR7** : Les utilisateurs peuvent rechercher une zone géographique par code postal

**FR8** : Les utilisateurs peuvent rechercher une zone géographique par département

**FR9** : Le système propose des suggestions automatiques pendant la saisie de recherche (autocomplete)

**FR10** : La carte se centre et zoome automatiquement sur la zone géographique recherchée

**FR11** : Les utilisateurs peuvent sélectionner une zone sans chasse affichée sur la carte pour consulter ses détails

**FR12** : Les détails d'une zone incluent : nom de la zone, type de protection, gestionnaire, date de mise à jour des données

**FR13** : Les détails d'une zone incluent la source officielle des données (nom de la source et URL si disponible)

**FR14** : Les utilisateurs peuvent consulter la page "Sources de données" listant toutes les sources intégrées avec leur nom, URL, licence et date dernière mise à jour

**FR15** : Les utilisateurs reçoivent un avertissement clair lors de leur première visite expliquant les limites des données (non-exhaustivité, couverture partielle)

**FR16** : Les utilisateurs peuvent consulter une page "À propos" décrivant la mission, le contexte et les contacts du projet

**FR17** : Les utilisateurs peuvent signaler une erreur sur une zone affichée (via email ou formulaire simple)

**FR18** : Les utilisateurs peuvent suggérer une amélioration du site (via email ou formulaire simple)

**FR19** : Les utilisateurs peuvent proposer une nouvelle source de données à intégrer

**FR20** : Les utilisateurs reçoivent une confirmation que leur signalement a été reçu

**FR21** : Les utilisateurs peuvent naviguer entièrement sur le site en utilisant uniquement le clavier (sans souris)

**FR22** : Les contrôles de la carte (zoom, déplacement) sont accessibles au clavier

**FR23** : Les formulaires de recherche et feedback sont accessibles au clavier et aux lecteurs d'écran

**FR24** : Les zones interactives (zones carte, boutons, liens) indiquent clairement le focus clavier visiblement

**FR25** : Les utilisateurs avec lecteurs d'écran peuvent accéder aux informations textuelles alternatives pour tous contenus visuels

**FR26** : Les utilisateurs peuvent utiliser un "skip link" pour accéder directement à la carte sans passer par la navigation

**FR27** : Le site respecte les ratios de contraste minimum WCAG 2.1 AA pour tous les textes et éléments interactifs

**FR28** : Le site utilise une structure HTML sémantique avec landmarks ARIA pour navigation assistée

**FR29** : Les utilisateurs peuvent accéder directement à une vue de carte centrée sur un département spécifique via URL dédiée (ex: `/departements/bas-rhin`)

**FR30** : Les utilisateurs peuvent accéder directement à une vue de carte centrée sur une région via URL dédiée (ex: `/regions/grand-est`)

**FR31** : Les métadonnées de page (title, description) s'adaptent dynamiquement selon la route consultée pour optimisation SEO

**FR32** : Le site génère un sitemap XML à jour listant toutes les routes disponibles pour indexation moteurs de recherche

**FR33** : Le système peut importer des données géospatiales depuis fichiers Shapefile via scripts d'import serveur

**FR34** : Le système peut importer des données géospatiales depuis fichiers GeoJSON via scripts d'import serveur

**FR35** : Le système peut importer des données géospatiales depuis fichiers GeoPackage via scripts d'import serveur

**FR36** : Le système stocke les géométries de zones en projection WGS84 (EPSG:4326) pour compatibilité web

**FR37** : Le système associe à chaque zone un identifiant de source de données et une date de mise à jour

**FR38** : Le système peut servir les données cartographiques au format tuiles vectorielles optimisé pour performance

**FR39** : Le système peut régénérer les pages statiques périodiquement pour intégrer nouvelles données (rebuild automatique via scripts)

**FR40** : Le système intègre Umami comme outil d'analytics anonymes, sans cookies tiers, conforme RGPD, via le script de tracking ajouté au layout global Next.js

**FR41** : Le système déclenche un événement analytics custom lors de la sélection d'une adresse dans les suggestions de recherche

**FR42** : Le système déclenche un événement analytics custom lors du clic d'un utilisateur sur une zone de la carte

### NonFunctional Requirements

**NFR-PERF-1 : Temps de Chargement Initial**

- Critère : La page d'accueil (carte France entière) se charge complètement en < 2 secondes (75th percentile, connexion 3G mobile)
- Mesure : Google Lighthouse CI, métriques Core Web Vitals LCP (Largest Contentful Paint) < 2.5s
- Justification : Success Criteria défini étape 3, critique pour rétention utilisateurs mobiles

**NFR-PERF-2 : Réactivité Détails Zone**

- Critère : L'affichage des détails d'une zone (popup/sidebar) après clic sur polygone s'exécute en < 500ms
- Mesure : Tests automatiques Playwright mesurant temps entre clic et affichage contenu
- Justification : Interaction core utilisateur (Tom, Marie, Mireille), réactivité perçue critique

**NFR-PERF-3 : Recherche Géographique**

- Critère : La recherche par ville/code postal/département + zoom carte s'exécute en < 1 seconde
- Mesure : Tests automatiques mesurant temps entre validation input et fin animation zoom
- Justification : Fonctionnalité critique (géoloc desktop peu fiable), alternative principale navigation

**NFR-PERF-4 : Interactivité Carte**

- Critère : Les interactions carte (zoom, pan, hover zones) maintiennent 60 FPS sur desktop, 30 FPS minimum sur mobile
- Mesure : Tests performance MapLibre GL JS, monitoring frame rate via Chrome DevTools
- Justification : Fluidité carte = expérience utilisateur core, MapLibre WebGL optimisé pour cela

**NFR-PERF-5 : Tuiles Vectorielles MVT**

- Critère : Les tuiles vectorielles MVT sont générées et servies en < 200ms par requête (backend)
- Mesure : Logs backend PostgreSQL ST_AsMVT() + temps réponse HTTP
- Justification : Performance tuiles = fluidité zoom/pan carte, cache navigateur + serveur atténue mais première requête critique

**NFR-PERF-6 : Core Web Vitals (Google)**

- Critère : LCP (Largest Contentful Paint) < 2.5s, FID (First Input Delay) < 100ms, CLS (Cumulative Layout Shift) < 0.1
- Mesure : Google Lighthouse CI intégré pipeline, seuil score Performance 90+
- Justification : SEO critique pour référencement Google, Core Web Vitals = facteur ranking

**NFR-PERF-7 : Budget Bundle JavaScript**

- Critère : Bundle JavaScript initial (hors MapLibre GL JS) < 200KB gzipped
- Mesure : Webpack Bundle Analyzer, CI/CD fail si dépassement
- Justification : Chargement mobile 3G, chaque KB compte, MapLibre déjà ~500KB donc budget serré

**NFR-A11Y-1 : Conformité RGAA 4.1 Niveau AA Minimum**

- Critère : 80%+ des critères RGAA 4.1 niveau AA respectés au lancement MVP, 100% objectif post-MVP
- Mesure : Checklist RGAA officielle auto-évaluée, audit externe si financement Phase 2
- Justification : Exigence légale civic tech France, accessibilité universelle primordiale

**NFR-A11Y-2 : Contrastes Visuels WCAG 2.1 AA**

- Critère : Texte normal ratio contraste ≥ 4.5:1, Texte large (18pt+) ratio contraste ≥ 3:1, Éléments interactifs ratio contraste ≥ 3:1
- Mesure : Outil axe DevTools (Chrome), tests automatiques axe-core CI/CD
- Justification : Lisibilité utilisateurs malvoyants, zones carte vertes doivent contraster avec fond OSM

**NFR-A11Y-3 : Navigation Clavier Complète**

- Critère : 100% des fonctionnalités (carte, recherche, zones, formulaires, modales) accessibles uniquement au clavier (sans souris)
- Mesure : Tests manuels navigation Tab, Entrée, Flèches, Échap sur tous parcours utilisateurs
- Justification : Utilisateurs handicap moteur, navigation assistive technologies

**NFR-A11Y-4 : Focus Visuel Distinct**

- Critère : Focus clavier visible avec indicateur visuel clair (outline 2px minimum, contraste ≥ 3:1)
- Mesure : Revue visuelle manuelle + tests axe-core
- Justification : Utilisateurs naviguant au clavier doivent savoir où ils sont (Mireille avec aide fils)

**NFR-A11Y-5 : Compatibilité Lecteurs d'Écran**

- Critère : Site 100% navigable et compréhensible avec lecteurs d'écran NVDA (Windows, gratuit) et JAWS
- Mesure : Tests manuels hebdomadaires NVDA pendant développement, tests JAWS si accès disponible
- Justification : Utilisateurs aveugles/malvoyants, ARIA landmarks + alternatives textuelles critiques

**NFR-A11Y-6 : Structure HTML Sémantique**

- Critère : HTML5 valide (validation W3C zéro erreur critique), landmarks ARIA (main, nav, footer) sur toutes pages
- Mesure : Validation W3C automatique CI/CD, tests axe-core ARIA
- Justification : Navigation assistive technologies repose sur structure sémantique correcte

**NFR-A11Y-7 : ARIA Live Regions**

- Critère : Résultats recherche dynamiques annoncés via ARIA live regions (lecteurs écran informés changements)
- Mesure : Tests NVDA vérifiant annonces vocales lors recherche/zoom
- Justification : Feedback auditif pour utilisateurs aveugles ("5 zones trouvées")

**NFR-REL-1 : Disponibilité Service (Uptime)**

- Critère : Site disponible 98%+ du temps (uptime mensuel), soit ~14h downtime max/mois
- Mesure : Monitoring UptimeRobot (gratuit) ou StatusCake, alertes email si indisponibilité > 5min
- Justification : Site informationnel (pas critique comme urgences), mais downtime prolongé frustre utilisateurs saison chasse

**NFR-REL-2 : Gestion Dégradation Gracieuse**

- Critère : En cas de panne géolocalisation ou recherche géographique, site reste utilisable avec navigation carte manuelle
- Mesure : Tests manuels simulation pannes (Nominatim indisponible, géoloc refusée)
- Justification : Dépendances externes (Nominatim OSM) peuvent échouer, fallback nécessaire

**NFR-REL-3 : Messages Erreur Clairs**

- Critère : Erreurs utilisateurs (recherche échouée, zone non chargée) affichent messages explicites non techniques avec action suggérée
- Mesure : Revue UX de tous messages erreur, tests utilisateurs réels
- Justification : Transparence, utilisateurs non-tech doivent comprendre problème ("Ville introuvable, essayez code postal")

**NFR-REL-4 : Récupération Automatique**

- Critère : En cas d'échec requête temporaire (timeout tuiles MVT), système retente automatiquement 1-2 fois avant afficher erreur
- Mesure : Tests simulation latence/timeouts réseau
- Justification : Réseaux mobiles instables, retry automatique améliore expérience sans intervention utilisateur

**NFR-REL-5 : Logs et Monitoring**

- Critère : Erreurs backend et frontend loguées centralement avec stack traces, monitoring erreurs via Sentry (gratuit tier) ou logs serveur
- Mesure : Dashboard Sentry ou logs agrégés accessibles, alertes si taux erreur > 5%
- Justification : Débogage rapide post-lancement, identification bugs avant signalements utilisateurs massifs

**NFR-INT-1 : Geocodage Nominatim (OpenStreetMap)**

- Critère : Service géocodage Nominatim public OSM utilisé avec rate limiting respecté (1 requête/seconde max)
- Mesure : Throttling côté client (debounce input 300ms), logs requêtes
- Justification : Nominatim gratuit mais limité, abus = bannissement IP, respect fair use

**NFR-INT-2 : Fallback Géocodage**

- Critère : Si Nominatim indisponible, fallback vers base locale codes postaux (table PostgreSQL) pour recherche basique
- Mesure : Tests simulation panne Nominatim, vérification fallback fonctionnel
- Justification : Résilience, recherche par code postal/département possible hors ligne avec données locales

**NFR-INT-3 : Fond de Carte OpenStreetMap**

- Critère : Tuiles raster OSM chargées depuis serveurs publics OSM avec cache navigateur agressif (7 jours)
- Mesure : Headers HTTP cache vérifiés, monitoring temps chargement tiles
- Justification : OSM gratuit et fiable, cache réduit charge serveurs OSM (bonne citoyenneté)

**NFR-INT-4 : Email SMTP Feedback**

- Critère : Formulaires feedback envoient emails via SMTP simple (serveur mail Scalingo/CleverCloud ou SMTP public type Brevo gratuit)
- Mesure : Tests envoi emails réels, vérification réception
- Justification : Pas de système tickets complexe au MVP, email suffit, SMTP doit être fiable

**NFR-INT-5 : Sources Données Externes (RNCFS, data.gouv.fr)**

- Critère : Import données depuis sources externes (Shapefile, GeoJSON) validé géospatialement avant intégration (géométries valides, projections correctes)
- Mesure : Scripts validation PostGIS (ST_IsValid(), ST_SRID()) lors import
- Justification : Données tierces peuvent être corrompues, validation évite bugs affichage carte

**NFR-MAINT-1 : Standards Code et Linting**

- Critère : Code TypeScript/JavaScript respect ESLint + Prettier configurés strictement, zéro warning au commit
- Mesure : Pre-commit hooks (Husky), CI/CD fail si lint errors
- Justification : Solo dev ou petite équipe, cohérence code critique pour maintenabilité long terme

**NFR-MAINT-2 : Couverture Tests Unitaires**

- Critère : 60%+ couverture code par tests unitaires (Vitest) sur logique métier (utils, helpers, composants critiques)
- Mesure : Coverage reports Vitest, CI/CD affiche pourcentage
- Justification : Tests préviennent régressions lors ajouts features, 60% = équilibre pragmatique MVP (pas 100% sur-ingénierie)

**NFR-MAINT-3 : Tests End-to-End (E2E)**

- Critère : User journeys critiques (Tom, Marie, Mireille) couverts par tests E2E Playwright (3-5 scénarios minimum)
- Mesure : Tests E2E exécutés CI/CD avant déploiement, fail si scénario échoue
- Justification : Garantit parcours complets fonctionnels (recherche → zoom → détails zone), détecte bugs intégration

**NFR-MAINT-4 : Documentation Code**

- Critère : Fonctions complexes (ex: génération tuiles MVT, transformations géospatiales) documentées via JSDoc/TSDoc
- Mesure : Revue code manuelle, exigence PR (pull requests)
- Justification : PostGIS/géospatial = domaine technique, documentation aide onboarding futurs contributeurs

**NFR-MAINT-5 : README et Documentation Setup**

- Critère : README.md complet avec instructions setup environnement local (PostgreSQL + PostGIS, Node.js, variables env, import données)
- Mesure : Test setup depuis zéro sur machine vierge (ou Docker)
- Justification : Reproductibilité environnement, contributeurs externes ou handover futur

**NFR-MAINT-6 : Scripts Import Données Documentés**

- Critère : Scripts import Shapefile/GeoJSON documentés avec exemples dans docs/import-data.md
- Mesure : Documentation revue, tests scripts sur nouvelles sources
- Justification : Import données = processus récurrent (nouveaux départements), doit être reproductible sans friction

**NFR-MAINT-7 : Versioning Sémantique**

- Critère : Releases suivent Semantic Versioning (SemVer 2.0) : MAJOR.MINOR.PATCH (ex: 1.0.0 MVP, 1.1.0 Phase 2)
- Mesure : Tags Git, CHANGELOG.md mis à jour chaque release
- Justification : Traçabilité versions, utilisateurs et contributeurs comprennent changements

**NFR-SEC-1 : HTTPS Obligatoire**

- Critère : 100% trafic HTTPS (TLS 1.2+), redirection automatique HTTP → HTTPS
- Mesure : Tests HTTPS partout, certificat Let's Encrypt auto-renouvelé
- Justification : Exigence RGPD, sécurité formulaires feedback, SEO Google (HTTPS = ranking factor)

**NFR-SEC-2 : Protection CSRF (Cross-Site Request Forgery)**

- Critère : Formulaires feedback protégés par tokens CSRF (Next.js built-in ou bibliothèque)
- Mesure : Tests sécurité tentatives CSRF, vérification tokens
- Justification : Évite soumissions formulaires malveillantes depuis sites tiers

**NFR-SEC-3 : Protection Spam Formulaires**

- Critère : Formulaires feedback protégés par honeypot (champ invisible) ou CAPTCHA simple (hCaptcha gratuit, accessible)
- Mesure : Tests soumissions automatiques bloquées
- Justification : Évite spam bots, honeypot = invisible utilisateurs légitimes, hCaptcha RGPD-friendly

**NFR-SEC-4 : Sanitization Inputs Utilisateur**

- Critère : Inputs formulaires (recherche, feedback) sanitizés contre injections XSS (Cross-Site Scripting)
- Mesure : Zod validation + bibliothèque sanitization (DOMPurify côté client)
- Justification : Évite injections scripts malveillants via champs texte

**NFR-SEC-5 : Pas de Stockage Données Personnelles**

- Critère : Zéro donnée personnelle stockée sauf emails volontaires feedback (supprimés après traitement ou 1 an max)
- Mesure : Revue base données, audit RGPD
- Justification : Conformité RGPD par design, pas de comptes = pas de données à protéger

**NFR-SEC-6 : Headers Sécurité HTTP**

- Critère : Headers HTTP sécurité configurés (X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Content-Security-Policy basique, Strict-Transport-Security HSTS)
- Mesure : Tests SecurityHeaders.com, Mozilla Observatory
- Justification : Durcissement sécurité standard, protection clickjacking/MIME sniffing

**NFR-SEC-7 : Dépendances À Jour**

- Critère : Dépendances npm mises à jour mensuellement, vulnérabilités critiques patchées < 48h
- Mesure : npm audit CI/CD, Dependabot/Renovate alerts GitHub
- Justification : Vulnérabilités dépendances = vecteur attaque fréquent, veille sécurité nécessaire

### Additional Requirements

**Architecture Technique :**

- Stack Frontend : Next.js 14+ App Router, React, TypeScript, MapLibre GL JS 4.x, Tailwind CSS + shadcn/ui
- Stack Backend : Node.js/Express (décision finale à Step 3)
- Base de données : PostgreSQL 15+ avec PostGIS 3.4+
- Tile Server : pg_tileserv, t-rex, ou tileserver-gl (décision à Step 4)
- Format Tiles : MVT (Mapbox Vector Tiles)
- Geocoding : API Adresse data.gouv.fr (gratuit, 50 req/s)
- Hébergement : Scalingo ou CleverCloud (France, conformité RGPD)

**Starter Template :**

- create-next-app (Next.js Official CLI) avec TypeScript, Tailwind CSS, App Router, ESLint

**Design System :**

- Tailwind CSS + shadcn/ui (Radix UI primitives pour accessibilité native)
- Palette de couleurs validée WCAG AA
- Composants UI accessibles par défaut

**Périmètre Géographique MVP :**

- 2-3 départements Grand Est : Bas-Rhin (67), Haut-Rhin (68), Moselle (57) si données accessibles
- 15-30 zones sans chasse référencées au total

**Sources de Données MVP :**

- RNCFS (Réseau National Chasse Faune Sauvage) - ONF - Licence Ouverte v2.0
- Réserves Naturelles Nationales - data.gouv.fr - Licence Ouverte v2.0

### FR Coverage Map

**Exigences Fonctionnelles (FR1-FR20, FR29-FR39) :**

FR1 → Epic 1 (visualiser carte zones sans chasse)
FR2 → Epic 1 (zoomer/déplacer carte)
FR3 → Epic 1 (identifier visuellement zones)
FR4 → Epic 2 (géolocalisation utilisateur)
FR5 → Epic 1 (responsive multi-device)
FR6 → Epic 2 (recherche par ville)
FR7 → Epic 2 (recherche par code postal)
FR8 → Epic 2 (recherche par département)
FR9 → Epic 2 (autocomplete suggestions)
FR10 → Epic 2 (zoom automatique résultat)
FR11 → Epic 3 (sélectionner zone carte)
FR12 → Epic 3 (afficher détails zone)
FR13 → Epic 3 (source données zone)
FR14 → Epic 4 (page Sources de données)
FR15 → Epic 4 (avertissement première visite)
FR16 → Epic 4 (page À propos)
FR17 → Epic 5 (signaler erreur zone)
FR18 → Epic 5 (suggérer amélioration)
FR19 → Epic 5 (proposer source données)
FR20 → Epic 5 (confirmation signalement)
FR29 → Epic 6 (URL département direct)
FR30 → Epic 6 (URL région direct)
FR31 → Epic 6 (métadonnées SEO dynamiques)
FR32 → Epic 6 (sitemap XML génération)
FR33 → Epic 0 (import Shapefile)
FR34 → Epic 0 (import GeoJSON)
FR35 → Epic 0 (import GeoPackage)
FR36 → Epic 0 (stockage projection WGS84)
FR37 → Epic 0 (métadonnées source/date)
FR38 → Epic 1 (tuiles vectorielles MVT)
FR39 → Epic 0 (rebuild pages statiques)
FR40 → Epic 7 (intégration Umami analytics)
FR41 → Epic 7 (événement custom sélection adresse)
FR42 → Epic 7 (événement custom clic zone)

**Exigences Accessibilité (FR21-FR28) - TRANSVERSALES :**

Ces exigences ne sont pas assignées à un epic spécifique mais sont **intégrées dans les Acceptance Criteria de chaque story** concernant l'interface utilisateur :

FR21 → Navigation clavier complète (toutes stories UI)
FR22 → Contrôles carte accessibles clavier (Epic 1)
FR23 → Formulaires accessibles clavier + lecteurs écran (Epic 2, Epic 5)
FR24 → Focus clavier visible (toutes stories UI)
FR25 → Alternatives textuelles lecteurs écran (toutes stories UI)
FR26 → Skip link navigation (Epic 1, Epic 4)
FR27 → Contrastes WCAG AA (toutes stories UI)
FR28 → Structure HTML sémantique + ARIA (toutes stories UI)

**Couverture totale : 42/42 FRs** ✅

## Epic List

### Epic 0: Project Foundation & Local Development

**Valeur Utilisateur (Équipe Dev)** : L'équipe de développement peut exécuter l'application complète en local avec données pilotes et commencer le développement des features.

**User Story** : En tant que développeur, je veux pouvoir lancer l'application complète en local (`npm run dev`) et voir la carte afficher les zones sans chasse du Grand Est, afin de pouvoir développer et tester les nouvelles fonctionnalités.

**FRs couverts** : FR33, FR34, FR35, FR36, FR37, FR39 + Architecture requirements (Next.js setup, PostGIS, tuiles MVT)

**Outcome clé** :

- `npm run dev` démarre frontend Next.js + backend API
- PostgreSQL + PostGIS fonctionnel en local
- Dataset pilote geospatial importe (15-30 zones)
- Carte affiche zones pilotes Bas-Rhin, Haut-Rhin, Moselle
- Documentation setup complète dans README.md

**Notes techniques** :

- Starter : create-next-app (Next.js 14+ App Router, TypeScript, Tailwind)
- BDD locale : PostgreSQL 15+ avec PostGIS 3.4+
- Scripts import données GDAL/OGR (Shapefile → GeoJSON → PostGIS)
- Pipeline génération tuiles MVT fonctionnel

### Epic 1: Core Interactive Map Experience

**Valeur Utilisateur** : Les utilisateurs peuvent visualiser et explorer les zones sans chasse sur une carte interactive fluide et responsive.

**User Story** : En tant que Tom/Marie/Mireille, je veux ouvrir le site et voir immédiatement une carte interactive avec les zones sans chasse affichées en vert, afin de repérer rapidement les zones près de chez moi.

**FRs couverts** : FR1, FR2, FR3, FR5, FR38

**Outcome clé** :

- Carte MapLibre GL JS charge en < 2s (75th percentile 3G)
- Zones sans chasse affichées clairement (polygones verts)
- Navigation fluide : zoom, pan, rotation 60 FPS desktop, 30 FPS mobile
- Responsive : mobile plein écran, tablet/desktop avec sidebar
- Tuiles vectorielles MVT optimisées pour performance multi-échelle

**Accessibilité intégrée** :

- Navigation clavier carte (touches fléchées zoom/pan, Tab)
- Contrastes zones vertes/fond OSM validés WCAG AA (≥ 3:1)
- Structure HTML sémantique avec landmarks ARIA
- Skip link "Aller à la carte" fonctionnel

**Notes techniques** :

- MapLibre GL JS 4.x avec tuiles MVT depuis PostGIS
- Simplification géométrique adaptative (Douglas-Peucker)
- Cache tuiles navigateur + serveur
- Composants shadcn/ui (Radix primitives accessibilité native)

### Epic 2: Geographic Search & Navigation

**Valeur Utilisateur** : Les utilisateurs peuvent trouver rapidement des zones sans chasse près d'un lieu spécifique en recherchant par ville, code postal ou département.

**User Story** : En tant que Tom, je veux rechercher "Strasbourg" dans une barre de recherche et voir la carte zoomer automatiquement sur les zones sans chasse proches, afin de planifier ma sortie du dimanche sans perdre de temps.

**FRs couverts** : FR4, FR6, FR7, FR8, FR9, FR10

**Outcome clé** :

- Barre recherche avec autocomplete (ville, code postal, département)
- Zoom automatique sur résultat sélectionné (< 1s total)
- Géolocalisation utilisateur optionnelle (permission navigateur)
- Fallback gracieux si géoloc refusée ou recherche échoue
- API Adresse data.gouv.fr (gratuit, 50 req/s)

**Accessibilité intégrée** :

- Recherche accessible clavier complet (Tab, Enter, Flèches autocomplete)
- ARIA live regions annoncent résultats ("5 suggestions disponibles")
- Labels explicites formulaire (associés `<label>` + `for`)
- Focus visible sur input et suggestions (outline 2px, contraste ≥ 3:1)

**Notes techniques** :

- Debounce input 300ms (respect rate limiting Nominatim)
- Fallback base locale codes postaux si API indisponible
- Cache résultats fréquents côté client (sessionStorage)

### Epic 3: Zone Information & Details

**Valeur Utilisateur** : Les utilisateurs peuvent obtenir des informations complètes et fiables sur chaque zone pour valider leur choix de destination.

**User Story** : En tant que Marie, je veux cliquer sur une zone verte et voir immédiatement ses détails (nom, type protection, gestionnaire, date mise à jour), afin de valider que c'est bien une zone sans chasse fiable avant de planifier mon affût photo.

**FRs couverts** : FR11, FR12, FR13

**Outcome clé** :

- Clic/tap zone → popup/sidebar détails (< 500ms)
- Informations affichées : nom zone, type protection (RNCFS/Réserve Naturelle), gestionnaire, date MAJ données, source
- Desktop : sidebar 400px slide-in
- Mobile : bottom sheet 40-80vh swipe-dismissable
- Métadonnées embarquées dans tuiles MVT (pas d'API call)

**Accessibilité intégrée** :

- Popup accessible clavier (Esc pour fermer, Tab navigation interne)
- Focus trap dans popup (Tab ne sort pas tant qu'ouvert)
- ARIA roles appropriés (`role="dialog"`, `aria-labelledby`)
- Annonce lecteur écran ouverture/fermeture popup
- Bouton fermeture 44px minimum (tactile WCAG)

**Notes techniques** :

- Composant shadcn/ui Dialog (Radix accessible par défaut)
- Données zone incluses dans properties tuiles MVT
- Gestion état React (zustand ou context) pour zone sélectionnée

### Epic 4: Transparency & Documentation

**Valeur Utilisateur** : Les utilisateurs comprennent les limites des données, font confiance à la source, et savent où trouver de l'aide.

**User Story** : En tant que Tom, je veux comprendre clairement que la carte affiche seulement les zones connues et que l'absence de zone ne signifie pas que la chasse est autorisée partout, afin de ne pas avoir de faux sentiment de sécurité.

**FRs couverts** : FR14, FR15, FR16

**Outcome clé** :

- Modal disclaimer première visite (localStorage mémorise)
- Page `/sources` : liste sources intégrées, départements couverts, roadmap expansion, méthodologie validation
- Page `/a-propos` : mission, porteur projet, mentions légales, contact
- Disclaimer header discret mais visible (bandeau ou bouton ℹ️)
- Transparence radicale comme stratégie de confiance

**Accessibilité intégrée** :

- Pages statiques conformes RGAA 4.1 AA
- Navigation claire, hiérarchie titres logique (H1 → H2 → H3)
- Structure landmarks ARIA (`<main>`, `<nav>`, `<footer>`)
- Liens explicites (pas "cliquez ici", mais "Consultez nos sources de données")

**Notes techniques** :

- Pages Next.js statiques SSG (SEO optimisé)
- Modal disclaimer : shadcn/ui AlertDialog
- Markdown pour contenu pages (facilite édition)

### Epic 5: User Feedback & Community

**Valeur Utilisateur** : Les utilisateurs peuvent contribuer à l'amélioration des données et du site en signalant erreurs ou suggérant améliorations.

**User Story** : En tant que Mireille, je veux signaler qu'une zone affichée comme sans chasse a en réalité une barrière ONF verrouillée, afin que l'équipe corrige l'information et que je reçoive confirmation de ma contribution.

**FRs couverts** : FR17, FR18, FR19, FR20

**Outcome clé** :

- Formulaire feedback simple (type signalement, localisation, description, email optionnel)
- Toast/notification confirmation envoi ("Signalement reçu, merci !")
- Email envoyé SMTP (serveur mail Scalingo/Brevo gratuit)
- Pas de système tickets complexe au MVP (traitement manuel)
- Stockage signalements PostgreSQL (référence future)

**Accessibilité intégrée** :

- Formulaire accessible clavier + lecteurs écran
- Labels explicites tous champs (`<label for="description">`)
- Validation erreurs annoncées (ARIA live regions)
- Messages erreur clairs et actionnables ("Email invalide, vérifiez le format")
- Protection spam : honeypot (champ invisible) ou hCaptcha accessible

**Notes techniques** :

- Validation Zod + React Hook Form
- CSRF protection (Next.js built-in tokens)
- Sanitization inputs (DOMPurify XSS prevention)
- Rate limiting formulaire (1 soumission/minute/IP)

### Epic 6: SEO & Discoverability

**Valeur Utilisateur** : Les utilisateurs trouvent facilement le site via recherche Google pour leur département ou région, et accèdent directement à la vue qui les intéresse.

**User Story** : En tant que Tom, je veux que Google me propose un lien direct "Zones sans chasse Bas-Rhin" quand je cherche ça, et que ce lien m'amène directement sur la carte zoomée sur le Bas-Rhin.

**FRs couverts** : FR29, FR30, FR31, FR32

**Outcome clé** :

- Routes statiques SSG : `/` (France), `/departements/[slug]`, `/regions/[slug]`
- Métadonnées SEO dynamiques par route (`<title>`, `<meta description>`, OpenGraph)
- Sitemap XML généré automatiquement (tous départements couverts)
- Deep linking : URL département → carte auto-zoomée
- Schema.org structured data (WebApplication type)

**Accessibilité intégrée** :

- Métadonnées sémantiques correctes (`lang="fr"`, balises meta)
- Landmarks ARIA cohérents sur toutes pages
- Skip links fonctionnels (bypass navigation)
- Titres pages descriptifs et uniques

**Notes techniques** :

- Next.js generateStaticParams (départements depuis PostGIS)
- Incremental Static Regeneration (ISR) optionnel Phase 2
- Robots.txt + sitemap.xml build-time
- Google Search Console monitoring

### Epic 7: Analytics & Tracking Umami

**Valeur Utilisateur** : L'équipe produit dispose de données analytiques anonymes et RGPD-conformes pour mesurer l'usage de la carte, comprendre les comportements de recherche et améliorer le produit en prioritisant les fonctionnalités les plus utilisées.

**User Story** : En tant que porteur du projet, je veux savoir combien d'utilisateurs sélectionnent une adresse dans l'autocomplete et cliquent sur des zones, afin de prioriser les améliorations produit sur les fonctionnalités réellement utilisées.

**FRs couverts** : FR40, FR41, FR42

**Outcome clé** :

- Script Umami intégré dans le layout global Next.js (`app/layout.tsx`)
- Tracking anonyme activé dès le chargement de la page (aucun cookie, aucune donnée personnelle)
- 2 événements customs instrumentés : `select_address`, `click_zone`
- Variable d'environnement `NEXT_PUBLIC_UMAMI_WEBSITE_ID` documentée dans `.env.example`
- RGPD-conforme : pas de cookies tiers, hébergement UE, pas de données personnelles
- Tracking désactivé en environnement de développement (évite pollution des stats)

**Notes techniques** :

- Script Umami ajouté via `next/script` (strategy `afterInteractive`) dans `app/layout.tsx`
- Type declaration `window.umami` dans `types/umami.d.ts` pour TypeScript strict
- Umami self-hosted (Docker) ou Umami Cloud selon infrastructure déployée
- `NEXT_PUBLIC_UMAMI_SCRIPT_URL` configurable pour pointer vers instance self-hosted

---

**Total : 8 Epics (Epic 0 → Epic 7)**

**Couverture FRs : 42/42** ✅

**Accessibilité : Intégrée dans chaque epic via Acceptance Criteria des stories**

---

---

# Detailed User Stories

## Epic 0: Project Foundation & Local Development

### Story 0.1: Configuration Docker Compose pour développement local avec hot reload

**User Story**
En tant que **développeur**, je veux lancer toute la stack (frontend Next.js, backend API, PostgreSQL + PostGIS) avec `docker compose up -d` et bénéficier du hot reload, afin de développer efficacement sans installation manuelle de dépendances.

**Acceptance Criteria**

**GIVEN** : Le développeur clone le repository et a Docker + Docker Compose installés
**WHEN** : Le développeur exécute `docker compose up -d`
**THEN** :

- 3 containers démarrent : `frontend`, `backend`, `db`
- Frontend Next.js accessible sur `http://localhost:3000` avec hot reload actif
- Backend API accessible sur `http://localhost:4000` avec hot reload actif
- PostgreSQL + PostGIS accessible sur `localhost:5432` (db:`naturetranquille`, user:`postgres`)
- Les volumes Docker montent correctement les dossiers source pour déclencher hot reload sur modification fichiers
- `docker compose logs -f` affiche les logs temps réel des 3 services

**AND** : Un fichier `.env.example` documente toutes les variables d'environnement nécessaires
**AND** : Le README.md contient les instructions de démarrage rapide Docker

**Accessibility Integration**
N/A (infrastructure setup)

**Performance & Technical Acceptance**

- Frontend Next.js démarre en < 30s (première fois avec install dépendances)
- Hot reload frontend < 2s après modification fichier
- Backend démarre en < 10s
- PostgreSQL ready en < 5s

---

### Story 0.1b: Migrations backend pour schema PostGIS

**User Story**
En tant que **developpeur backend**, je veux gerer la structure de base de donnees via des migrations versionnees, afin de garantir un schema coherent et reproductible sur tous les environnements.

**Acceptance Criteria**

**GIVEN** : Le backend est configure avec un outil de migration SQL (ou ORM)
**WHEN** : Le developpeur execute les migrations backend
**THEN** :

- La table `zones` est creee dans le schema `public`
- Les colonnes structurelles sont creees : `id`, `nom`, `type_protection`, `gestionnaire`, `source`, `date_maj`, `geometry` (type `MULTIPOLYGON`, SRID 4326)
- Les index necessaires sont crees par migration backend : index spatial GiST sur `geometry` et index sur `type_protection`
- Les migrations sont idempotentes, versionnees, et executables de facon deterministe en local et CI
- Aucun script d'import de donnees n'effectue de `CREATE/ALTER/DROP` sur la structure

**AND** : Les migrations sont stockees dans le backend et documentees
**AND** : Une commande unique permet d'appliquer les migrations sur une base vide

**Accessibility Integration**
N/A (infrastructure backend)

**Performance & Technical Acceptance**

- Application des migrations < 30s sur base vide
- Verification schema : `\d+ zones` confirme colonnes + index attendus
- Le workflow CI echoue si une migration est invalide

---

### Story 0.2: Import generique des donnees geospatiales dans PostGIS

**User Story**
En tant que **developpeur**, je veux importer les donnees geospatiales demandees dans PostgreSQL/PostGIS via un script automatise, afin d'alimenter le dataset de zones sans modifier la structure de base.

**Acceptance Criteria**

**GIVEN** : PostgreSQL + PostGIS est demarre et accessible
**AND** : Les migrations backend sont appliquees (Story 0.1b complete)
**AND** : Les fichiers de donnees (Shapefile/GeoJSON/GeoPackage) a ingerer sont places dans `/data/raw/`
**WHEN** : Le developpeur execute le script d'import avec les parametres cibles
**THEN** :

- Le script ingere toutes les donnees explicitement demandees par configuration/arguments
- Le script n'utilise aucun hardcode de territoire ou de source metier
- Les donnees sont ecrites dans la table `zones` (schema `public`)
- Le script n'execute aucune operation DDL (`CREATE TABLE`, `ALTER TABLE`, `DROP`, `CREATE INDEX`)
- Le script valide les geometries avec `ST_IsValid()` et corrige avec `ST_MakeValid()` si necessaire
- Le log final affiche le detail des imports executes et le total des zones ecrites

**AND** : Les donnees sont normalisees (projection WGS84, geometries valides)
**AND** : Script gere les erreurs gracieusement (fichier absent, geometrie invalide)

**Accessibility Integration**
N/A (data pipeline)

**Performance & Technical Acceptance**

- Import complet < 60s pour ~50-100 zones (dataset pilote)
- Requete test `SELECT COUNT(*) FROM zones WHERE ST_Intersects(geometry, ST_MakeEnvelope(...))` < 50ms
- Utilisation GDAL/OGR (`ogr2ogr`) pour transformation formats

---

### Story 0.3: Pipeline de génération des tuiles vectorielles MVT depuis PostGIS

**User Story**
En tant que **développeur**, je veux générer et servir dynamiquement des tuiles vectorielles MVT depuis PostgreSQL/PostGIS, afin que le frontend MapLibre puisse afficher les zones sans chasse de manière performante à tous les niveaux de zoom.

**Acceptance Criteria**

**GIVEN** : Les donnees zones sont importees dans PostGIS (Story 0.2 complete)
**WHEN** : Le backend reçoit une requête tuile MVT `GET /tiles/{z}/{x}/{y}.mvt`
**THEN** :

- Le backend exécute une requête SQL utilisant `ST_AsMVT()` avec `ST_TileEnvelope()` pour générer la tuile
- Les géométries sont simplifiées selon le niveau de zoom :
    - Zoom 0-6 : `ST_Simplify(geometry, 0.01)` (vue France entière)
    - Zoom 7-10 : `ST_Simplify(geometry, 0.001)` (vue régionale)
    - Zoom 11+ : Pas de simplification (vue détaillée)
- Les propriétés suivantes sont incluses dans la tuile : `id`, `nom`, `type_protection`, `gestionnaire`, `date_maj`, `source`
- Réponse HTTP avec headers : `Content-Type: application/vnd.mapbox-vector-tile`, `Cache-Control: public, max-age=86400`
- Tuile vide retourne 204 No Content (pas d'erreur)

**AND** : Cache tuiles côté serveur (Redis ou mémoire) pour éviter recalculs
**AND** : Logs affichent temps génération tuile (objectif < 100ms)

**Accessibility Integration**
N/A (API tuiles)

**Performance & Technical Acceptance**

- Génération tuile < 100ms (99th percentile)
- Taille tuile moyenne < 50KB (après compression gzip)
- Query optimization : index spatial utilisé (`EXPLAIN ANALYZE` confirme)
- Cache hit rate ≥ 80% après quelques minutes utilisation

**Technical Notes**

- Utilisation `pg_tileserv`, `t-rex`, ou endpoint Express custom avec SQL `ST_AsMVT()`
- Validation tuiles avec `mbview` ou `mapbox-gl-inspect`

---

### Story 0.4: Documentation développeur complète (README, architecture, setup)

**User Story**
En tant que **nouveau développeur rejoignant le projet**, je veux trouver toute la documentation nécessaire dans le README et le dossier `/docs`, afin de comprendre l'architecture, démarrer l'environnement local et contribuer efficacement en < 30 minutes.

**Acceptance Criteria**

**GIVEN** : Le développeur clone le repository
**WHEN** : Le développeur ouvre `README.md`
**THEN** :

- Section **Quick Start** décrit les prérequis (Docker, Docker Compose) et commande unique `docker compose up -d`
- Section **Architecture** résume la stack : Next.js 14, MapLibre GL JS 4.x, PostgreSQL 15 + PostGIS 3.4, tuiles MVT
- Section **Environment Variables** liste toutes les variables avec exemples (référence `.env.example`)
- Section **Data Import** explique comment placer les données dans `/data/raw/` et exécuter `./scripts/import-data.sh`
- Section **Development Workflow** décrit hot reload, logs, rebuild containers
- Section **Testing** (placeholder Phase 1, détaillé Phase 2)
- Liens vers `/docs/architecture.md` pour diagrammes détaillés

**AND** : Le fichier `/docs/architecture.md` contient :

- Diagramme Mermaid des 3 containers avec flux réseau
- Schéma pipeline données (Shapefile → PostGIS → MVT → MapLibre)
- Décisions techniques majeures (pourquoi PostGIS, pourquoi MVT)

**AND** : Le fichier `.env.example` documente :

```
# Database
POSTGRES_DB=naturetranquille
POSTGRES_USER=postgres
POSTGRES_PASSWORD=changeme_production

# Backend API
API_PORT=4000
API_BASE_URL=http://localhost:4000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_MAPLIBRE_STYLE=https://demotiles.maplibre.org/style.json
```

**Accessibility Integration**

- Documentation rédigée en français clair, vocabulaire technique expliqué
- Structure Markdown sémantique (headers H1-H4 hiérarchiques)
- Code blocks avec syntaxe highlighting (langage spécifié)
- Liens explicites ("Voir l'architecture complète" au lieu de "cliquez ici")

**Performance & Technical Acceptance**

- Developer onboarding time < 30 minutes (mesure empirique avec nouveau dev)
- Tous les liens documentation valides (aucun 404)
- Diagrammes Mermaid renderisent correctement sur GitHub

---

---

## Epic 1: Core Interactive Map Experience

### Story 1.1: Intégration MapLibre GL JS avec tuiles MVT et fond de carte OSM

**User Story**
En tant que **utilisateur arrivant sur le site**, je veux voir immédiatement une carte interactive avec un fond OSM et les zones sans chasse chargées depuis les tuiles MVT, afin de commencer mon exploration sans friction.

**Acceptance Criteria**

**GIVEN** : Le développeur a complété Story 0.3 (tuiles MVT disponibles sur `/tiles/{z}/{x}/{y}.mvt`)
**WHEN** : L'utilisateur accède à `http://localhost:3000`
**THEN** :

- La carte MapLibre GL JS s'initialise avec centre France (lat: 46.2276, lng: 2.2137, zoom: 6)
- Le fond de carte OSM est chargé depuis un style MapLibre compatible (ex: `https://demotiles.maplibre.org/style.json` ou style custom)
- Une couche vectorielle affiche les zones sans chasse depuis `http://localhost:4000/tiles/{z}/{x}/{y}.mvt`
- Les contrôles standards sont actifs : zoom (+/-), rotation (N), géolocalisation (bouton GPS)
- La carte est responsive et occupe 100vh sur mobile, avec sidebar desktop (Story 1.3)

**AND** : Initialisation carte :

```javascript
const map = new maplibregl.Map({
    container: 'map',
    style: OSM_STYLE_URL,
    center: [2.2137, 46.2276],
    zoom: 6,
    attributionControl: true,
});

map.on('load', () => {
    map.addSource('zones-sans-chasse', {
        type: 'vector',
        tiles: ['http://localhost:4000/tiles/{z}/{x}/{y}.mvt'],
        maxzoom: 14,
    });

    map.addLayer({
        id: 'zones-fill',
        type: 'fill',
        source: 'zones-sans-chasse',
        'source-layer': 'zones',
        paint: {
            'fill-color': '#10b981', // Tailwind green-500
            'fill-opacity': 0.6,
        },
    });
});
```

**Accessibility Integration**

- Container carte avec `role="application"` et `aria-label="Carte interactive des zones sans chasse en France"`
- Skip link "Aller à la carte" en début de page (focus direct sur map container)
- Navigation clavier :
    - Flèches directionnelles : pan (déplacement carte)
    - `+` / `-` : zoom in/out
    - `Shift` + flèches : rotation
    - `Tab` : focus entre contrôles (zoom, géolocation)
- Focus visible sur boutons contrôles (outline 2px, contraste ≥ 3:1)

**Performance & Technical Acceptance**

- Chargement carte initial < 2s (75th percentile 3G)
- Tuiles MVT niveau zoom 6 (France) < 100KB total
- Frame rate ≥ 30 FPS sur mobile lors du pan/zoom
- Composant React carte dans `/app/components/Map.tsx` (client component avec `'use client'`)

---

### Story 1.2: Affichage visuel des zones sans chasse avec style WCAG AA

**User Story**
En tant que **Tom (déficient couleur modéré)**, je veux distinguer clairement les zones sans chasse du reste de la carte avec un contraste suffisant, même en plein soleil sur mon téléphone, afin de repérer immédiatement les zones d'intérêt.

**Acceptance Criteria**

**GIVEN** : MapLibre carte chargée avec tuiles zones (Story 1.1 complète)
**WHEN** : Les zones sans chasse s'affichent sur la carte
**THEN** :

- Polygones zones remplis couleur : `#10b981` (Tailwind green-500), opacité 0.6
- Contours polygones : stroke `#059669` (Tailwind green-600), largeur 2px
- Survol (hover) : opacité passe à 0.8, curseur change en `pointer`
- État sélectionné (clic) : contour devient `#047857` (green-700), largeur 3px, opacité 1
- Contraste fond OSM (gris/blanc) vs zones vertes : ≥ 3:1 (WCAG AA niveau graphique)
- Validation contraste avec outil axe DevTools Color Contrast Analyzer

**AND** : Légende carte affiche :

- 🟢 "Zone sans chasse identifiée"
- ⚪ "Pas de donnée (absence ≠ autorisation chasse)"

**AND** : Sur zoom très élevé (≥ 14), labels zones affichent le nom :

```javascript
map.addLayer({
    id: 'zones-label',
    type: 'symbol',
    source: 'zones-sans-chasse',
    'source-layer': 'zones',
    minzoom: 14,
    layout: {
        'text-field': ['get', 'nom'],
        'text-size': 14,
        'text-anchor': 'center',
    },
    paint: {
        'text-color': '#065f46', // green-900
        'text-halo-color': '#ffffff',
        'text-halo-width': 2,
    },
});
```

**Accessibility Integration**

- Contraste couleur/fond validé WCAG AA (≥ 3:1 pour éléments graphiques)
- Labels zones avec halo blanc (lisibilité sur OSM varié)
- Légende accessible avec `<ul>` sémantique et icônes texte alt
- Pattern fills alternatif disponible pour utilisateurs daltoniens (option settings Phase 2)

**Performance & Technical Acceptance**

- Hover state réactif < 16ms (60 FPS)
- Pas de repaint complet carte sur hover (uniquement couche zones)
- Style layers compilé côté MapLibre (pas de calcul JS par frame)

---

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

## Epic 2: Geographic Search & Navigation

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

### Story 2.2: Zoom automatique carte sur résultat sélectionné

**User Story**
En tant que **Tom**, après avoir sélectionné "Strasbourg" dans la recherche, je veux que la carte zoome automatiquement sur cette zone avec animation fluide, afin de voir immédiatement les zones sans chasse alentours.

**Acceptance Criteria**

**GIVEN** : L'utilisateur a sélectionné une suggestion de recherche (Story 2.1)
**WHEN** : L'événement `onSelectLocation(feature)` est déclenché
**THEN** :

- La carte MapLibre zoom sur la bbox (bounding box) retournée par l'API :
    ```javascript
    const bbox = feature.bbox; // [minLng, minLat, maxLng, maxLat]
    map.fitBounds(bbox, {
        padding: {top: 50, bottom: 50, left: 50, right: 50},
        maxZoom: 12,
        duration: 1000, // animation 1s
    });
    ```
- Pendant l'animation (1s), l'utilisateur peut voir la transition smooth
- Après zoom, les zones sans chasse dans la bbox sont affichées (si présentes)
- Un marqueur temporaire peut être affiché au centre de la bbox (optionnel) :
    ```javascript
    new maplibregl.Marker({color: '#3b82f6'}) // Tailwind blue-500
        .setLngLat([feature.geometry.coordinates[0], feature.geometry.coordinates[1]])
        .addTo(map);
    ```

**AND** : Si l'API retourne un point (pas de bbox) :

- Zoom sur le point avec niveau zoom 12 :
    ```javascript
    map.flyTo({
        center: feature.geometry.coordinates,
        zoom: 12,
        duration: 1000,
    });
    ```

**AND** : Annonce accessibilité après zoom :

- ARIA live region annonce : "Carte zoomée sur Strasbourg, Bas-Rhin"
- Focus peut retourner sur carte (ou rester sur input selon UX)

**Accessibility Integration**

- ARIA live region avec `aria-live="polite"` annonce le zoom
- Animation respecte `prefers-reduced-motion` :
    ```javascript
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    map.fitBounds(bbox, {
        padding: 50,
        maxZoom: 12,
        duration: prefersReducedMotion ? 0 : 1000,
    });
    ```
- Marqueur temporaire (si ajouté) avec `aria-label="Position recherchée"`

**Performance & Technical Acceptance**

- Animation zoom fluide ≥ 30 FPS mobile, ≥ 60 FPS desktop
- Pas de freeze interface pendant animation
- Tuiles nouvelles zones chargées pendant animation (seamless)

---

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

## Epic 3: Zone Information & Details

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

### Story 3.2: Affichage responsive sidebar desktop vs bottom sheet mobile

**User Story**
En tant que **développeur**, je veux implémenter un affichage adaptatif des détails zone avec sidebar sur desktop et bottom sheet sur mobile, afin d'optimiser l'UX selon le device.

**Acceptance Criteria**

**GIVEN** : L'utilisateur clique sur une zone (Story 3.1)
**WHEN** : Le détail s'affiche selon la taille écran
**THEN** :

**Desktop (≥ 1024px)** :

```tsx
<Sheet open={isOpen} onOpenChange={setIsOpen}>
    <SheetContent side="left" className="w-[400px]">
        <SheetHeader>
            <SheetTitle>{zone.nom}</SheetTitle>
            <SheetClose asChild>
                <Button variant="ghost" size="icon" aria-label="Fermer">
                    <X className="h-4 w-4" />
                </Button>
            </SheetClose>
        </SheetHeader>
        <div className="mt-4">{/* Détails zone */}</div>
    </SheetContent>
</Sheet>
```

- Sidebar push carte vers droite (carte resize, pas overlay complet)
- Animation slide-in depuis gauche 300ms
- Scroll interne sidebar si contenu long

**Mobile (< 1024px)** :

```tsx
<Sheet open={isOpen} onOpenChange={setIsOpen}>
    <SheetContent side="bottom" className="h-[40vh] data-[state=open]:h-[80vh]">
        <div className="mx-auto w-12 h-1.5 bg-muted rounded-full mb-4" /> {/* Handle swipe */}
        <SheetHeader>
            <SheetTitle>{zone.nom}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 overflow-y-auto">{/* Détails zone */}</div>
    </SheetContent>
</Sheet>
```

- Bottom sheet slide-up depuis bas
- Hauteur initiale 40vh, drag handle pour expand 80vh
- Swipe down pour fermer
- Overlay semi-transparent sur carte

**AND** : Détection device avec Tailwind breakpoints :

```tsx
const isMobile = useMediaQuery('(max-width: 1023px)');
<Sheet open={isOpen}>
    <SheetContent side={isMobile ? 'bottom' : 'left'}>...</SheetContent>
</Sheet>;
```

**Accessibility Integration**

- Même focus trap et keyboard nav pour les deux layouts
- Drag handle mobile avec `aria-label="Glisser pour ajuster la hauteur"`
- Swipe gestures ne désactivent pas alternatives clavier/bouton
- `prefers-reduced-motion` désactive animations slide

**Performance & Technical Acceptance**

- Animation 60 FPS desktop, 30 FPS mobile minimum
- Resize carte desktop instantané (< 100ms)
- Pas de reflow complet page (layout contained)

---

### Story 3.3: Données zone embarquées dans tuiles MVT (pas d'API call)

**User Story**
En tant que **développeur**, je veux inclure toutes les métadonnées nécessaires dans les tuiles MVT, afin d'afficher les détails zone sans appel API supplémentaire et garantir performance optimale.

**Acceptance Criteria**

**GIVEN** : Le pipeline tuiles MVT est configuré (Story 0.3)
**WHEN** : Une tuile est générée par le backend
**THEN** :

- La requête SQL PostGIS inclut toutes colonnes nécessaires :

```sql
SELECT
  id,
  nom,
  type_protection,
  gestionnaire,
  date_maj,
  source,
  source_url,
  ST_AsMVTGeom(
    geometry,
    ST_TileEnvelope({z}, {x}, {y}),
    4096,
    256,
    true
  ) AS geom
FROM zones
WHERE ST_Intersects(
  geometry,
  ST_TileEnvelope({z}, {x}, {y})
)
```

- Les propriétés sont accessibles côté client :

```javascript
map.on('click', 'zones-fill', (event) => {
    const zone = event.features[0].properties;
    console.log(zone);
    // { id, nom, type_protection, gestionnaire, date_maj, source, source_url }
});
```

**AND** : Optimisation taille tuile :

- Colonnes texte limitées (noms courts préférés)
- `date_maj` formatée ISO 8601 string (pas timestamp)
- `source_url` nullable (non inclus si NULL dans BDD)
- Taille tuile finale < 50KB en moyenne

**AND** : Validation tuiles :

```bash
# Inspection tuile avec mbview
mbview tiles/10/523/357.mvt

# Vérification propriétés avec tippecanoe
tile-join --no-tile-size-limit -o test.mbtiles tiles/
```

**Accessibility Integration**

- N/A (infrastructure données)

**Performance & Technical Acceptance**

- Requête SQL tuile < 100ms (index spatial utilisé)
- Taille moyenne tuile zoom 10 : ~30KB
- Taille moyenne tuile zoom 14 : ~50KB (plus de détails géométrie)
- Pas de requête `/api/zones/{id}` nécessaire lors du clic

**Technical Notes**

- Validation que tous champs obligatoires sont non-NULL dans BDD
- Migration SQL Phase 2 : ajout colonnes `superficie_ha`, `perimetre_km` (optionnel)

---

---

## Epic 4: Transparency & Documentation

### Story 4.1: Modal disclaimer première visite avec localStorage persistence

**User Story**
En tant que **Tom (première visite)**, je veux voir immédiatement un message clair m'expliquant que la carte montre seulement les zones connues et que l'absence de zone ne signifie pas autorisation de chasse, afin de ne pas avoir de faux sentiment de sécurité.

**Acceptance Criteria**

**GIVEN** : L'utilisateur visite le site pour la première fois
**WHEN** : La page `http://localhost:3000` charge
**THEN** :

- Un modal/dialog s'affiche automatiquement avec le message suivant :

```
⚠️ Important : Données partielles

Cette carte affiche uniquement les zones sans chasse que nous avons pu identifier et valider.

❌ L'absence d'une zone VERTE ne signifie PAS que la chasse y est autorisée.
✅ La présence d'une zone VERTE indique une protection officielle confirmée.

Les données couvrent actuellement : [liste départements]

Avant toute activité, vérifiez toujours localement auprès des gestionnaires.

[Bouton "J'ai compris" primary]
[Checkbox "Ne plus afficher ce message"]
```

- Si checkbox cochée + bouton cliqué → `localStorage.setItem('disclaimer-accepted', 'true')`
- Si checkbox non cochée + bouton cliqué → modal ferme, mais réaffiche prochaine visite
- Modal non closable sans clic bouton (pas de `X` ni `Esc` ni clic overlay)

**AND** : Visites suivantes :

```javascript
useEffect(() => {
    const disclaimerAccepted = localStorage.getItem('disclaimer-accepted');
    if (!disclaimerAccepted) {
        setShowDisclaimer(true);
    }
}, []);
```

**AND** : Composant `/app/components/DisclaimerModal.tsx` :

```tsx
<AlertDialog open={showDisclaimer} onOpenChange={() => {}}>
    <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Important : Données partielles
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
                <p>Cette carte affiche uniquement les zones sans chasse que nous avons pu identifier et valider.</p>
                <ul className="space-y-1">
                    <li>❌ L'absence d'une zone verte ne signifie PAS que la chasse y est autorisée</li>
                    <li>✅ La présence d'une zone verte indique une protection officielle confirmée</li>
                </ul>
                <p className="text-sm">Avant toute activité, vérifiez toujours localement.</p>
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-3">
            <div className="flex items-center gap-2">
                <Checkbox id="no-show" checked={noShowAgain} onCheckedChange={setNoShowAgain} />
                <label htmlFor="no-show" className="text-sm">
                    Ne plus afficher ce message
                </label>
            </div>
            <AlertDialogAction onClick={handleAccept}>J'ai compris</AlertDialogAction>
        </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>
```

**Accessibility Integration**

- Modal avec `role="alertdialog"` (Radix AlertDialog)
- Focus automatique sur le bouton "J'ai compris" à l'ouverture
- Texte clair, langage simple, pas de jargon
- Checkbox avec `<label>` associé via `htmlFor`
- Lecteur écran annonce titre + description complète
- Pas de fermeture accidentelle (modal bloquant intentionnel)

**Performance & Technical Acceptance**

- Modal apparaît en < 500ms après chargement page
- localStorage check synchrone (pas de flash)
- Pas d'appel API (logique 100% client)

---

### Story 4.2: Page `/sources` statique SSG avec liste sources et méthodologie

**User Story**
En tant que **Marie (photographe nature professionnelle)**, je veux consulter la liste complète des sources de données intégrées avec leur licence et date de mise à jour, afin de valider la fiabilité des informations avant de planifier mes sorties.

**Acceptance Criteria**

**GIVEN** : L'application Next.js est buildée
**WHEN** : L'utilisateur accède à `http://localhost:3000/sources`
**THEN** :

- Page statique générée avec SSG (`export const dynamic = 'force-static'`)
- Structure page :

```tsx
// app/sources/page.tsx
export const metadata = {
    title: 'Sources de données - NatureTranquille',
    description: 'Liste complète des sources officielles de zones sans chasse intégrées dans NatureTranquille',
};

export default function SourcesPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Sources de données</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">Données intégrées</h2>
                <div className="space-y-4">
                    {sources.map((source) => (
                        <Card key={source.id}>
                            <CardHeader>
                                <CardTitle>{source.nom}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <dl className="space-y-2">
                                    <div>
                                        <dt className="text-sm font-medium">Type</dt>
                                        <dd>{source.type}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium">Couverture géographique</dt>
                                        <dd>{source.couverture}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium">Licence</dt>
                                        <dd>{source.licence}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium">Date dernière mise à jour</dt>
                                        <dd>{source.date_maj}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium">Source officielle</dt>
                                        <dd>
                                            <a
                                                href={source.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                {source.url}
                                            </a>
                                        </dd>
                                    </div>
                                </dl>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">Méthodologie de validation</h2>
                <div className="prose">
                    <p>Chaque zone intégrée suit un processus de validation rigoureux :</p>
                    <ol>
                        <li>Vérification source officielle (arrêté préfectoral, décret, gestionnaire confirmé)</li>
                        <li>Validation géométrie (cohérence, pas de trous, projection correcte)</li>
                        <li>Croisement avec cadastre si disponible</li>
                        <li>Métadonnées complètes (nom, gestionnaire, date)</li>
                    </ol>
                    <p>
                        Les zones partielles ou non confirmées sont <strong>exclues</strong> par précaution.
                    </p>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-3">Roadmap couverture</h2>
                <p>Départements actuellement couverts : Bas-Rhin (67), Haut-Rhin (68), Moselle (57), Savoie (73)</p>
                <p>Prochains départements : Haute-Savoie (74), Isère (38) — prévu Q2 2026</p>
            </section>
        </main>
    );
}
```

**AND** : Données sources dans `/data/sources.json` :

```json
[
    {
        "id": "rncfs-grand-est",
        "nom": "RNCFS Grand Est",
        "type": "Réserve Nationale de Chasse et Faune Sauvage",
        "couverture": "Bas-Rhin, Haut-Rhin, Moselle",
        "licence": "Licence Ouverte / Etalab 2.0",
        "date_maj": "2026-01-15",
        "url": "https://www.ofb.gouv.fr/le-reseau-des-reserves"
    },
    {
        "id": "reserves-savoie",
        "nom": "Réserves Naturelles de Savoie",
        "type": "Réserves Naturelles Régionales et Nationales",
        "couverture": "Savoie (73)",
        "licence": "Données publiques",
        "date_maj": "2026-02-01",
        "url": "https://www.savoie.fr/environnement/reserves-naturelles"
    }
]
```

**Accessibility Integration**

- Structure HTML sémantique (`<main>`, `<section>`, `<h1>`-`<h3>`)
- Hiérarchie titres logique (H1 page → H2 sections → H3 si nécessaire)
- Listes `<dl>` pour métadonnées (definition list sémantique)
- Liens externes avec `rel="noopener noreferrer"` (sécurité)
- Texte contrasté WCAG AA (vérification axe DevTools)

**Performance & Technical Acceptance**

- Page statique SSG (build time)
- Pas de JavaScript hydration nécessaire (100% static)
- Lighthouse score ≥ 95 (Performance, Accessibility, SEO)
- JSON sources < 5KB (peu de sources au MVP)

---

### Story 4.3: Page `/a-propos` avec mission, mentions légales, contact

**User Story**
En tant que **Mireille (retraitée militante écologie)**, je veux comprendre qui porte ce projet, quelle est sa mission, et comment contacter l'équipe, afin de décider si je peux faire confiance au site et éventuellement contribuer.

**Acceptance Criteria**

**GIVEN** : L'application Next.js est buildée
**WHEN** : L'utilisateur accède à `http://localhost:3000/a-propos`
**THEN** :

- Page statique SSG avec structure suivante :

```tsx
// app/a-propos/page.tsx
export const metadata = {
    title: 'À propos - NatureTranquille',
    description:
        'Mission, contexte et contact de NatureTranquille, projet open source de cartographie des zones sans chasse',
};

export default function AProposPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">À propos de NatureTranquille</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">Notre mission</h2>
                <div className="prose">
                    <p>
                        NatureTranquille est un projet open source visant à cartographier les zones sans chasse en
                        France pour faciliter l'accès à la nature en toute sérénité.
                    </p>
                    <p>
                        Nous croyons que chacun·e devrait pouvoir profiter de la nature sans crainte, que ce soit pour
                        une randonnée, une sortie photo, ou simplement une promenade en forêt.
                    </p>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">Contexte du projet</h2>
                <div className="prose">
                    <p>
                        Ce projet est né du constat que les informations sur les zones sans chasse sont dispersées,
                        difficiles d'accès, et rarement cartographiées de manière accessible au grand public.
                    </p>
                    <p>
                        NatureTranquille agrège des données officielles (RNCFS, Réserves Naturelles, etc.) pour les
                        rendre visibles et utilisables par tous, gratuitement.
                    </p>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">Porteur du projet</h2>
                <p>Projet personnel porté par [Nom/Pseudonyme], développeur·se web et passionné·e de nature.</p>
                <p>
                    Code source disponible sous licence MIT :
                    <a href="https://github.com/user/naturetranquille" className="text-primary hover:underline ml-1">
                        GitHub NatureTranquille
                    </a>
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">Contact</h2>
                <p>Pour signaler une erreur, suggérer une amélioration, ou proposer de nouvelles données :</p>
                <ul className="list-disc list-inside">
                    <li>
                        Email :{' '}
                        <a href="mailto:contact@naturetranquille.fr" className="text-primary hover:underline">
                            contact@naturetranquille.fr
                        </a>
                    </li>
                    <li>
                        Formulaire :{' '}
                        <a href="/feedback" className="text-primary hover:underline">
                            Page Feedback
                        </a>
                    </li>
                    <li>
                        GitHub Issues :{' '}
                        <a
                            href="https://github.com/user/naturetranquille/issues"
                            className="text-primary hover:underline"
                        >
                            Ouvrir un ticket
                        </a>
                    </li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-3">Mentions légales</h2>
                <div className="prose text-sm">
                    <p>
                        <strong>Éditeur</strong> : [Nom/Association]
                    </p>
                    <p>
                        <strong>Hébergement</strong> : [Scalingo France / CleverCloud France] (conformité RGPD UE)
                    </p>
                    <p>
                        <strong>Données personnelles</strong> : Ce site ne collecte aucune donnée personnelle sans
                        consentement. Les emails envoyés via le formulaire de feedback sont stockés uniquement pour
                        traitement.
                    </p>
                    <p>
                        <strong>Cookies</strong> : Ce site utilise uniquement des cookies techniques (localStorage
                        disclaimer, sessionStorage cache recherche). Pas de cookies publicitaires ou tiers.
                    </p>
                    <p>
                        <strong>Licence contenu</strong> : Les données cartographiques sont issues de sources publiques
                        (voir{' '}
                        <a href="/sources" className="text-primary hover:underline">
                            page Sources
                        </a>
                        ). Le code source est sous licence MIT.
                    </p>
                </div>
            </section>
        </main>
    );
}
```

**Accessibility Integration**

- Structure sémantique complète (`<main>`, `<section>`, titres hiérarchiques)
- Liens explicites (texte descriptif, pas "cliquez ici")
- Adresse email avec `mailto:` (ouvre client email)
- Texte classe `prose` avec Tailwind Typography (lisibilité optimisée)
- Contraste AAA pour texte principal (body text ≥ 7:1)

**Performance & Technical Acceptance**

- Page statique SSG (zéro JavaScript nécessaire)
- Lighthouse score ≥ 95 sur tous critères
- Temps chargement < 1s

---

---

## Epic 5: User Feedback & Community

### Story 5.1: Formulaire signalement erreurs avec validation Zod

**User Story**
En tant que **Mireille**, je veux signaler qu'une zone affichée comme sans chasse a en réalité une barrière verrouillée, afin que l'équipe puisse investiguer et corriger l'information si nécessaire.

**Acceptance Criteria**

**GIVEN** : L'utilisateur accède à la page `/feedback`
**WHEN** : L'utilisateur remplit le formulaire
**THEN** :

- Formulaire avec champs suivants :
    - **Type de signalement** (select) : Erreur zone, Suggestion amélioration, Nouvelle donnée, Autre
    - **Localisation** (text) : Nom zone ou adresse approximative
    - **Description** (textarea, max 500 chars) : Détails du signalement
    - **Email** (text, optionnel) : Pour réponse éventuelle

- Validation côté client avec Zod :

```typescript
import {z} from 'zod';

const feedbackSchema = z.object({
    type: z.enum(['erreur', 'suggestion', 'nouvelle-donnee', 'autre']),
    localisation: z.string().min(3, 'Minimum 3 caractères').max(200),
    description: z.string().min(10, 'Minimum 10 caractères').max(500),
    email: z.string().email('Email invalide').optional().or(z.literal('')),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;
```

- Si validation échoue → messages erreur sous champs concernés
- Si validation réussit → bouton "Envoyer" actif → soumission POST `/api/feedback`

**AND** : Page `/app/feedback/page.tsx` :

```tsx
'use client';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {feedbackSchema} from '@/lib/validations/feedback';

export default function FeedbackPage() {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: zodResolver(feedbackSchema),
    });

    const onSubmit = async (data: FeedbackForm) => {
        const res = await fetch('/api/feedback', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });

        if (res.ok) {
            toast.success('Signalement envoyé, merci !');
            reset();
        } else {
            toast.error("Erreur lors de l'envoi, réessayez");
        }
    };

    return (
        <main className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6">Signaler une erreur ou suggérer une amélioration</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="type" className="block text-sm font-medium mb-2">
                        Type de signalement
                    </label>
                    <select id="type" {...register('type')} className="w-full">
                        <option value="erreur">Erreur sur une zone</option>
                        <option value="suggestion">Suggestion d'amélioration</option>
                        <option value="nouvelle-donnee">Nouvelle donnée à ajouter</option>
                        <option value="autre">Autre</option>
                    </select>
                    {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
                </div>

                <div>
                    <label htmlFor="localisation" className="block text-sm font-medium mb-2">
                        Localisation
                    </label>
                    <input
                        id="localisation"
                        type="text"
                        {...register('localisation')}
                        placeholder="ex: Réserve de la Petite Camargue Alsacienne"
                        className="w-full"
                    />
                    {errors.localisation && (
                        <p className="text-sm text-destructive mt-1">{errors.localisation.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2">
                        Description (max 500 caractères)
                    </label>
                    <textarea
                        id="description"
                        {...register('description')}
                        rows={5}
                        className="w-full"
                        placeholder="Décrivez le problème rencontré ou votre suggestion..."
                    ></textarea>
                    {errors.description && (
                        <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email (optionnel, pour réponse)
                    </label>
                    <input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="votre@email.fr"
                        className="w-full"
                    />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
                </div>

                <button type="submit" className="btn btn-primary">
                    Envoyer le signalement
                </button>
            </form>
        </main>
    );
}
```

**Accessibility Integration**

- Tous champs avec `<label>` explicite associé via `htmlFor`
- Messages erreur avec `role="alert"` et annoncés par lecteurs écran
- Focus visible sur tous inputs (outline 2px, contraste ≥ 3:1)
- Ordre tabulation logique (type → localisation → description → email → bouton)
- Bouton submit désactivé pendant envoi (loading state) :
    ```tsx
    <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
        {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
    </button>
    ```

**Performance & Technical Acceptance**

- Validation Zod instantanée (< 10ms)
- Pas de requête backend tant que validation échoue
- Formulaire React Hook Form optimisé (pas de re-render inutiles)

---

### Story 5.2: Toast confirmation envoi et email SMTP backend

**User Story**
En tant que **Mireille**, après avoir envoyé mon signalement, je veux recevoir une confirmation visuelle immédiate, et éventuellement un email de confirmation, afin de savoir que ma contribution a bien été prise en compte.

**Acceptance Criteria**

**GIVEN** : L'utilisateur soumet le formulaire (Story 5.1)
**WHEN** : Le backend reçoit la requête POST `/api/feedback`
**THEN** :

- **Backend** (Next.js API Route `/app/api/feedback/route.ts`) :
    - Validation Zod côté serveur (defense in depth)
    - Insertion signalement dans PostgreSQL :
        ```sql
        CREATE TABLE signalements (
          id SERIAL PRIMARY KEY,
          type VARCHAR(50) NOT NULL,
          localisation VARCHAR(200) NOT NULL,
          description TEXT NOT NULL,
          email VARCHAR(255),
          ip_hash VARCHAR(64), -- hash IP pour rate limiting
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        ```
    - Hash IP utilisateur (SHA-256) pour rate limiting (pas de stockage IP brute RGPD)
    - Envoi email SMTP à l'équipe :

        ```typescript
        import nodemailer from 'nodemailer';

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: 'no-reply@naturetranquille.fr',
            to: 'contact@naturetranquille.fr',
            subject: `[NatureTranquille] Nouveau signalement: ${data.type}`,
            text: `
            Type: ${data.type}
            Localisation: ${data.localisation}
            Description: ${data.description}
            Email: ${data.email || 'Non renseigné'}
          `,
        });
        ```

    - Si email utilisateur fourni → envoi confirmation utilisateur :

        ```typescript
        await transporter.sendMail({
            from: 'no-reply@naturetranquille.fr',
            to: data.email,
            subject: 'Signalement reçu - NatureTranquille',
            text: `
            Bonjour,
        
            Nous avons bien reçu votre signalement concernant : ${data.localisation}
        
            Notre équipe l'analysera dans les prochains jours.
        
            Merci de contribuer à l'amélioration de NatureTranquille !
        
            L'équipe NatureTranquille
          `,
        });
        ```

- **Frontend** : Toast notification après réponse backend :

    ```tsx
    import {toast} from 'sonner'; // ou autre lib toast

    if (res.ok) {
        toast.success(
            'Signalement envoyé, merci ! Vous recevrez une confirmation par email si vous en avez fourni un.',
        );
        reset(); // React Hook Form reset
    } else {
        toast.error("Erreur lors de l'envoi, réessayez dans quelques instants.");
    }
    ```

**AND** : Configuration SMTP :

- Scalingo : Add-on SendGrid gratuit (100 emails/jour)
- OU Brevo (ex-Sendinblue) : 300 emails/jour gratuit
- Variables `.env` :
    ```
    SMTP_HOST=smtp-relay.sendinblue.com
    SMTP_USER=your-email@naturetranquille.fr
    SMTP_PASS=your-smtp-key
    ```

**Accessibility Integration**

- Toast avec `role="status"` et `aria-live="polite"` (annoncé par lecteurs écran)
- Toast auto-dismiss après 5s (pas de blocage navigation)
- Toast visible visuellement (contraste ≥ 4.5:1)
- Bouton fermeture toast optionnel (clic ou `Esc`)

**Performance & Technical Acceptance**

- Envoi email SMTP < 500ms (Scalingo/Brevo rapides)
- Rate limiting IP : 1 signalement / minute / IP (évite spam)
- Hash IP avec bcrypt ou SHA-256 (pas de stockage IP claire)

---

### Story 5.3: Protection spam avec honeypot ou hCaptcha accessible

**User Story**
En tant que **développeur**, je veux protéger le formulaire feedback contre les robots spammeurs avec une solution accessible, afin de garantir que les signalements reçus sont légitimes sans frustrer les utilisateurs réels.

**Acceptance Criteria**

**GIVEN** : Le formulaire feedback existe (Story 5.1)
**WHEN** : Un bot ou un humain soumet le formulaire
**THEN** :

**Option 1: Honeypot (recommandé pour accessibilité)** :

- Champ caché CSS ajouté au formulaire :
    ```tsx
    <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute -left-9999px"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
    />
    ```
- Backend vérifie : si champ `website` rempli → requête rejetée (bot détecté)
    ```typescript
    if (body.website) {
        return NextResponse.json({error: 'Spam detected'}, {status: 400});
    }
    ```
- Humains ne voient jamais ce champ (caché visuellement et pour lecteurs écran)
- Bots le remplissent automatiquement → détection

**Option 2: hCaptcha (si honeypot insuffisant)** :

- hCaptcha accessible (alternative accessible à reCAPTCHA)
- Intégration composant :

    ```tsx
    import HCaptcha from '@hcaptcha/react-hcaptcha';

    <HCaptcha sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY} onVerify={(token) => setCaptchaToken(token)} />;
    ```

- Backend vérifie token avec API hCaptcha avant insertion BDD
- Mode accessibility automatique (détection lecteur écran)

**AND** : Rate limiting IP côté serveur (complément honeypot) :

```typescript
const ipHash = createHash('sha256').update(request.ip).digest('hex');
const recentSubmissions = await db.query(
    "SELECT COUNT(*) FROM signalements WHERE ip_hash = $1 AND created_at > NOW() - INTERVAL '1 minute'",
    [ipHash],
);

if (recentSubmissions.rows[0].count > 0) {
    return NextResponse.json({error: 'Too many requests'}, {status: 429});
}
```

**Accessibility Integration**

- Honeypot : 100% transparent utilisateurs, lecteurs écran ignorent (`aria-hidden`, `tabindex="-1"`)
- hCaptcha : mode accessible automatique, compatible lecteurs écran, pas de puzzle visuel si détection assistive tech
- Rate limiting : message erreur clair "Trop de signalements récents, attendez 1 minute"

**Performance & Technical Acceptance**

- Honeypot : 0ms overhead (pur CSS/HTML)
- hCaptcha : < 200ms validation token backend
- Rate limiting : requête SQL < 10ms (index sur `ip_hash` + `created_at`)

**Technical Notes**

- Honeypot Phase 1 (simple, efficace contre 95% bots)
- hCaptcha Phase 2 si spam persiste
- JAMAIS Google reCAPTCHA (accessibilité problématique)

---

### Story 5.4: Stockage signalements PostgreSQL avec référence future

**User Story**
En tant que **développeur**, je veux stocker tous les signalements utilisateurs dans PostgreSQL avec structure permettant traitement futur, afin de construire une roadmap data-driven des corrections à apporter.

**Acceptance Criteria**

**GIVEN** : Le backend reçoit un signalement validé (Stories 5.1-5.3)
**WHEN** : L'insertion BDD est exécutée
**THEN** :

- Table `signalements` structure complète :

    ```sql
    CREATE TABLE signalements (
      id SERIAL PRIMARY KEY,
      type VARCHAR(50) NOT NULL CHECK (type IN ('erreur', 'suggestion', 'nouvelle-donnee', 'autre')),
      localisation VARCHAR(200) NOT NULL,
      description TEXT NOT NULL,
      email VARCHAR(255),
    ip_hash VARCHAR(64) NOT NULL,
    status VARCHAR(20) DEFAULT 'nouveau' CHECK (status IN ('nouveau', 'en-cours', 'resolu', 'rejete')),
    notes_internes TEXT,
    zone_id INT REFERENCES zones(id), -- si signalement lié à une zone existante
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX idx_signalements_status ON signalements(status);
    CREATE INDEX idx_signalements_created_at ON signalements(created_at DESC);
    CREATE INDEX idx_signalements_ip_hash ON signalements(ip_hash, created_at);
    ```

**AND** : API Route insertion :

```typescript
// app/api/feedback/route.ts
import {db} from '@/lib/db';

export async function POST(request: Request) {
    const body = await request.json();

    // Validation Zod...
    // Honeypot check...
    // Rate limiting...

    const ipHash = createHash('sha256')
        .update(request.headers.get('x-forwarded-for') || 'unknown')
        .digest('hex');

    await db.query(
        `INSERT INTO signalements (type, localisation, description, email, ip_hash)
     VALUES ($1, $2, $3, $4, $5)`,
        [body.type, body.localisation, body.description, body.email || null, ipHash],
    );

    // Email SMTP...

    return NextResponse.json({success: true});
}
```

**AND** : Interface admin basique Phase 2 :

- Route `/admin/signalements` (protégée authentification)
- Liste signalements avec filtres (status, type, date)
- Possibilité changer status, ajouter notes internes
- Lien vers zone carte si `zone_id` renseigné

**Accessibility Integration**

- N/A (structure BDD backend)

**Performance & Technical Acceptance**

- Insertion < 50ms
- Index sur `status` permet filtrage rapide signalements nouveaux
- Index composite `(ip_hash, created_at)` optimise rate limiting query
- Espace disque : ~500 bytes / signalement → 10 000 signalements = ~5MB

**Technical Notes**

- Migration Drizzle ORM :

    ```typescript
    import {pgTable, serial, varchar, text, timestamp} from 'drizzle-orm/pg-core';

    export const signalements = pgTable('signalements', {
        id: serial('id').primaryKey(),
        type: varchar('type', {length: 50}).notNull(),
        localisation: varchar('localisation', {length: 200}).notNull(),
        description: text('description').notNull(),
        email: varchar('email', {length: 255}),
        ipHash: varchar('ip_hash', {length: 64}).notNull(),
        status: varchar('status', {length: 20}).default('nouveau'),
        createdAt: timestamp('created_at').defaultNow(),
    });
    ```

---

---

## Epic 6: SEO & Discoverability

### Story 6.1: Routes statiques SSG `/departements/[slug]` et `/regions/[slug]`

**User Story**
En tant que **Tom recherchant "zones sans chasse Bas-Rhin" sur Google**, je veux trouver une page dédiée au département avec la carte automatiquement centrée sur cette zone, afin d'accéder directement à l'information pertinente.

**Acceptance Criteria**

**GIVEN** : L'application Next.js est buildée avec SSG
**WHEN** : Next.js génère les pages statiques
**THEN** :

- Routes dynamiques créées :
    - `/departements/[slug]` : ex `/departements/bas-rhin-67`
    - `/regions/[slug]` : ex `/regions/grand-est`

**AND** : Génération pages via `generateStaticParams` :

```tsx
// app/departements/[slug]/page.tsx
import {db} from '@/lib/db';

export async function generateStaticParams() {
    const departements = await db.query(`
    SELECT DISTINCT
            LOWER(REGEXP_REPLACE(nom_departement, '[^a-zA-Z0-9]', '-', 'g')) AS slug,
            nom_departement,
            code_departement
        FROM zones
    ORDER BY code_departement
  `);

    return departements.rows.map((d) => ({
        slug: `${d.slug}-${d.code_departement}`,
    }));
}

export async function generateMetadata({params}: {params: {slug: string}}) {
    const dept = await getDepartementBySlug(params.slug);

    return {
        title: `Zones sans chasse ${dept.nom} (${dept.code}) - NatureTranquille`,
        description: `Carte interactive des zones sans chasse dans le département ${dept.nom} (${dept.code}). Données officielles RNCFS et réserves naturelles.`,
        openGraph: {
            title: `Zones sans chasse ${dept.nom} - NatureTranquille`,
            description: `Découvrez les zones sans chasse dans le ${dept.nom}`,
            images: [{url: '/og-image-departement.png'}],
        },
    };
}

export default async function DepartementPage({params}: {params: {slug: string}}) {
    const dept = await getDepartementBySlug(params.slug);
    const zones = await getZonesByDepartement(dept.code);

    return (
        <main>
            <h1 className="text-3xl font-bold mb-4">
                Zones sans chasse dans le {dept.nom} ({dept.code})
            </h1>

            <p className="mb-6">
                {zones.length} zone(s) sans chasse identifiée(s) dans le département {dept.nom}.
            </p>

            <Map initialCenter={dept.center} initialZoom={9} highlightDepartement={dept.code} />

            <section className="mt-8">
                <h2 className="text-2xl font-semibold mb-3">Zones identifiées</h2>
                <ul className="space-y-2">
                    {zones.map((zone) => (
                        <li key={zone.id}>
                            <strong>{zone.nom}</strong> - {zone.type_protection}
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
```

**AND** : Carte initialisée avec bounds département :

```typescript
// Calcul bbox département depuis PostGIS
const bboxQuery = await db.query(
    `
  SELECT
    ST_XMin(ST_Extent(geometry)) as minLng,
    ST_YMin(ST_Extent(geometry)) as minLat,
        ST_XMax(ST_Extent(geometry)) as maxLng,
        ST_YMax(ST_Extent(geometry)) as maxLat
    FROM zones
  WHERE code_departement = $1
`,
    [dept.code],
);

map.fitBounds(
    [
        [bboxQuery.rows[0].minLng, bboxQuery.rows[0].minLat],
        [bboxQuery.rows[0].maxLng, bboxQuery.rows[0].maxLat],
    ],
    {padding: 50},
);
```

**Accessibility Integration**

- Structure HTML sémantique (`<h1>` unique par page)
- Liste zones avec `<ul>` sémantique
- Carte avec `aria-label="Carte des zones sans chasse dans le {dept.nom}"`
- Breadcrumb navigation :
    ```tsx
    <nav aria-label="Breadcrumb">
        <ol>
            <li>
                <a href="/">Accueil</a>
            </li>
            <li>
                <a href="/departements">Départements</a>
            </li>
            <li aria-current="page">{dept.nom}</li>
        </ol>
    </nav>
    ```

**Performance & Technical Acceptance**

- Pages statiques générées build-time (0 requête runtime)
- Lighthouse SEO score = 100
- Time to First Byte < 200ms (pages statiques)
- Génération tous départements couverts < 30s build time

---

### Story 6.2: Métadonnées SEO dynamiques par route (title, description, OpenGraph)

**User Story**
En tant que **développeur**, je veux générer des métadonnées SEO optimales pour chaque page, afin de maximiser la découvrabilité via Google et le partage sur réseaux sociaux.

**Acceptance Criteria**

**GIVEN** : Les routes statiques sont générées (Story 6.1)
**WHEN** : Une page est servie
**THEN** :

- Métadonnées `<head>` complètes :

**Page Accueil `/`** :

```tsx
export const metadata = {
    title: 'NatureTranquille - Carte des zones sans chasse en France',
    description:
        'Carte interactive gratuite des zones sans chasse en France : réserves naturelles, RNCFS. Trouvez les zones protégées près de chez vous pour profiter de la nature en toute sérénité.',
    keywords:
        'zones sans chasse, réserves naturelles, RNCFS, carte chasse France, nature tranquille, randonnée sécurisée',
    openGraph: {
        title: 'NatureTranquille - Zones sans chasse en France',
        description: 'Carte interactive des zones sans chasse',
        url: 'https://naturetranquille.fr',
        siteName: 'NatureTranquille',
        images: [
            {
                url: 'https://naturetranquille.fr/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Carte France avec zones sans chasse',
            },
        ],
        locale: 'fr_FR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'NatureTranquille - Zones sans chasse France',
        description: 'Carte interactive gratuite des zones sans chasse',
        images: ['https://naturetranquille.fr/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
        },
    },
};
```

**Page Département `/departements/[slug]`** :

```tsx
export async function generateMetadata({params}) {
    const dept = await getDepartementBySlug(params.slug);

    return {
        title: `Zones sans chasse ${dept.nom} (${dept.code}) - NatureTranquille`,
        description: `Découvrez les ${dept.zones_count} zones sans chasse identifiées dans le ${dept.nom}. Carte interactive, données officielles, accès gratuit.`,
        openGraph: {
            title: `${dept.nom} - Zones sans chasse`,
            url: `https://naturetranquille.fr/departements/${params.slug}`,
            images: [{url: `/og-images/${dept.code}.png`}], // Image générée dynamiquement Phase 2
        },
    };
}
```

**AND** : Balises structurées Schema.org :

```tsx
// app/layout.tsx
<script type="application/ld+json">
    {JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'NatureTranquille',
        url: 'https://naturetranquille.fr',
        description: 'Carte interactive des zones sans chasse en France',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web browser',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'EUR',
        },
    })}
</script>
```

**Accessibility Integration**

- Balise `<html lang="fr">` (langue déclarée)
- `<title>` unique et descriptif par page
- Métadonnées `description` claires et informatives
- Images OpenGraph avec `alt` descriptif

**Performance & Technical Acceptance**

- Métadonnées générées build-time (SSG)
- Validation Schema.org avec Google Rich Results Test
- OpenGraph validator Facebook : aucune erreur
- Twitter Card validator : image preview correct

---

### Story 6.3: Sitemap XML généré automatiquement

**User Story**
En tant que **Google Bot**, je veux découvrir automatiquement toutes les pages du site via un sitemap XML, afin d'indexer efficacement le contenu.

**Acceptance Criteria**

**GIVEN** : L'application Next.js est buildée
**WHEN** : Le sitemap est généré
**THEN** :

- Fichier `/sitemap.xml` accessible à la racine
- Contenu sitemap liste toutes routes statiques :
    - `/` (homepage)
    - `/sources`
    - `/a-propos`
    - `/feedback`
    - `/departements/bas-rhin-67`
    - `/departements/haut-rhin-68`
    - etc.

**AND** : Génération sitemap Next.js App Router :

```tsx
// app/sitemap.ts
import {MetadataRoute} from 'next';
import {db} from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://naturetranquille.fr';

    // Pages statiques
    const staticPages = ['', '/sources', '/a-propos', '/feedback'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // Pages départements (générées dynamiquement)
    const departements = await db.query(`
    SELECT DISTINCT
            LOWER(REGEXP_REPLACE(nom_departement, '[^a-zA-Z0-9]', '-', 'g')) AS slug,
            code_departement,
            MAX(date_maj) as last_updated
        FROM zones
    GROUP BY nom_departement, code_departement
  `);

    const deptPages = departements.rows.map((d) => ({
        url: `${baseUrl}/departements/${d.slug}-${d.code_departement}`,
        lastModified: new Date(d.last_updated),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    return [...staticPages, ...deptPages];
}
```

**AND** : Fichier `robots.txt` :

```txt
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://naturetranquille.fr/sitemap.xml
```

**AND** : Soumission Google Search Console :

- Phase 2 : création compte GSC
- Soumission sitemap manuellement
- Monitoring indexation (couverture, erreurs)

**Accessibility Integration**

- N/A (fichier XML technique)

**Performance & Technical Acceptance**

- Génération sitemap < 5s (même avec 100+ départements)
- Sitemap < 50KB (limite Google : 50MB, donc large marge)
- Format XML valide (validation W3C)
- Google Search Console : 0 erreurs sitemap

---

### Story 6.4: Deep linking départements avec carte auto-zoomée

**User Story**
En tant que **Tom cliquant sur un lien Google `/departements/bas-rhin-67`**, je veux arriver directement sur une carte centrée sur le Bas-Rhin avec les zones affichées, sans manipulation supplémentaire.

**Acceptance Criteria**

**GIVEN** : L'utilisateur accède à `/departements/bas-rhin-67` via lien externe
**WHEN** : La page charge
**THEN** :

- Carte MapLibre initialisée avec bounds département Bas-Rhin :

    ```typescript
    // Composant Map.tsx
    interface MapProps {
      initialCenter?: [number, number];
      initialZoom?: number;
      initialBounds?: [[number, number], [number, number]];
      highlightDepartement?: string;
    }

    export function Map({ initialBounds, highlightDepartement }: MapProps) {
      useEffect(() => {
        const map = new maplibregl.Map({
          container: 'map',
          style: OSM_STYLE_URL
        });

        map.on('load', () => {
          // Charger couche zones
          map.addSource('zones', { ... });
          map.addLayer({ ... });

          // Zoom sur bounds département
          if (initialBounds) {
            map.fitBounds(initialBounds, { padding: 50, duration: 0 });
          }

          // Highlight département optionnel (filter ou outline)
          if (highlightDepartement) {
            map.setFilter('zones-fill', ['==', ['get', 'code_departement'], highlightDepartement]);
          }
        });
      }, []);
    }
    ```

**AND** : Calcul bounds département côté serveur (Story 6.1) passé via props :

```tsx
// app/departements/[slug]/page.tsx
export default async function DepartementPage({params}) {
    const dept = await getDepartementBySlug(params.slug);
    const bounds = await getDepartementBounds(dept.code); // [[minLng, minLat], [maxLng, maxLat]]

    return <Map initialBounds={bounds} highlightDepartement={dept.code} />;
}
```

**AND** : État URL conservé (optionnel Phase 2) :

- URL avec query params : `/departements/bas-rhin-67?zone=12`
- Zoom initial sur zone spécifique si `?zone=ID`
- Partage URL direct état carte (utile pour signalements)

**Accessibility Integration**

- Page titre unique : "Zones sans chasse dans le Bas-Rhin"
- Annonce lecteur écran : "Carte centrée sur le Bas-Rhin, X zones affichées"
- Navigation breadcrumb fonctionnelle (retour liste départements)

**Performance & Technical Acceptance**

- Carte charge avec bounds pré-calculés (pas de fitBounds animation inutile)
- LCP < 2.5s (carte départment visible rapidement)
- Tuiles zoom département < 100KB total
- Deep link fonctionnel avec JavaScript désactivé (SSR carte statique screenshot Phase 2)

**Technical Notes**

- Bounds département cachés côté serveur (Redis/mémoire) pour éviter recalcul PostGIS chaque requête
- Phase 2 : génération image statique carte département (fallback JS disabled)

---

## Epic 7: Analytics & Tracking Umami

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

---

### Story 7.2: Événements customs analytics (search_address, select_address, click_zone)

**User Story**
En tant que **porteur du projet**, je veux que les trois interactions clés — recherche d'adresse, sélection d'une adresse et clic sur une zone — déclenchent des événements analytics custom dans Umami, afin de mesurer l'usage des fonctionnalités principales.

**Acceptance Criteria**

**GIVEN** : Le script Umami est intégré (Story 7.1) et `NEXT_PUBLIC_UMAMI_WEBSITE_ID` est renseigné
**WHEN** : L'utilisateur effectue une recherche, sélectionne une adresse ou clique sur une zone
**THEN** :

**Événement `search_address`** — déclenché dans le composant `SearchBar` lors de la soumission d'une query (après debounce de 300ms, au moment de l'appel à l'API Adresse) :

```typescript
// components/SearchBar.tsx
const handleSearch = (query: string) => {
    window.umami?.track('search_address', {query});
    // ... logic appel API Adresse
};
```

**Événement `select_address`** — déclenché dans `SearchBar` lors du clic sur une suggestion de l'autocomplete :

```typescript
// components/SearchBar.tsx
const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    window.umami?.track('select_address', {
        label: suggestion.label,
        type: suggestion.type, // 'municipality' | 'postcode' | 'street'
    });
    // ... logic zoom carte
};
```

**Événement `click_zone`** — déclenché dans le composant `Map` lors du clic sur un polygone de la carte :

```typescript
// components/Map.tsx
map.on('click', 'zones-fill', (event) => {
    const zone = event.features?.[0]?.properties;
    if (zone) {
        window.umami?.track('click_zone', {
            zone_name: zone.nom,
            zone_type: zone.type_protection,
        });
        // ... affichage détails zone
    }
});
```

**AND** : Les trois événements apparaissent dans le tableau de bord Umami sous "Custom events" avec leurs propriétés respectives

**AND** : Les événements utilisent l'opérateur optional chaining (`?.`) pour être silencieux si `window.umami` n'est pas encore chargé ou non configuré

**AND** : Aucune donnée personnelle identifiable n'est transmise (pas d'IP, pas d'email, pas d'identifiant utilisateur) — uniquement des données comportementales agrégées

**Accessibility Integration**

N/A (tracking invisible, aucune interaction UI ajoutée)

**Performance & Technical Acceptance**

- Appels `window.umami?.track()` synchrones et non bloquants (< 1ms d'impact)
- Aucun appel réseau supplémentaire visible dans le critical path des interactions (fire-and-forget)
- Tests unitaires vérifient que `window.umami.track` est appelé avec les bons arguments :

```typescript
// components/__tests__/SearchBar.test.tsx
it('tracks search_address event on search submission', () => {
    const mockTrack = jest.fn();
    Object.defineProperty(window, 'umami', {
        value: {track: mockTrack},
        writable: true,
    });

    // ... simulate search
    expect(mockTrack).toHaveBeenCalledWith('search_address', {query: 'Strasbourg'});
});
```

---

---

## Step 3 Completion Summary

✅ **Epic 0: Project Foundation & Local Development** — 5 stories

- Docker Compose setup, backend migrations, generic data import, MVT pipeline, documentation

✅ **Epic 1: Core Interactive Map Experience** — 4 stories

- MapLibre integration, zones display, responsive layout, performance optimization

✅ **Epic 2: Geographic Search & Navigation** — 5 stories

- Search autocomplete, zoom on result, geolocation, API Adresse integration, feedback states

✅ **Epic 3: Zone Information & Details** — 3 stories

- Popup/sidebar détails, responsive layout, données embarquées MVT

✅ **Epic 4: Transparency & Documentation** — 3 stories

- Disclaimer modal, page Sources, page À propos

✅ **Epic 5: User Feedback & Community** — 4 stories

- Formulaire signalement Zod validation, toast + email confirmation, protection spam honeypot/hCaptcha, stockage PostgreSQL

✅ **Epic 6: SEO & Discoverability** — 4 stories

- Routes départements/régions SSG, métadonnées dynamiques OpenGraph, sitemap XML, deep linking

✅ **Epic 7: Analytics & Tracking Umami** — 2 stories

- Intégration script Umami via next/script, 3 événements customs (search_address, select_address, click_zone)

---

**Total Stories : 29 stories**

**Functional Requirements Coverage : 42/42** ✅

**Non-Functional Requirements Integration :**

- Performance (NFR-PERF-1 à 7) : Epic 1 Story 1.4, Epic 0 Story 0.3
- Accessibility (NFR-ACC-1 à 7) : Intégrée dans CHAQUE story (keyboard nav, ARIA, WCAG AA)
- Reliability (NFR-REL-1 à 5) : Epic 2 Story 2.4 (fallback API), Epic 5 Story 5.2 (rate limiting)
- Integration (NFR-INT-1 à 5) : Epic 2 Story 2.4 (API Adresse), Epic 0 Story 0.3 (PostGIS)
- Maintainability (NFR-MAIN-1 à 7) : Epic 0 Story 0.4 (documentation), TypeScript + Zod validation
- Security (NFR-SEC-1 à 7) : Epic 5 Story 5.3 (honeypot spam), HTTPS obligatoire (architecture)

---

**Next Step (Step 4) : Validation finale et export**

- Vérification couverture complète requirements
- Export epics.md vers Jira/Linear/GitHub Issues (optionnel)
- Priorisation sprints avec Product Owner
