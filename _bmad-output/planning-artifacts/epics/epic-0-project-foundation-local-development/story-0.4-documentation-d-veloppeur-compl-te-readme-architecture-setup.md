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

