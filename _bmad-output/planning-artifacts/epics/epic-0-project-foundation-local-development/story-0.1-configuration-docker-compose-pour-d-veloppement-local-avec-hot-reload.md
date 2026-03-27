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

