# NatureTranquille

Carte interactive des zones sans chasse en France : réserves naturelles, réserves de chasse. Trouvez les zones protégées près de chez vous pour profiter de la nature en toute sérénité.

## 🚀 Quick Start

### Prérequis

- [Docker](https://docs.docker.com/get-docker/) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0+)

### Démarrage de l'environnement de développement

1. **Cloner le repository**

    ```bash
    git clone https://github.com/TdyP/NatureTranquille.git
    cd NatureTranquille
    ```

2. **Configurer les variables d'environnement**

    ```bash
    cp .env.example .env
    # Modifier .env si nécessaire (les valeurs par défaut fonctionnent pour le développement local)
    ```

3. **Démarrer les services Docker**

    ```bash
    docker compose up -d
    ```

    Cela démarre 3 containers :
    - `frontend` : Next.js sur http://localhost:3000
    - `backend` : API Express sur http://localhost:4000
    - `db` : PostgreSQL + PostGIS sur localhost:5432

    Note: Au premier démarrage, `npm install` s'exécute automatiquement dans les containers frontend et backend.

4. **Vérifier que tout fonctionne**

    ```bash
    # Voir les logs des services
    docker compose logs -f

    # Vérifier la santé du backend
    curl http://localhost:4000/health

    # Accéder au frontend
    open http://localhost:3000
    ```

### Arrêter les services

```bash
docker compose down
```

### Rebuild les containers (après modification des dépendances)

```bash
docker compose down
docker compose up -d --build
```

Note: Avec l'image `node:24-alpine` directe (pas de Dockerfile), le rebuild n'est généralement pas nécessaire. Les dépendances sont installées au démarrage via `npm install`.

## 📚 Architecture

### Stack Technique

- **Frontend** : Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, MapLibre GL JS 4.x
- **Backend** : Node.js 20, Express, TypeScript
- **Base de données** : PostgreSQL 15 + PostGIS 3.4
- **Tuiles vectorielles** : Format MVT (Mapbox Vector Tiles)
- **Fond de carte** : OpenStreetMap

### Structure du projet

```
NatureTranquille/
├── frontend/           # Application Next.js
│   ├── app/           # App Router (pages, layouts)
│   ├── components/    # Composants React réutilisables
│   └── public/        # Assets statiques
├── backend/           # API Express
│   └── src/           # Code source TypeScript
├── data/              # Données géospatiales
│   ├── raw/          # Données sources (Shapefile, GeoJSON)
│   └── processed/    # Données traitées
├── scripts/          # Scripts d'import de données
├── docs/             # Documentation technique
└── docker-compose.yml
```

Pour plus de détails sur l'architecture, voir [docs/architecture.md](docs/architecture.md).

## 🔧 Développement

### Hot Reload

Les volumes Docker sont configurés pour le hot reload automatique :

- **Frontend** : Modification de fichiers dans `frontend/` → rechargement automatique dans le navigateur
- **Backend** : Modification de fichiers dans `backend/src/` → redémarrage automatique du serveur (tsx watch)

### Variables d'environnement

Voir `.env.example` pour la liste complète. Principales variables :

```env
# Database
POSTGRES_DB=naturetranquille
POSTGRES_USER=postgres
POSTGRES_PASSWORD=changeme

# Backend
API_PORT=4000
DATABASE_URL=postgresql://postgres:changeme@db:5432/naturetranquille

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_MAPLIBRE_STYLE=https://demotiles.maplibre.org/style.json
```

### Import de données

Les données géospatiales (réserves de chasse, réserves locales) doivent être placées dans `data/raw/` puis importées via un script (Story 0.2, à venir).

## 🧪 Tests

Tests unitaires et E2E à venir (Epic suivi).

## 📖 Documentation

- [Architecture détaillée](docs/architecture.md) - Diagrammes, décisions techniques
- [Guide d'import de données](docs/import-data.md) (à venir)
- [Contribution](CONTRIBUTING.md) (à venir)

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les guidelines (à venir).

## 📝 License

MIT License - voir [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- Données réserves de chasse : [Office Français de la Biodiversité](https://www.ofb.gouv.fr/)
- Fond de carte : [OpenStreetMap](https://www.openstreetmap.org/)
- Géocodage : [API Adresse data.gouv.fr](https://adresse.data.gouv.fr/)

## 📞 Contact

Pour toute question ou suggestion, ouvrir une [issue GitHub](https://github.com/TdyP/NatureTranquille/issues).
