# Architecture NatureTranquille

## Vue d'ensemble

NatureTranquille est une application web cartographique permettant de visualiser les zones sans chasse en France. L'architecture repose sur une stack moderne avec Next.js pour le frontend, Express pour le backend API, et PostgreSQL + PostGIS pour le stockage et le traitement des données géospatiales.

## Diagramme d'Architecture

```mermaid
flowchart TB
    subgraph Client["Navigateur Utilisateur"]
        Browser[Next.js App]
        MapLibre[MapLibre GL JS]
    end

    subgraph Backend["Backend Services"]
        API[Express API<br/>Port 4000]
        Tiles[MVT Tiles Endpoint<br/>/tiles/{z}/{x}/{y}.mvt]
    end

    subgraph Database["Base de Données"]
        Postgres[(PostgreSQL 15<br/>+ PostGIS 3.4)]
    end

    subgraph External["Services Externes"]
        OSM[OpenStreetMap<br/>Fond de carte]
        Nominatim[API Adresse<br/>data.gouv.fr]
    end

    Browser -->|HTTP/HTTPS| API
    MapLibre -->|Requêtes Tuiles MVT| Tiles
    Tiles -->|ST_AsMVT Query| Postgres
    MapLibre -->|Fond de carte| OSM
    Browser -->|Géocodage| Nominatim
    API -->|CRUD Zones| Postgres

    style Browser fill:#3b82f6,color:#fff
    style API fill:#10b981,color:#fff
    style Postgres fill:#8b5cf6,color:#fff
    style MapLibre fill:#f59e0b,color:#fff
```

## Pipeline de Données

```mermaid
flowchart LR
    Raw[Données Sources<br/>Shapefile/GeoJSON]
    Import[Script Import<br/>ogr2ogr]
    Validate[Validation PostGIS<br/>ST_IsValid]
    Store[(Table zones_sans_chasse<br/>MULTIPOLYGON)]
    MVT[Génération MVT<br/>ST_AsMVT]
    Client[MapLibre Client]

    Raw -->|GDAL| Import
    Import -->|Transform WGS84| Validate
    Validate -->|INSERT| Store
    Store -->|HTTP Request| MVT
    MVT -->|Vector Tiles| Client

    style Raw fill:#ef4444,color:#fff
    style Store fill:#8b5cf6,color:#fff
    style Client fill:#3b82f6,color:#fff
```

## Composants Principaux

### Frontend (Next.js 14)

- **Framework** : Next.js 14 avec App Router
- **UI** : React 18, TypeScript, Tailwind CSS
- **Cartographie** : MapLibre GL JS 4.x
- **Rendu** : SSR (Server-Side Rendering) + CSR (Client-Side Rendering)
- **Optimisation** : Code-splitting, lazy loading, image optimization

**Responsabilités** :

- Affichage de la carte interactive
- Recherche géographique (villes, codes postaux, départements)
- Affichage détails zones (popup/sidebar)
- Interface responsive (mobile, tablet, desktop)
- Accessibilité WCAG AA

### Backend API (Express + TypeScript)

- **Framework** : Express 4.x
- **Langage** : TypeScript (Node.js 20)
- **Database Client** : node-postgres (pg)
- **Endpoints** :
    - `GET /health` : Health check
    - `GET /tiles/{z}/{x}/{y}.mvt` : Tuiles vectorielles (Story 0.3)
    - `POST /api/feedback` : Formulaires signalement (Epic 5)

**Responsabilités** :

- Génération tuiles vectorielles MVT
- Requêtes géospatiales optimisées (PostGIS)
- Validation et traitement feedback utilisateurs
- Rate limiting et sécurité

### Base de Données (PostgreSQL + PostGIS)

- **SGBD** : PostgreSQL 15
- **Extension** : PostGIS 3.4
- **Projection** : WGS84 (EPSG:4326)

**Schéma principal** :

```sql
CREATE TABLE zones_sans_chasse (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    type_protection VARCHAR(100),
    gestionnaire VARCHAR(255),
    source VARCHAR(255),
    date_maj DATE,
    geometry GEOMETRY(MULTIPOLYGON, 4326) NOT NULL
);

CREATE INDEX idx_zones_geom ON zones_sans_chasse USING GIST(geometry);
CREATE INDEX idx_zones_type ON zones_sans_chasse(type_protection);
```

**Responsabilités** :

- Stockage zones géospatiales
- Requêtes spatiales performantes (intersections, distances)
- Génération tuiles MVT via `ST_AsMVT()`
- Validation géométries (`ST_IsValid`, `ST_MakeValid`)

## Décisions Techniques

### Pourquoi PostGIS ?

- **Performance** : Indexes spatiaux GIST ultra-performants pour requêtes géospatiales
- **Standards** : Support complet OGC (ST_Intersects, ST_Within, etc.)
- **MVT natif** : Fonction `ST_AsMVT()` génère tuiles vectorielles directement
- **Maturité** : Écosystème robuste, documentation excellente

### Pourquoi MVT (Mapbox Vector Tiles) ?

- **Performance** : Taille fichier ~10x plus petite que GeoJSON
- **Scalabilité** : Cache navigateur + serveur efficace
- **Rendu** : Styles CSS-like côté client (flexibilité)
- **Standard** : Format ouvert, compatible MapLibre, Mapbox, Leaflet

### Pourquoi MapLibre (vs Leaflet) ?

- **WebGL** : Rendu accéléré GPU → 60 FPS sur mobile
- **Tuiles vectorielles** : Support natif MVT
- **Styling** : Styles complexes (gradients, data-driven)
- **Open Source** : Fork libre de Mapbox GL JS

### Pourquoi Docker Compose ?

- **Reproductibilité** : Environnement identique dev/prod
- **Isolation** : Pas de conflit dépendances système
- **Simplicité** : `docker compose up` démarre tout
- **Hot Reload** : Volumes montent code source → développement fluide

## Flux de Données Typiques

### 1. Chargement Carte Initiale

```
User → Browser → Next.js (SSR)
  ↓
MapLibre init → Request /tiles/6/32/21.mvt
  ↓
Backend API → ST_AsMVT(zones WHERE ST_Intersects(...))
  ↓
PostgreSQL → Return MVT bytes
  ↓
MapLibre → Render zones sur fond OSM
```

### 2. Recherche Géographique

```
User → Input "Strasbourg"
  ↓
Frontend → Debounce 300ms → api-adresse.data.gouv.fr/search
  ↓
API retourne bbox + coordonnées
  ↓
MapLibre → map.fitBounds(bbox)
  ↓
Request nouvelles tuiles MVT zoom++
```

### 3. Affichage Détails Zone

```
User → Clic polygone carte
  ↓
MapLibre → Event click → feature.properties
  ↓
Frontend → Affiche popup/sidebar avec:
  - nom, type_protection, gestionnaire
  - date_maj, source
```

## Performance & Optimisation

### Objectifs (NFR)

- **LCP** < 2.5s (75th percentile, 3G)
- **FID** < 100ms
- **CLS** < 0.1
- **Tuiles MVT** < 100ms génération

### Stratégies

1. **SSG** : Pages départements pré-générées (build-time)
2. **Code-splitting** : MapLibre chargé dynamiquement
3. **Cache** : Tuiles MVT cached 24h (navigateur + serveur)
4. **Indexes** : GIST spatial + B-tree sur type_protection
5. **Simplification** : Géométries simplifiées selon zoom (ST_Simplify)

## Sécurité

- **HTTPS** : 100% trafic (Let's Encrypt)
- **CORS** : Whitelist domaines autorisés
- **Rate Limiting** : 1 req/s Nominatim, 1 signalement/min/IP
- **SQL Injection** : Requêtes paramétrées (pg prepared statements)
- **CSRF** : Tokens Next.js built-in

## Monitoring & Logs

- **Logs** : Structured logging (JSON) avec timestamp
- **Errors** : Sentry (gratuit tier) ou logs agrégés
- **Uptime** : UptimeRobot (98%+ objectif)
- **Performance** : Lighthouse CI

## Évolution Future

### Phase 2 (Post-MVP)

- Authentification admin (import données via UI)
- Cache Redis tuiles MVT
- Service Worker (offline support)
- Export zones GeoJSON/KML
- API GraphQL (alternative REST)

### Scalabilité

- Hébergement : Scalingo, CleverCloud, Vercel
- CDN : Cloudflare (tuiles MVT)
- Database : PostgreSQL managed (Scalingo addon)
- Horizontal scaling : Load balancer + replicas backend

---

**Dernière mise à jour** : 27 mars 2026
**Version** : 0.1.0 (Epic 0 - Foundation)
