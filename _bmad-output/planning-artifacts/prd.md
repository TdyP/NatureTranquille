---
stepsCompleted:
    [
        'step-01-init',
        'step-02-discovery',
        'step-02b-vision',
        'step-02c-executive-summary',
        'step-03-success',
        'step-04-journeys',
    ]
inputDocuments:
    [
        '_bmad-output/planning-artifacts/product-brief-NatureTranquille-2026-02-27.md',
        '_bmad-output/planning-artifacts/research/technical-stockage-donnees-geolocalisees-pour-carte-research-2026-03-09.md',
        'Dataset RNCFS Grand Est (Shapefile - /home/teddy/Téléchargements/dataset-1773091694445/dataset/)',
    ]
workflowType: 'prd'
date: '2026-03-09'
author: 'Teddy'
project_name: 'NatureTranquille'
briefCount: 1
researchCount: 1
brainstormingCount: 0
projectDocsCount: 0
datasetCount: 1
classification:
    projectType: 'web_app'
    domain: 'civic_tech'
    complexity: 'medium'
    projectContext: 'greenfield'
---

# Product Requirements Document - NatureTranquille

**Author:** Teddy
**Date:** 2026-03-09

## Executive Summary

**NatureTranquille** est une application web cartographique qui centralise les zones sans chasse en France pour permettre au grand public de profiter de la nature en toute sécurité. Le produit répond à un besoin concret : des milliers de personnes — familles, photographes animaliers, cueilleurs de champignons — souhaitent se promener en forêt pendant la saison de chasse mais ne savent pas où aller sans risque. Les données existent (RNCFS, réserves naturelles, open data départementaux) mais sont éclatées, techniques et inaccessibles aux particuliers.

L'application agrège ces données géospatiales sur une carte interactive unique, permettant de visualiser d'un coup d'œil les zones protégées autour de soi. Avec géolocalisation, détails par zone (type de protection, mise à jour), et signalement d'erreurs, NatureTranquille transforme la frustration et le renoncement en action confiante. Le moment décisif : _"Je vois une zone verte près de chez moi, je peux enfin planifier ma sortie sereinement."_

La stratégie de lancement privilégie une approche progressive : phase pilote sur un territoire limité riche en open data, validation rapide avec utilisateurs réels, puis expansion nationale. Le MVP web responsive se concentre sur l'essentiel — consultation rapide de la carte avec transparence radicale sur la couverture des données (pas de fausse promesse d'exhaustivité).

### What Makes This Special

**Première centralisation nationale** : NatureTranquille sera le premier outil à agréger les zones sans chasse en France sur une vue d'ensemble accessible au grand public, là où aujourd'hui chacun doit naviguer entre sites gouvernementaux, SIG techniques et connaissances locales.

**Transparence radicale sur les limites** : contrairement à une approche qui promettrait une couverture exhaustive impossible à garantir, le produit affiche clairement ce qui est connu vs inconnu. Cette honnêteté renforce la confiance et évite les incidents.

**Positionnement factuel et apaisé** : l'outil présente l'information _"Voici les zones sans chasse"_ comme un fait utile pour planifier ses sorties, sans stigmatisation ni antagonisme envers les chasseurs. Ce n'est pas un outil militant — c'est un outil d'information pour faciliter la cohabitation des usages en nature.

**Démocratisation de données publiques existantes** : le produit ne crée pas de nouvelles données, il rend accessible ce qui existe déjà. L'insight clé : les particuliers ne peuvent pas exploiter des Shapefiles techniques ou naviguer dans les portails open data régionaux — il faut leur offrir une interface simple.

## Project Classification

**Type de Projet :** Web Application
Application web responsive (SPA) accessible via navigateur mobile et desktop, utilisant MapLibre GL JS pour l'affichage cartographique et tuiles vectorielles MVT pour la performance multi-zoom.

**Domaine :** Civic Tech / Information Citoyenne
Projet d'intérêt général visant à partager des données publiques géospatiales pour faciliter l'accès à la nature. Aucune réglementation lourde (type santé/finance), mais forte exigence de transparence sur la qualité et les limites des données.

**Niveau de Complexité :** Moyenne

- **Sophistication technique** : ingestion multi-sources de données géospatiales hétérogènes (Shapefile, GeoJSON, GeoPackage), validation géométrique (PostGIS), simplification adaptative par niveau de zoom, architecture tuiles vectorielles optimisée pour performance
- **Défis métier** : qualité et fraîcheur des données variables selon les sources, couverture territoriale progressive, gestion explicite de l'incertitude et des zones inconnues
- **Pas de compliance réglementaire lourde** : données ouvertes publiques, pas de RGPD complexe au MVP (pas de données personnelles)

**Contexte du Projet :** Greenfield
Nouveau produit créé from scratch sans legacy system existant. Architecture technique moderne (PostGIS + tuiles vectorielles + MapLibre) sélectionnée dès le départ.

## Success Criteria

### User Success

**Paradoxe de la mesure** : Un utilisateur qui trouve l'information recherchée quitte le site satisfait. Un utilisateur qui ne trouve pas quitte également. La mesure directe du succès utilisateur est donc difficile sans mécanisme de feedback actif.

**Métriques proxy d'engagement :**

- **Interaction avec les zones** : % de sessions avec au moins un clic sur une zone (indicateur que l'utilisateur consulte les informations disponibles)
- **Utilisation de la recherche** : % de sessions utilisant la recherche par localisation (ville/code postal/département) si implémentée
- **Durée de session** : temps moyen passé sur la carte (exploration vs abandon rapide)

**Mécanismes de feedback :**

- **Tracking RGPD-friendly** : analytics anonymes sans cookies tiers (respect vie privée, conformité réglementation)
- **Feedback button simple** : bouton "Signaler une erreur / Suggérer une amélioration" envoyant email direct, permettant retours qualitatifs utilisateurs

**Indicateur de succès ultime :** Utilisateur exprime satisfaction dans feedback volontaire (_"J'ai trouvé une zone près de chez moi"_, _"Enfin un outil simple pour planifier mes sorties"_).

### Business Success

**Objectif 6 mois :** 20 départements avec couverture complète de données validées

- Acquisition progressive de datasets auprès ACCA (Associations Communales de Chasse Agréées) et fédérations départementales de chasse
- Indicateur de croissance = expansion géographique mesurable et documentée

**Métriques secondaires :**

- **Adoption organique** : nombre d'utilisateurs uniques mensuels (cible à définir post-lancement MVP pilote)
- **Bouche-à-oreille** : mentions sur forums randonnée, réseaux sociaux, relais par associations nature (indicateur qualitatif)
- **Partenariats** : établir contact avec au moins une association de randonnée ou nature pour validation concept

**Viabilité projet :** En tant que projet non-lucratif, succès = utilité démontrée + couverture territoriale croissante + coûts maîtrisés (infrastructure simple).

### Technical Success

**Performance critique pour expérience utilisateur :**

- **Chargement initial carte** : < 2 secondes (temps entre arrivée sur site et carte interactive affichée)
- **Navigation fluide** : zoom et pan sans lag perceptible, transitions instantanées entre niveaux de zoom
- **Affichage détails zone** : < 500ms au clic sur une zone (données embarquées dans tuiles MVT ou API optimisée)
- **Recherche géographique** : < 1 seconde pour recherche par ville/code postal/département (si implémentée)

**Fiabilité et disponibilité :**

- **Uptime** : > 95% (tolérance maintenance et mises à jour données)
- **Gestion des erreurs** : messages clairs en cas d'échec de chargement ou zone de couverture inconnue
- **Validation données** : géométries PostGIS valides, aucune zone avec coordonnées erronées affichée

**Architecture contrainte coût (projet non-lucratif) :**

- **Infrastructure simple** : PostgreSQL + PostGIS + Backend API + Frontend (pas de CDN, pas de services managés coûteux)
- **Stack 100% open-source** : zéro coût de licensing
- **Optimisations backend** : cache serveur, index spatiaux GiST, simplification géométrique par zoom, tuiles vectorielles MVT pré-générées ou générées à la demande avec cache

### Measurable Outcomes

**MVP Launch Success (3 mois) :**

- Carte interactive fonctionnelle avec au moins 5 départements pilotes couverts
- Au moins 100 utilisateurs uniques testent le produit
- Taux d'interaction zones > 30% (sessions avec clic sur zone)
- Performance : chargement < 2s, détails < 500ms

**Growth Success (6 mois) :**

- 20 départements couverts avec données validées
- Feedback utilisateur majoritairement positif (> 70% retours satisfaits)
- Au moins un partenariat établi avec association randonnée/nature
- Infrastructure stable, coûts < 50€/mois

## Product Scope

### MVP - Minimum Viable Product

**Core Features (requis pour lancement) :**

**1. Carte Interactive**

- Affichage carte de France avec zones sans chasse sur fond cartographique (OpenStreetMap ou équivalent)
- Navigation fluide : zoom, pan, rotation
- Tuiles vectorielles MVT générées depuis PostGIS pour performance multi-zoom
- Simplification géométrique adaptative par niveau de zoom (Douglas-Peucker)
- Clustering visuel si densité zones élevée à faible zoom

**2. Détails des Zones**

- Clic sur zone → popup ou panneau latéral affichant :
    - Nom de la zone
    - Type de protection (RNCFS, réserve naturelle, etc.)
    - Organisme gestionnaire
    - Date de dernière mise à jour des données
    - Source des données (transparence)
- Affichage instantané (< 500ms) via données embarquées dans tuiles MVT

**3. Feedback Utilisateur**

- Bouton "Signaler une erreur" ou "Suggérer une amélioration"
- Formulaire simple envoyant email direct (pas de système tickets complexe au MVP)
- Champs : type de feedback, localisation concernée, description

**4. Tracking Anonyme**

- Analytics RGPD-friendly sans cookies tiers (Plausible, Matomo auto-hébergé, ou équivalent)
- Métriques collectées : pages vues, clics zones, utilisation recherche, temps session
- Respect vie privée : pas d'identification utilisateur, agrégation anonyme

**5. Couverture Initiale**

- 5 départements pilotes avec données complètes au lancement MVP (sélection basée sur disponibilité open data)
- Indicateur clair de couverture géographique sur carte (départements couverts vs non couverts)

**À évaluer selon complexité technique (MVP ou post-MVP) :**

**Géolocalisation Utilisateur**

- Bouton "Me localiser" utilisant API Geolocation navigateur
- Fonctionnelle sur mobile (GPS), peu fiable sur desktop (IP-based)
- Si implémentée : zoom automatique sur position utilisateur, indicateur visuel position sur carte

**Recherche par Localisation**

- Barre de recherche : ville, code postal, ou département
- Zoom automatique sur zone recherchée
- **Complexité technique à évaluer** :
    - Option A : API geocoding open-source (Nominatim) — nécessite appels externes
    - Option B : base locale codes postaux/villes — requiert données supplémentaires et indexation
- **Décision MVP** : à finaliser selon temps développement et dépendances

### Growth Features (Post-MVP)

**Phase 2 (3-6 mois post-lancement) :**

**Expansion Couverture**

- Atteindre 20 départements couverts
- Processus d'acquisition données ACCA et fédérations départementales documenté et automatisé

**Fonctionnalités Communautaires**

- Système de signalements utilisateurs amélioré (suivi statut, modération)
- Page "Contribuer" expliquant comment proposer nouvelles sources de données

**Amélioration UX**

- Filtres par type de zone (RNCFS, réserves naturelles, etc.)
- Partage de lien avec position/zoom spécifique
- Export de zones sélectionnées (GPX, KML) pour GPS/cartes hors-ligne

**Performance et Scalabilité**

- Pré-génération tuiles vectorielles pour zooms fréquents (réduction latence)
- Read replicas PostGIS si charge augmente significativement

### Vision (Future)

**Phase 3 (12+ mois) :**

**Couverture Nationale Complète**

- Tous départements français couverts
- Mise à jour automatique des données depuis sources gouvernementales (si APIs disponibles)

**Interdictions Temporelles**

- Affichage des périodes de chasse par département (calendriers cynégétiques)
- Sélecteur de date : "Où puis-je aller le [date] ?"
- Complexité : données temporelles variables par département, source de données à identifier

**Crowdsourcing Modéré**

- Contributions utilisateurs pour zones manquantes (terrains privés sans chasse, conventions locales)
- Modération avant publication pour garantir fiabilité
- **Incertitude technique importante** : validation données crowdsourcées, risque désinformation, responsabilité légale

**Application Mobile Native (PWA ou app native)**

- Mode hors-ligne avec cache tuiles
- Notifications géolocalisées ("Vous approchez d'une zone sans chasse")
- Intégration GPS temps réel pour randonneurs

**APIs Externes**

- API publique pour tiers (applications randonnée, associations nature)
- Documentation OpenAPI, rate limiting, clés API gratuites pour usage non-commercial
