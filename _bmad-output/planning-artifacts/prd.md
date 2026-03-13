---
stepsCompleted:
    [
        'step-01-init',
        'step-02-discovery',
        'step-02b-vision',
        'step-02c-executive-summary',
        'step-03-success',
        'step-04-journeys',
        'step-05-domain',
        'step-06-innovation',
        'step-07-project-type',
        'step-08-scoping',
        'step-09-functional',
        'step-10-nonfunctional',
        'step-11-polish',
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

## User Journeys

### Journey 1 : Tom — Balade en Famille le Dimanche

**Persona :** Tom, 38 ans, papa de deux enfants en bas âge (Léa 4 ans, Hugo 6 ans), région lyonnaise. Veut emmener ses enfants se promener en forêt le dimanche sans prendre de risque pendant la saison de chasse.

#### Happy Path : "Dimanche Matin en Confiance"

**Opening Scene — La Frustration du Samedi Soir**

Tom est assis à son bureau samedi soir après avoir couché ses deux enfants. Demain dimanche, il fait beau pour la première fois depuis deux semaines. Il veut emmener les enfants en forêt près de chez lui (Givors, région lyonnaise), mais c'est novembre — pleine saison de chasse. L'année dernière, il a renoncé à plusieurs sorties par peur. Ses collègues chasseurs lui ont dit "reste sur les sentiers balisés", mais les enfants veulent courir, explorer, ramasser des feuilles. Simplement suivre un chemin forestier ne suffit pas pour une sortie épanouissante avec des tout-petits.

**Rising Action — La Découverte**

Tom tape "zones sans chasse Lyon" sur Google. Il tombe sur NatureTranquille. La page charge instantanément : une carte interactive de la région lyonnaise s'affiche. Le site propose une barre de recherche — il tape "Givors 69700". La carte zoom automatiquement sur sa zone. Autour de lui, il voit quelques zones vertes (zones sans chasse identifiées) sur fond de carte standard. À 8 km de chez lui, une grande zone verte attire son attention : il clique dessus.

Popup instantanée (< 500ms) : **"Réserve Naturelle Régionale des Gorges de la Loire - Pilat Sud"** — Type : Réserve Naturelle — Statut : Chasse interdite toute l'année — Gestionnaire : Parc Naturel Régional du Pilat — Données mises à jour : 15/10/2025.

**Climax — Le Moment "Aha!"**

Tom réalise : _"Je ne savais même pas qu'il y avait une réserve naturelle à 8km de chez moi. Je peux y aller tranquille avec les enfants sans me poser de questions."_ Il zoome sur la zone, explore les contours du polygone sur la carte, repère un parking d'accès via le fond de carte OpenStreetMap. Il enregistre mentalement l'endroit.

**Resolution — Dimanche Après-Midi Serein**

Dimanche 14h, Tom et ses enfants courent dans la réserve, ramassent des feuilles colorées, observent des traces d'animaux, explorent librement. Zéro stress, zéro inquiétude. Les enfants sont ravis, Tom est détendu. En rentrant, il partage le lien NatureTranquille au groupe WhatsApp des parents d'élèves de l'école : _"Les gars, j'ai trouvé un outil génial pour trouver des zones sans chasse pour les balades du weekend."_

#### Edge Case : "La Carte Vide — Pas de Données Disponibles"

**Scénario Alternatif**

Tom recherche "Givors 69700". La carte zoom sur sa zone... mais elle est quasiment vide. Aucune zone verte visible à proximité immédiate. Il se demande : _"Ça veut dire qu'il n'y a aucune zone sans chasse près de chez moi ?"_

**Gestion de l'Incertitude**

Tom remarque un bandeau d'information discret mais visible en haut de la carte (ou un bouton "ℹ️ À propos" bien placé). Il clique. Message clair :

_"**Important :** Cette carte affiche uniquement les zones sans chasse que nous avons pu identifier et valider à ce jour. **L'absence de zone affichée ne signifie PAS que la chasse est nécessairement autorisée partout** — cela peut aussi signifier que nous n'avons pas encore de données pour cette région. Nos données évoluent progressivement selon les sources accessibles (RNCFS nationales, réserves naturelles, open data départementaux). Consultez notre page 'Sources de données' pour connaître la couverture actuelle."_

Tom clique sur "Sources de données" → il voit une liste : _"Sources actuellement intégrées : RNCFS nationales (toute la France), Réserves Naturelles Nationales, Open data départementaux : [liste des départements couverts]. Le Rhône (69) sera intégré dans notre prochaine phase d'expansion (Q2 2026)."_

**Récupération**

Tom comprend la situation. Il utilise le bouton **"Signaler mon intérêt pour cette zone"** (feedback simple) pour indiquer qu'il aimerait avoir des données pour le Rhône. Il reçoit un email de confirmation automatique : _"Merci pour votre intérêt. Le département du Rhône est prévu dans notre prochaine phase d'expansion. Nous vous tiendrons informé."_

En attendant, Tom élargit sa zone de recherche, dézoome, cherche dans les départements voisins. Il trouve une RNCFS dans la Loire (42) à 25 km — acceptable pour une sortie exceptionnelle d'une journée complète.

---

### Journey 2 : Marie — Affût Photographique Animalier

**Persona :** Marie, 52 ans, photographe animalière semi-professionnelle, cherche des spots d'affût pour photographier la faune sauvage (cerfs, chevreuils) sans perturbation humaine (chasseurs).

#### Happy Path : "Trouver le Spot Parfait"

**Opening Scene — La Photographe Frustrée**

Marie prépare une session d'affût pour photographier des cerfs en période de brame (septembre-octobre). Elle connaît un excellent coin dans les Vosges, mais c'est en pleine zone de chasse intensive. Elle a déjà eu des expériences désagréables : chasseurs énervés de voir quelqu'un dans "leur" zone, coups de feu trop proches, animaux stressés et fuyants. Elle cherche un spot équivalent **sans chasseurs**, où les animaux sont tranquilles et où elle peut installer son affût sans risque ni conflit.

**Rising Action — Exploration Stratégique**

Marie trouve NatureTranquille via un forum de photographes nature (quelqu'un a posté le lien avec enthousiasme). Elle charge la carte, tape "Vosges" dans la recherche. La carte affiche la région avec plusieurs zones vertes. Elle explore méthodiquement : elle veut une **RNCFS** (Réserve Nationale de Chasse et de Faune Sauvage) ou une grande réserve naturelle, idéalement avec forêt dense et proximité d'un cours d'eau (habitat idéal pour cerfs).

Elle clique sur plusieurs zones pour examiner les détails. Une retient particulièrement son attention : **"RNCFS de la Petite-Pierre - Bas-Rhin (67)"** — 2800 hectares, forêt mixte. Elle note les coordonnées GPS approximatives des contours.

**Climax — Validation du Spot**

Marie fait un cross-check avec Google Maps en mode satellite : la zone RNCFS affichée sur NatureTranquille correspond effectivement à une vaste forêt dense avec relief et un ruisseau traversant. Parfait. Elle prépare son matériel photo (téléobjectif, trépied, tenue camouflage), planifie son voyage.

**Resolution — L'Affût Réussi**

Deux semaines plus tard, Marie passe trois jours en affût dans la RNCFS de la Petite-Pierre. Zéro perturbation humaine, zéro coup de feu, animaux détendus et naturels. Elle obtient des clichés magnifiques de cerfs au lever du soleil. De retour chez elle, elle poste sur Instagram avec le hashtag #NatureTranquille : _"Enfin un outil pour trouver des spots nature vraiment tranquilles ! Merci @NatureTranquille"_ — recommande vivement l'outil à sa communauté de 3000 followers photographes animaliers.

#### Edge Case : "Doute sur la Fiabilité des Données — Confusion Terrain"

**Scénario Alternatif**

Marie arrive sur place dans une zone marquée "RNCFS" sur NatureTranquille. En marchant vers le spot d'affût qu'elle a repéré, elle croise un panneau local indiquant "Propriété privée - Chasse réservée au propriétaire". Confusion et inquiétude : les données de NatureTranquille sont-elles fausses ?

**Récupération Proactive**

Marie, méthodique, utilise immédiatement le bouton **"Signaler une erreur"** accessible depuis son smartphone (version mobile responsive du site). Elle remplit le formulaire simple :
- Type : Erreur potentielle sur statut zone
- Localisation : [GPS automatique si autorisé, sinon description]
- Description : _"Zone affichée comme RNCFS mais panneau 'Chasse réservée propriétaire' sur place. Coordonnées GPS : [lat, lon]. Photo du panneau en pièce jointe si possible."_

Elle reçoit un email de confirmation immédiat : _"Merci pour votre signalement. Nous allons vérifier et vous tiendrons informé sous 48-72h."_

**Réponse Transparente**

48h plus tard, Marie reçoit un email de réponse personnalisé (géré manuellement par équipe NatureTranquille au MVP) :

_"Merci pour votre signalement précis. Nous avons vérifié auprès de l'Office Français de la Biodiversité : la zone est bien classée en RNCFS depuis 2018 suite au rachat de la propriété privée par l'État. Le panneau que vous avez vu est obsolète et aurait dû être retiré. Nous avons ajouté une note de clarification dans les détails de cette zone sur la carte : 'Ancienne propriété privée, RNCFS depuis 2018, panneaux obsolètes possibles sur terrain.' Merci de contribuer à améliorer la fiabilité de nos données."_

Marie apprécie énormément la réactivité et la transparence. Sa confiance dans l'outil est renforcée — elle sait que les données sont vérifiées et que l'équipe est à l'écoute.

---

### Journey 3 : Mireille — Cueillette de Champignons Sécurisée

**Persona :** Mireille, 64 ans, retraitée passionnée de mycologie, adore la cueillette de champignons mais redoute la période de chasse (trop de stress, trop de bruit, sentiment d'insécurité dans ses coins habituels).

#### Happy Path : "Le Coin à Cèpes Tranquille"

**Opening Scene — La Cueilleuse Prudente**

Mireille adore la cueillette de champignons. Octobre est la saison parfaite pour les cèpes et girolles, mais c'est aussi l'ouverture générale de la chasse. Elle a un coin secret qu'elle fréquente depuis des années dans la forêt près de Bergerac (Dordogne), mais elle n'ose plus y aller seule pendant la chasse. Trop de chasseurs, trop de bruit, trop de stress. Elle a 64 ans et ne veut plus prendre de risques. Résultat : elle renonce souvent à ses sorties préférées de l'année.

**Rising Action — Recherche d'Alternatives**

Son fils, qui la visite pour le weekend, lui parle de NatureTranquille qu'il a découvert sur un forum de randonnée. Mireille, moyennement à l'aise avec Internet mais curieuse, se fait aider par son fils pour charger le site. Elle tape "Bergerac" dans la barre de recherche (interface simple, gros boutons clairs). La carte zoom automatiquement sur la Dordogne. Elle voit plusieurs zones vertes éparpillées autour.

Son fils l'aide à cliquer sur la zone la plus proche : **"Réserve Biologique de la Bessède"** — 1200 hectares, forêt de chênes et châtaigniers (parfait pour cèpes !). Détails : _"Chasse interdite - Gestion ONF - Accès public autorisé."_ Date de mise à jour : récente.

**Climax — La Trouvaille Inattendue**

Mireille est surprise et ravie : _"Je ne savais même pas qu'il y avait une réserve ici ! Et en plus c'est des chênes et châtaigniers, exactement ce qu'il faut pour les cèpes !"_ Son fils l'aide à zoomer sur la zone, repérer un chemin forestier accessible en voiture (visible sur le fond de carte). Mireille note l'itinéraire.

**Resolution — La Balade Apaisée**

Le lendemain, Mireille passe trois heures dans la Réserve Biologique de la Bessède. Elle remplit son panier de cèpes magnifiques, profite du calme de la forêt, zéro stress, zéro coup de feu au loin. Elle revient enchantée. La semaine suivante, lors de la réunion mensuelle de son club de mycologie local (20 membres actifs), elle raconte sa découverte et recommande chaudement NatureTranquille. Plusieurs membres âgés du club, qui avaient également renoncé à leurs sorties automnales, sont très intéressés.

#### Edge Case : "Accessibilité Physique Floue"

**Scénario Alternatif**

Mireille trouve une zone verte parfaite sur NatureTranquille : grande réserve naturelle, proche de chez elle, forêt de feuillus. Elle se rend sur place avec enthousiasme. Arrivée à l'entrée supposée (selon le fond de carte OpenStreetMap), elle découvre une barrière forestière verrouillée et un panneau _"Accès réglementé - Autorisation ONF requise"_. Déçue et frustrée après 30 minutes de route, elle doit faire demi-tour.

**Récupération et Feedback**

De retour chez elle, Mireille (avec l'aide de son fils) utilise le bouton **"Suggérer une amélioration"**. Elle écrit : _"Zone [nom de la réserve] est bien sans chasse, mais l'accès est verrouillé (barrière ONF). Serait-il possible d'ajouter une information d'accessibilité dans les détails ? Ça m'éviterait de faire le déplacement pour rien."_

**Note Produit**

L'équipe NatureTranquille note ce feedback précieux pour une amélioration future (post-MVP) : ajouter un champ **"Accessibilité"** dans les détails de zone (libre accès / autorisation requise / accès limité saisonnalité). Au MVP, cette information n'est pas disponible systématiquement, mais le feedback est archivé pour priorisation roadmap.

En attendant, Mireille a appris : elle vérifie désormais sur Google Maps Street View (quand disponible) ou appelle l'organisme gestionnaire avant de se déplacer vers une nouvelle zone. Elle trouve quand même deux autres zones sans chasse accessibles dans un rayon de 20 km et continue à utiliser l'outil régulièrement.

---

### Journey Requirements Summary

Ces trois user journeys narratifs révèlent les capacités et exigences fonctionnelles suivantes pour NatureTranquille :

#### Capacités Core (Requis MVP)

**Recherche et Navigation :**
- Recherche géographique par ville, code postal ou département (crucial pour Tom et Mireille, car géoloc desktop peu fiable)
- Zoom automatique sur zone recherchée
- Navigation carte fluide (zoom, pan) avec performance instantanée
- Fond de carte lisible (OpenStreetMap ou équivalent)

**Affichage Zones :**
- Polygones zones sans chasse affichés visuellement (zones vertes sur carte)
- Clic sur zone → popup/panneau détails instantané (< 500ms)
- Détail zone : nom, type de protection, gestionnaire, date mise à jour données, source

**Transparence Critique :**
- **Disclaimer/Avertissement visible** expliquant que :
  - Carte affiche SEULEMENT zones sans chasse connues
  - Absence de zone ≠ chasse autorisée partout (peut être manque de données)
  - Données évoluent progressivement
- **Page "Sources de données" ou "À propos"** listant :
  - Sources actuellement intégrées (RNCFS, réserves naturelles, départements couverts)
  - Roadmap expansion (départements prévus)
  - Méthodologie de validation données

**Feedback Utilisateur :**
- Bouton **"Signaler une erreur"** facilement accessible
- Bouton **"Suggérer une amélioration"** ou **"Signaler mon intérêt pour cette zone"**
- Formulaire simple envoyant email direct (pas de système tickets complexe au MVP)
- Confirmation immédiate + réponse personnalisée sous 48-72h (gestion manuelle MVP)

**UX Mobile-Friendly :**
- Site web responsive fonctionnel sur mobile (Marie en affût, Mireille avec aide fils)
- Formulaires accessibles sur smartphone
- Performance maintenue sur connexion mobile

#### Informations Critiques Révélées par Edge Cases

**Gestion de l'Incertitude (Tom - carte vide) :**
- Communication claire sur couverture partielle
- Pas de fausse promesse d'exhaustivité
- Indication des zones prévues en expansion

**Fiabilité et Confiance (Marie - confusion terrain) :**
- Système de signalement erreurs réactif
- Vérification données et réponse transparente
- Ajout de notes de clarification sur zones ambiguës
- Date de mise à jour visible pour chaque zone

**Accessibilité Physique (Mireille - barrière) :**
- Future amélioration post-MVP : champ "Accessibilité" dans détails zone
- Au MVP : permettre feedback pour archiver ces besoins

#### Parcours Émotionnels Clés

**Tom :** Frustration/renoncement → Découverte/soulagement → Confiance/partage

**Marie :** Conflit/stress → Recherche stratégique → Validation/sérénité → Fidélisation par réactivité

**Mireille :** Peur/abandon tradition → Aide familiale/découverte → Joie retrouvée → Évangélisation communauté

#### Architecture Technique Impliquée

- Tuiles vectorielles MVT pour performance multi-zoom
- Recherche géocodage (Nominatim OSS ou base locale codes postaux)
- Backend API léger pour détails zones (< 500ms)
- Formulaires feedback envoi email (SMTP simple)
- Base PostGIS avec dates de mise à jour par zone

---

## Domain-Specific Requirements: Civic Tech & Open Data

En tant que projet civic tech destiné au grand public français et reposant sur des données publiques, **NatureTranquille** doit respecter des exigences spécifiques au domaine pour garantir la confiance, l'accessibilité universelle et la conformité réglementaire.

### 5.1 Accessibilité Numérique (RGAA)

**L'accessibilité est primordiale** — NatureTranquille doit être utilisable par tous les publics, y compris les personnes en situation de handicap.

#### Conformité RGAA 4.1

Le site web doit respecter le **Référentiel Général d'Amélioration de l'Accessibilité (RGAA 4.1)**, normes françaises basées sur WCAG 2.1 niveau AA minimum.

**Exigences MVP (Niveau AA minimum) :**

**1. Perceptibilité :**
- **Contrastes suffisants** : ratios de contraste ≥ 4.5:1 pour texte normal, ≥ 3:1 pour texte large et éléments interactifs
  - Zones vertes sur carte : contraste suffisant avec fond OSM
  - Texte des disclaimers et avertissements : contraste maximal (noir sur blanc ou équivalent)
- **Alternatives textuelles** : attributs `alt` pour toutes images/icônes
- **Informations ne reposant pas uniquement sur la couleur** : zones sans chasse identifiables par motif/forme en plus de couleur verte
- **Adaptation responsiveness** : zoom texte jusqu'à 200% sans perte d'information

**2. Opérabilité :**
- **Navigation clavier complète** : 
  - Map navigable au clavier (touches fléchées, +/- pour zoom)
  - Focus visible sur tous éléments interactifs (boutons, liens, contrôles carte)
  - Ordre de tabulation logique
- **Temps suffisants** : pas de limite de temps imposée pour formulaires feedback
- **Titres de page descriptifs** : `<title>` précis (`NatureTranquille - Carte zones sans chasse`)
- **Labels de formulaires explicites** : tous champs avec `<label>` associé

**3. Compréhensibilité :**
- **Langue déclarée** : `lang="fr"` sur `<html>`
- **Messages d'erreur clairs** : validation formulaires avec messages explicites
- **Aide contextuelle** : tooltips/infobulles pour termes techniques (RNCFS, etc.)
- **Navigation cohérente** : structure HTML5 sémantique (`<header>`, `<main>`, `<nav>`, `<footer>`)

**4. Robustesse :**
- **HTML5 valide** : validation W3C sans erreurs critiques
- **Compatibilité technologies d'assistance** : test avec lecteur d'écran (NVDA/JAWS)
- **ARIA landmarks** : régions principales identifiées (`role="main"`, `role="navigation"`, etc.)

#### Cas Spécifiques Carte Interactive

**MapLibre GL JS + Accessibilité :**
- Attribution de controlles carte accessibles au clavier
- Description textuelle alternative pour carte (ex: liste zones sans chasse sous la carte pour lecteurs d'écran)
- Boutons zoom/contrôles avec labels ARIA (`aria-label="Zoom avant"`)
- Gestion focus trap dans popups/modales de détails zone

#### Validation et Tests

**Au MVP :**
- Auto-évaluation RGAA via checklist officielle
- Tests manuels avec lecteur d'écran (NVDA gratuit)
- Validation HTML5 automatique (W3C validator)
- Tests navigation clavier par équipe

**Post-MVP (si financement/croissance) :**
- Audit externe RGAA complet par organisme certifié
- Déclaration d'accessibilité publiée sur le site (obligatoire pour services publics, recommandé ici)
- Schéma pluriannuel d'accessibilité si expansion significative

### 5.2 Licences et Conformité Open Data

#### Sources de Données

NatureTranquille agrège des données publiques sous diverses licences. **Exigence de conformité stricte** pour éviter tout problème légal.

**Licences Attendues :**
- **Licence Ouverte v2.0 (Etalab)** : licence par défaut pour données publiques françaises (open data départementaux, RNCFS)
- **ODbL (Open Database License)** : possible pour données OpenStreetMap (fond de carte)
- **Creative Commons BY (CC-BY)** : certaines bases collaborative

**Obligations de Conformité :**

1. **Attribution obligatoire** : 
   - Page **"Sources de données"** citant toutes sources avec liens
   - Format : `Données RNCFS - Office National des Forêts (ONF) - Licence Ouverte v2.0`
   - Attribution visible dans footer du site + page dédiée

2. **Respect des conditions de réutilisation** :
   - Pas de sous-licence restrictive (NatureTranquille reste gratuit et ouvert)
   - Pas de prétention à propriété des données sources
   - Mention explicite des licences dans code source (README.md)

3. **Données dérivées** :
   - Si transformation/agrégation significative → documentation méthodologie
   - Garder traçabilité source d'origine par zone (champ `data_source` en base)

4. **Document de conformité** :
   - Tableau de suivi licences : `docs/data-sources-licenses.md`
   - Mise à jour à chaque ajout de source de données

### 5.3 Disclaimers et Limitation de Responsabilité

Projet civic tech basé sur données tierces → **protection juridique nécessaire** contre utilisation inadéquate.

#### Disclaimer Principal (Obligatoire MVP)

**Emplacement** : Page d'accueil + footer + popup premier accès

**Contenu Minimum :**

> **⚠️ Avertissement Important**
>
> NatureTranquille est un outil d'information à titre indicatif uniquement. Cette carte affiche les zones sans chasse **connues et documentées** à partir de sources publiques.
>
> **Limitations :**
> - L'absence de zone affichée ne signifie PAS que la chasse est autorisée partout
> - Les données peuvent être incomplètes ou obsolètes malgré nos efforts de mise à jour
> - Certains départements ne sont pas encore couverts
>
> **Responsabilité :**
> - Vérifiez toujours localement avant toute sortie en nature (mairie, ONF, panneaux terrain)
> - NatureTranquille ne peut être tenu responsable d'incidents liés à l'usage de cette carte
> - Les utilisateurs sont seuls responsables de leurs décisions sur le terrain
>
> En utilisant ce site, vous acceptez ces conditions.

#### Disclaimer Légal Complet

Page **"Mentions légales"** avec :
- Éditeur du site (nom/contact responsable projet)
- Hébergeur (conformité RGPD)
- Propriété intellectuelle (licences code/données)
- Limitation de responsabilité détaillée
- Politique de confidentialité (même si pas de cookies tiers)
- Conditions générales d'utilisation (CGU) simples

#### Gestion des Signalements

**Clause "Pas de Garantie de Mise à Jour Immédiate" :**
- Les signalements d'erreurs sont traités manuellement sous 48-72h
- Pas de SLA (Service Level Agreement) garantis au MVP
- Transparence sur délais : `"Nous traitons les signalements dans les meilleurs délais, généralement sous 72h"`

### 5.4 Protection des Données (RGPD)

Bien que mentionné dans Success Criteria, consolidation ici des exigences spécifiques au domaine civic tech.

#### Principes Appliqués au MVP

**1. Minimisation des Données :**
- Pas de comptes utilisateurs → pas de données personnelles stockées
- Formulaires feedback : email optionnel (utilisateur peut choisir anonymat)
- Pas de cookies analytics tiers (conformité stricte)

**2. Analytics Anonymes (Post-MVP) :**
- Si métriques nécessaires : Matomo auto-hébergé (alternative RGPD-friendly à Google Analytics)
- Anonymisation IP obligatoire
- Opt-out facile pour utilisateurs
- Pas de tracking cross-site

**3. Transparence :**
- Politique de confidentialité claire expliquant :
  - Quelles données collectées (aucune au MVP sauf emails volontaires feedback)
  - Combien de temps conservées (emails feedback : 1 an puis suppression)
  - Droits utilisateurs (accès, rectification, suppression)

**4. Sécurité :**
- HTTPS obligatoire (certificat Let's Encrypt gratuit)
- Formulaires protégés contre spam (CAPTCHA simple ou honeypot)
- Pas de transmission données sensibles

### 5.5 Citation des Sources et Transparence Méthodologique

Au-delà de la conformité licences, la crédibilité civic tech exige **transparence sur la provenance et fiabilité des données**.

#### Page "Sources de Données" (MVP)

**Contenu Minimum :**

1. **Liste des sources actuelles** :
   - RNCFS (Réseau National de Chasse et Faune Sauvage) - ONF - Licence Ouverte v2.0
   - Réserves Naturelles Nationales - data.gouv.fr - Licence Ouverte v2.0  
   - Open data départementaux intégrés (liste par département)

2. **Méthodologie de validation** :
   - Comment les données sont vérifiées avant intégration
   - Fréquence de mise à jour (mensuelle, trimestrielle selon source)
   - Process de traitement des signalements utilisateurs

3. **Roadmap d'expansion** :
   - Départements prévus prochainement
   - Sources de données en cours d'intégration
   - Appel à contribution : départements peuvent proposer leurs données

4. **Limites connues** :
   - Zones géographiques non couvertes
   - Types de protections non encore intégrées
   - Délais de mise à jour moyens

#### Mentions sur Détails de Zone

Chaque popup/détail de zone doit afficher :
- **Source** : `Source: RNCFS Grand Est`
- **Date de mise à jour** : `Dernière mise à jour: 15 janvier 2026`
- **Lien vers source originale** (si disponible publiquement)

### 5.6 Conformité et Suivi

#### Checklist de Lancement MVP

Avant mise en production, validation obligatoire :

- [ ] **Accessibilité** : auto-évaluation RGAA 80% critères niveau A/AA respectés
- [ ] **Licences** : tableau `docs/data-sources-licenses.md` complet et à jour
- [ ] **Disclaimers** : avertissement visible page d'accueil + mentions légales publiées
- [ ] **RGPD** : politique confidentialité publiée, HTTPS actif, pas de cookies tiers
- [ ] **Sources** : page "Sources de données" avec toutes attributions

#### Responsable Conformité

**Rôle** : Teddy (porteur projet) responsable de la conformité au lancement.

**Post-MVP** : si équipe s'étoffe, désigner "Data Protection Officer" (DPO) bénévole.

#### Revue Périodique

- **Trimestrielle** : vérification licences sources nouvelles intégrées
- **Semestrielle** : test accessibilité régression (nouveaux features)
- **Annuelle** : audit complet conformité (RGAA, RGPD, disclaimers)

---

## Innovation & Novel Patterns

### Detected Innovation Areas

**1. Première Centralisation Accessible au Grand Public**

NatureTranquille sera la **première application grand public à centraliser les zones sans chasse en France** sur une carte interactive unique et accessible. Recherches préliminaires (Google, data.gouv.fr) n'ont révélé aucun équivalent fonctionnel au 09 mars 2026. Deux hypothèses :
- Aucune initiative similaire n'existe actuellement
- Une initiative existe mais est si mal référencée qu'elle est invisible (ce qui équivaut à une non-existence pour le grand public)

**Innovation Type** : First-to-market dans une niche non servie (agrégation données publiques éclatées + interface accessible).

**2. Transparence Radicale comme Stratégie de Crédibilité**

Positionnement **contre-intuitif** pour une application cartographique : plutôt que de promettre l'exhaustivité (approche marketing classique), NatureTranquille affiche **clairement les limites et incertitudes** :
- Disclaimer visible : "Carte affiche SEULEMENT zones connues"
- Communication honnête sur couverture partielle et évolution progressive
- Page "Sources de données" avec roadmap d'expansion

**Justification Stratégique** : L'obtention de données complètes est **intrinsèquement difficile** (départements fragmentés, relations institutionnelles, validation qualité). Promettre l'exhaustivité créerait attentes irréalistes et perte de crédibilité. La transparence est un **choix délibéré d'honnêteté** qui renforce la confiance utilisateur à long terme.

**Innovation Type** : Positionnement produit différenciant basé sur honnêteté radicale plutôt que sur-promesse.

**3. Barrière à l'Entrée : Acquisition de Données comme Moat**

La **différenciation durable** ne repose PAS sur la technique (stack PostGIS/MapLibre/MVT classique pour cartographie, techniquement surmontable) mais sur la **capacité à obtenir et maintenir les données** :
- Relations avec ONF, départements, gestionnaires de réserves
- Expertise domaine (comprendre RNCFS, régulations chasse, formats SIG)
- Processus de validation qualité et mise à jour continue
- Temps/effort pour convaincre institutions de partager données

**Conséquence** : Un concurrent technique peut copier l'application, mais reproduire le réseau d'acquisition de données demande **années et expertise domaine**. C'est le vrai avantage compétitif.

### Market Context & Competitive Landscape

**État Actuel du Marché (Mars 2026) :**

**Solutions Existantes Fragmentées** :
- **RNCFS (ONF)** : Données officielles mais format SIG technique, inaccessibles au grand public
- **data.gouv.fr** : Réserves naturelles en open data mais pas d'interface carte grand public
- **Open data départementaux** : Éclatés par territoire, aucune vue d'ensemble
- **Applications chasse** (ex: ChassAdapt, Chassons Tranquille) : Orientées chasseurs (périodes, réglementations), **pas zones sans chasse**

**Gap Identifié** : Aucun outil ne répond au besoin des **non-chasseurs** souhaitant profiter de la nature en sécurité pendant la saison de chasse. Les données existent mais sont :
- **Techniques** : Shapefile, GeoPackage (barrière compétence SIG)
- **Éclatées** : Pas de centralisation nationale
- **Inaccessibles** : Interfaces institutionnelles complexes, pas mobile-friendly

**Positionnement Unique** :
- **Public cible** : Grand public non-expert (familles, photographes, cueilleurs) vs chasseurs
- **Value proposition** : Sécurité et accès à la nature vs optimisation pratique de la chasse
- **Approche** : Transparence et éducation vs exhaustivité technique

**Risque de Copie** :
- Court terme (1-2 ans) : **Faible**. L'acquisition de données demande temps, relations, validation.
- Long terme (3-5 ans) : **Modéré**. Si NatureTranquille réussit, des acteurs institutionnels (IGN, ONF) ou associatifs (LPO, FNE) pourraient lancer initiatives similaires.
- **Défense** : First-mover advantage + communauté fidélisée + amélioration continue données.

### Validation Approach

**Hypothèses Critiques à Valider** :

**Hypothèse 1 : Le besoin existe réellement (demand validation)**
- **Risque** : Besoin auto-projeté par porteur projet, mais audience limitée en réalité
- **Validation MVP** :
  - Lancement phase pilote sur 2-3 départements riches en données
  - Métriques : 500 utilisateurs uniques / mois d'ici 3 mois après lancement
  - Feedback qualitatif : interviews utilisateurs (10+) sur utilité réelle
  - Taux de retour : 30%+ utilisateurs reviennent dans les 30 jours
- **Critère de succès** : Si atteint après 6 mois pilote → expansion nationale justifiée

**Hypothèse 2 : La transparence sur limites ne décourage pas les utilisateurs**
- **Risque** : Disclaimer "données non exhaustives" fait fuir utilisateurs vs confiance
- **Validation MVP** :
  - A/B test (si trafic suffisant) : version disclaimer visible vs version discrète
  - Analytics comportemental : taux de rebond après lecture disclaimer
  - Signalements erreurs : volume et ton (frustration vs collaboration)
  - NPS (Net Promoter Score) : > 30 indique satisfaction malgré limites
- **Critère de succès** : < 20% taux de rebond post-disclaimer + NPS > 30

**Hypothèse 3 : Les données sont obtenues progressivement (data acquisition validation)**
- **Risque** : Départements/ONF refusent de partager données, bloquant le produit
- **Validation Pré-MVP** :
  - Contacter 5 départements open data + ONF RNCFS avant développement
  - Obtenir confirmation accès données ou engagement principe
  - Tester pipeline import données sur 1 département réel
- **Critère de succès** : 3/5 départements confirment accès données + RNCFS disponible

**Hypothèse 4 : L'agrégation apporte valeur vs consultation sources individuelles**
- **Risque** : Utilisateurs préfèrent aller sur site officiel département plutôt qu'agrégateur partiel
- **Validation MVP** :
  - Time-to-insight : mesurer temps utilisateur pour trouver zone via NatureTranquille vs sources officielles
  - Feedback qualitatif : "Auriez-vous trouvé cette info sans NatureTranquille ?" (attendre 70%+ réponses "Non")
- **Critère de succès** : 3x plus rapide que recherche manuelle + 70%+ disent "info introuvable autrement"

### Risk Mitigation

**Risque Innovation 1 : Absence de Demande Réelle**

**Probabilité** : Moyenne (30%)
**Impact** : Critique (arrêt projet)

**Stratégie de Mitigation** :
- **Validation pré-développement** : Créer landing page descriptive (sans produit) + formulaire intérêt. Objectif : 200 inscriptions en 1 mois via partage réseaux sociaux/forums nature.
- **MVP ultra-léger** : Développement phase pilote limitée (2 départements) en 4-6 semaines pour tester rapidement avec budget minimal.
- **Pivot ready** : Si demande faible, pivoter vers :
  - **Outil éducatif** (cartographie pédagogique zones protégées pour écoles)
  - **Outil B2B** (vente de données agrégées propres à associations environnementales)
  - **Abandon raisonné** si aucun signal positif après 6 mois

**Risque Innovation 2 : Blocage Acquisition Données**

**Probabilité** : Élevée (50%)
**Impact** : Élevé (limite scalabilité)

**Stratégie de Mitigation** :
- **Approche multi-sources** : Ne pas dépendre d'une seule source (RNCFS + réserves naturelles + départements + données crowdsourcées)
- **Relations institutionnelles** : Identifier champions internes (agents ONF, chargés open data départementaux) sensibles à l'accès public nature
- **Légitimité associative** : Créer association loi 1901 si besoin (crédibilité pour demandes institutionnelles)
- **Fallback crowdsourcing** : Si données officielles insuffisantes, permettre signalements communautaires validés manuellement (moins fiable mais mieux que rien)
- **Communication transparente** : Roadmap publique "Départements demandés" → pression citoyenne positive sur administrations

**Risque Innovation 3 : Transparence Radicale Perçue Négativement**

**Probabilité** : Faible (20%)
**Impact** : Moyen (frustration utilisateurs, mauvais bouche-à-oreille)

**Stratégie de Mitigation** :
- **Framing positif** : Formuler disclaimer comme "Données en expansion continue - aidez-nous à compléter !" vs "Données incomplètes"
- **Roadmap visible** : Page "Prochains départements" avec dates estimées → sentiment de progression
- **Engagement communauté** : Transformer limitation en force via contributeurs (signalements, partage contacts départements)
- **Quick wins** : Lancer sur départements riches en données (Grand Est, Île-de-France) pour montrer valeur immédiate malgré couverture partielle
- **A/B testing** : Tester plusieurs formulations disclaimer pour optimiser ton

**Risque Innovation 4 : Copie par Acteur Mieux Positionné**

**Probabilité** : Moyenne long terme (40% sur 3-5 ans)
**Impact** : Élevé (perte avantage compétitif)

**Stratégie de Mitigation** :
- **First-mover advantage** : Lancer rapidement (Q2 2026) pour établir référencement SEO et notoriété
- **Communauté engagée** : Fidéliser utilisateurs précoces via newsletter, feedback valorisé, améliorations visibles
- **Partenariats stratégiques** : Approcher LPO, FNE, Fédérations Randonnée pour co-branding/légitimité (complique copie indépendante)
- **Open source stratégique** : Code open source (renforce crédibilité civic tech) mais données agrégées/nettoyées restent asset propriétaire
- **Excellence exécution** : UX/performance/accessibilité exemplaires → difficulté reproduire qualité même avec données similaires

---

## Web App Specific Requirements

### Project-Type Overview

NatureTranquille sera une **Single Page Application (SPA)** centrée sur une carte interactive MapLibre GL JS affichant les zones sans chasse en France.

**Architecture Unique-Page avec Deep Linking** :
- **Page principale** : `/` - Carte interactive France entière
- **URLs typées** : `/departements/[slug]`, `/regions/[slug]` - Même carte, zoomée automatiquement sur zone demandée
- **Pas de pages séparées** : Évite duplication contenu, garde UX fluide centrée carte
- **SEO via métadonnées** : title/description dynamiques selon URL, pas de contenu textuel généré

**Exemple Comportement** :
- Utilisateur cherche "zones sans chasse Bas-Rhin" → trouve `/departements/bas-rhin`
- Clique lien → carte s'affiche **directement zoomée** sur Bas-Rhin (centre + niveau zoom adapté)
- `<title>` dynamique : "Zones Sans Chasse - Bas-Rhin | NatureTranquille"
- Utilisateur interagit avec carte (pan, zoom, clics zones) comme page d'accueil

**Décision Technique : NextJS 14+ avec App Router**
- SSG (Static Site Generation) pour SEO optimal
- Composant carte client-side hydraté avec paramètre zoom initial
- Génération build-time de toutes routes `/departements/*` depuis base PostGIS

### URL Structure & Routing

**Routes Statiques (SEO Optimisé)** :

```
/ 
  → Carte France entière (zoom niveau 6)
  → Title: "NatureTranquille - Carte des Zones Sans Chasse en France"

/departements/[slug]
  → Carte zoomée sur département (zoom niveau 9-10)
  → Ex: /departements/bas-rhin, /departements/haute-savoie
  → Title dynamique: "Zones Sans Chasse - [Nom Département] | NatureTranquille"
  → Description: "Découvrez les zones sans chasse en [Nom Département] sur carte interactive."

/regions/[slug] (Optionnel - À décider)
  → Carte zoomée sur région (zoom niveau 7-8)
  → Ex: /regions/grand-est
  → Title: "Zones Sans Chasse - Grand Est | NatureTranquille"

/sources
  → Page statique Sources de Données (SEO backlinks institutionnels)

/a-propos
  → Page statique À Propos (E-A-T Google)
```

**NextJS Implementation** :

```typescript
// app/departements/[slug]/page.tsx
export async function generateStaticParams() {
  const departements = await db.query(
    'SELECT slug FROM departements WHERE data_available = true'
  );
  return departements.map(d => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
  const dept = await getDepartementBySlug(params.slug);
  return {
    title: `Zones Sans Chasse - ${dept.nom} | NatureTranquille`,
    description: `Découvrez les ${dept.zone_count} zones sans chasse en ${dept.nom}. Carte interactive, réserves naturelles, RNCFS.`,
    openGraph: {
      title: `Zones Sans Chasse - ${dept.nom}`,
      images: ['/og-carte.jpg'],
    }
  };
}

export default function DepartementPage({ params }) {
  return <MapPage initialZoom={dept.bounds} />;
}
```

**Simplicité Maximale** :
- Pas de contenu texte généré (FAQ, listes zones, etc.)
- Juste carte + métadonnées SEO dynamiques
- Crédibilité et UX propres

### Browser Support Matrix

**Desktop (3 dernières versions)** :
- Google Chrome 120+ (février 2026 ≈ versions 120-123)
- Mozilla Firefox 122+ (février 2026 ≈ versions 122-125)
- Safari 17+ (macOS Sonoma/Ventura)
- Microsoft Edge 120+ (Chromium-based)

**Mobile (3 dernières versions)** :
- Safari iOS 17+ (iPhone/iPad)
- Chrome Android 120+
- Samsung Internet 23+ (si trafic Android Samsung significatif)

**Exclusions explicites** :
- ❌ Internet Explorer 11 (EOL 2022)
- ❌ Safari < 15 (support WebGL/MapLibre limité)
- ❌ Navigateurs anciens sans support ES2020+

**Stratégie de Test** :
- Tests automatisés : Chrome headless + Firefox (CI/CD)
- Tests manuels MVP : Safari iOS + Chrome Android (devices physiques ou BrowserStack)
- Graceful degradation : Message d'erreur si navigateur non supporté détecté

### Responsive Design Strategy

**Mobile-First, Carte-Centric** :

**Mobile (< 768px)** :
- Carte plein écran 100vh (header minimal fixe en haut)
- Contrôles tactiles MapLibre natifs (pinch-zoom, pan)
- Boutons zoom +/- tactiles (44px minimum WCAG)
- Détails zone : bottom sheet slide-up (ne masque pas carte)
- Recherche géographique : input fixe top avec autocomplete

**Tablet (768px - 1024px)** :
- Carte + sidebar latéral 300px pour détails zone
- Contrôles tactiles + souris

**Desktop (1024px+)** :
- Carte + sidebar permanent 400px
- Hover states polygones (highlight au survol)
- Contrôles souris (drag, scroll-wheel zoom)

**Disclaimer/Avertissement** :
- Modal popup première visite (toutes tailles) → banner discret header ensuite

### Performance Targets

**Budgets Performance (référence Step 3 - Success Criteria)** :
- ⏱️ **Chargement initial** : < 2s (75th percentile, 3G mobile)
- ⏱️ **Détails zone** : < 500ms au clic polygone
- ⏱️ **Recherche géographique** : < 1s (géocodage + zoom)

**Optimisations Clés** :

**1. Bundle JavaScript** :
- Code splitting : MapLibre GL JS (~500KB gzipped) chargé séparément
- Lazy loading : modales/formulaires à la demande
- Tree shaking : élimination code inutilisé (Next.js automatique)
- Bundle initial cible : < 200KB JS gzipped (hors MapLibre)

**2. Tuiles Vectorielles MVT** :
- Format binaire compact (~10x plus léger que GeoJSON)
- Simplification géométrique par niveau zoom (PostGIS `ST_Simplify`)
- Cache navigateur 1 an (tiles immutables)
- Cache serveur Nginx au MVP (CDN UE post-MVP si besoin)

**3. Fonts & Assets** :
- System font stack (zéro requête HTTP) ou Google Fonts optimisées
- SVG inline pour icônes UI
- Images WebP avec fallback PNG

**4. Core Web Vitals Cibles** :
- LCP (Largest Contentful Paint) : < 2.5s
- FID (First Input Delay) : < 100ms
- CLS (Cumulative Layout Shift) : < 0.1
- Google Lighthouse CI : score 90+ Performance

### SEO Strategy

**🎯 Objectif** : Référencement organique pour requêtes "zones sans chasse [département/région]"

#### Mots-Clés Cibles

**Primaires** :
- "zones sans chasse France"
- "carte zones sans chasse"
- "où se promener sans chasse"

**Longue Traîne (haute intention)** :
- "zones sans chasse Bas-Rhin"
- "où aller en forêt sans chasseurs Alsace"
- "réserves naturelles sans chasse Grand Est"

**Saisonnalité** : Pics septembre-février (saison chasse) - lancement Q2 2026 optimal.

#### Stratégie SEO Technique Pur (Pas de Contenu Généré)

**On-Page SEO** :

**1. Métadonnées Dynamiques par Route** :
```html
<!-- / (Page d'accueil) -->
<title>NatureTranquille - Carte des Zones Sans Chasse en France</title>
<meta name="description" content="Découvrez les zones sans chasse en France sur carte interactive. Réserves naturelles, RNCFS, espaces protégées pour se promener en sécurité." />

<!-- /departements/bas-rhin -->
<title>Zones Sans Chasse - Bas-Rhin | NatureTranquille</title>
<meta name="description" content="12 zones sans chasse référencées en Bas-Rhin. Carte interactive avec réserves naturelles et RNCFS." />
```

**2. Open Graph (Partage Réseaux Sociaux)** :
```html
<meta property="og:title" content="NatureTranquille - Zones Sans Chasse" />
<meta property="og:description" content="Première carte interactive des zones sans chasse en France" />
<meta property="og:image" content="/og-carte-preview.jpg" />
<meta property="og:type" content="website" />
```

**3. Schema.org Structured Data** :
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "NatureTranquille",
  "description": "Carte interactive des zones sans chasse en France",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Web Browser",
  "offers": { "@type": "Offer", "price": "0" }
}
```

**4. HTML Sémantique** :
- H1 : "Zones Sans Chasse en France" (page d'accueil)
- H1 dynamique : "Zones Sans Chasse - Bas-Rhin" (pages départements)
- Balises `<nav>`, `<main>`, `<footer>` (ARIA landmarks)
- Texte UI contient mots-clés naturellement (boutons, labels)

**Pas de Paragraphes Artificiels** :
- Pas de "Voici les X zones du département..."
- Pas de listes générées automatiquement
- **Crédibilité maximale** : zero content farming

#### Off-Page SEO

**Backlinks Stratégiques** :
- Partenariats associations : LPO, FNE, Fédérations Randonnée → liens depuis sites
- Annuaires open data : data.gouv.fr, Etalab
- Articles blog/Medium : partage expertise créateur projet
- Forums nature/randonnée : partage organique utilisateurs

#### Sitemap & Robots

**sitemap.xml** (généré build-time) :
```xml
<url>
  <loc>https://naturetranquille.fr/</loc>
  <priority>1.0</priority>
  <changefreq>weekly</changefreq>
</url>
<url>
  <loc>https://naturetranquille.fr/departements/bas-rhin</loc>
  <priority>0.8</priority>
  <changefreq>monthly</changefreq>
</url>
<!-- ... toutes routes départements générées -->
```

**robots.txt** :
```
User-agent: *
Allow: /
Sitemap: https://naturetranquille.fr/sitemap.xml
```

#### Monitoring SEO

- **Google Search Console** : indexation, requêtes, erreurs crawl
- **Bing Webmaster Tools** : diversification sources
- **KPI** (Step 3) : 30+ mots-clés top 50 Google à 6 mois, 40% trafic organique

### Accessibility Level

**Conformité RGAA 4.1 Niveau AA** (référence Step 5 - Domain Requirements)

NatureTranquille respecte le Référentiel Général d'Amélioration de l'Accessibilité pour garantir accessibilité universelle.

**Exigences critiques déjà documentées** :
- Contrastes ≥ 4.5:1 (texte), ≥ 3:1 (interactifs)
- Navigation clavier complète (carte MapLibre, formulaires, contrôles)
- Alternatives textuelles (alt, ARIA labels)
- HTML5 sémantique + ARIA landmarks
- Tests lecteurs d'écran (NVDA/JAWS)

**Spécificités SPA** :
- Gestion focus au changement route (ex: zoom département)
- Live regions ARIA pour résultats recherche dynamiques
- Skip link : "Aller à la carte" (bypass navigation)

**Conformité dès MVP** : Exigence prioritaire maintenue.

### Technical Stack Recommendations

**Frontend Framework** :
- **Next.js 14+** (App Router, React SSR/SSG) : SEO optimal + performance
  
**Carte Interactive** :
- **MapLibre GL JS 4.x** : open source, WebGL, performant

**Styling** :
- **Tailwind CSS** : utility-first, petite empreinte, responsive facile

**Forms & Validation** :
- **React Hook Form** + **Zod** : performant, accessible, TypeScript-first

**Testing** :
- **Vitest** : tests unitaires
- **Playwright** : tests E2E cross-browser
- **axe-core** : tests accessibilité automatiques

**Hosting (Contrainte UE/France)** :

**Option Recommandée MVP** : **Scalingo** (🇫🇷 France)
- Datacenters Paris (conformité RGPD France)
- Next.js déploiement natif one-click
- PostgreSQL/PostGIS managé addon disponible
- Support technique français
- Prix : ~7-15€/mois selon trafic
- HTTPS automatique (Let's Encrypt)
- Scaling automatique si croissance

**Alternative Budget** : **Hetzner Cloud** (🇩🇪 Allemagne UE)
- VPS à partir de 4.15€/mois (CX11)
- Conformité RGPD UE
- Contrôle total infrastructure
- Nécessite setup manuel (Nginx, PM2, SSL) - 1-2 jours DevOps

**Alternative PaaS** : **CleverCloud** (🇫🇷 France)
- Datacenters Roubaix/Paris
- Support Node.js/Next.js
- Prix compétitif (~2.5€/mois démarrage)
- PostgreSQL addon PostGIS disponible

**Choix Final à Confirmer Pré-Développement** selon budget et compétences DevOps.

### Implementation Considerations

**Phase 1 - MVP Core (Q2 2026)** :
1. Setup Next.js 14 + TypeScript + Tailwind
2. Intégration MapLibre GL JS avec données PostGIS (Grand Est pilote)
3. Routes statiques générées : `/`, `/departements/*` (2-3 départements)
4. Métadonnées SEO dynamiques
5. Formulaire feedback simple (email SMTP)
6. Déploiement Scalingo/CleverCloud

**Phase 2 - Expansion (Post-MVP)** :
7. Ajout départements progressivement (génération SSG automatique)
8. Optimisations performance (CDN UE si nécessaire)
9. Analytics Matomo auto-hébergé (RGPD-friendly)
10. Améliorations accessibilité basées tests utilisateurs

**Contraintes Techniques Critiques** :
- **PostGIS 3.4+** obligatoire pour tuiles MVT (`ST_AsMVT`)
- **Next.js ISR** (Incremental Static Regeneration) : `revalidate: 86400` (rebuild pages départements toutes les 24h si nouvelles données)
- **HTTPS obligatoire** : RGPD + sécurité formulaires
- **Validation RGAA** : checklist 80% critères A/AA avant lancement

---

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**Approche MVP : Problem-Solving Lean**

NatureTranquille adopte une philosophie **MVP problem-solving** centrée sur la résolution immédiate du problème utilisateur : "Où puis-je me promener en nature sans risque pendant la saison de chasse ?"

**Principes Directeurs** :
- **Résoudre le problème core dès la première visite** : Tom, Marie ou Mireille doivent pouvoir trouver une zone sans chasse en < 2 minutes
- **Zéro compromis sur la transparence** : Disclaimers et communication honnête des limites dès le MVP
- **Excellence fonctionnelle sur périmètre restreint** : 2-3 départements pilotes avec données fiables plutôt que couverture nationale incomplète
- **Validation rapide de la demande** : Lancement en 4-6 semaines pour tester hypothèses marché
- **Conformité RGAA dès le départ** : Accessibilité non négociable (exigence domaine civic tech)

**Ce qui définit "Utile" au MVP** :
- ✅ Carte interactive avec zones sans chasse clairement identifiées
- ✅ Recherche géographique fonctionnelle (compense géoloc desktop peu fiable)
- ✅ Détails zones accessibles en < 500ms au clic
- ✅ Transparence radicale sur couverture partielle (crédibilité)
- ✅ Accessibilité universelle (RGAA AA)

**Ce qui N'EST PAS dans le MVP** :
- ❌ Formulaires feedback intégrés (email classique suffit pour validation)
- ❌ Analytics sophistiqués (focus sur fonctionnel, métriques post-validation)
- ❌ Fonctionnalités communautaires (signalements collaboratifs = Phase 2)
- ❌ Filtres avancés, exports, fonctionnalités "nice-to-have"

**Ressources MVP Estimées** :
- **Équipe** : Solo développeur (4-6 semaines) ou duo (2-3 semaines)
- **Compétences Requises** : Next.js/React, PostGIS/SQL spatial, MapLibre GL JS, accessibilité web
- **Budget Hébergement** : 7-15€/mois (Scalingo France ou CleverCloud)
- **Budget Total** : 0-500€ si auto-développement + temps acquisition données

### MVP Feature Set (Phase 1 - Q2 2026)

**Objectif Phase 1** : Valider la demande sur territoire pilote limité avec fonctionnalités essentielles.

#### Core User Journeys Supportés

**Tom (Balades Familiales)** :
- ✅ Recherche "Bas-Rhin" → carte zoom sur département
- ✅ Visualise zones vertes (réserves naturelles + RNCFS)
- ✅ Clique zone → détails (nom, type, gestionnaire)
- ✅ Lit disclaimer transparence → comprend limites données
- ✅ Planifie sortie sereinement

**Marie (Photographe Animalière)** :
- ✅ Recherche ville précise → zones proches affichées
- ✅ Vérifie détails zone (date MAJ, source)
- ✅ Peut signaler erreur via email (lien contact)
- ✅ Confiance grâce transparence

**Mireille (Cueilleuse Champignons)** :
- ✅ Navigation carte accessible clavier (avec aide fils)
- ✅ Contrastes RGAA (lecture facile)
- ✅ Comprend disclaimer ("données non exhaustives")
- ✅ Retrouve tradition en sécurité

#### Must-Have Capabilities (MVP Phase 1)

**1. Carte Interactive MapLibre GL JS** :
- Fond de carte OpenStreetMap (tiles publics)
- Polygones zones sans chasse (couleur verte, opacité 0.6)
- Contrôles zoom/pan (boutons + scroll/pinch)
- Géolocalisation utilisateur (avec permission, fallback si refusée)
- Performance : chargement initial < 2s (Success Criteria)
- Responsive : mobile-first (plein écran) jusqu'à desktop (sidebar)

**2. Recherche Géographique** :
- Input texte avec autocomplete (villes, codes postaux, départements)
- Géocodage via Nominatim (OpenStreetMap, gratuit, open source)
- Zoom automatique sur résultat recherche
- Fallback si recherche échoue (message clair)
- Performance : < 1s géocodage + zoom (Success Criteria)

**3. Détails Zone (Popup/Sidebar)** :
- Déclenchement : clic sur polygone zone
- Affichage : popup mobile (bottom sheet), sidebar desktop
- Informations affichées :
  - **Nom zone** : ex "Réserve Naturelle des Ballons Comtois"
  - **Type protection** : Réserve Naturelle Nationale / RNCFS / Autre
  - **Gestionnaire** : ONF, Département, Parc Naturel, etc.
  - **Date mise à jour données** : ex "15 janvier 2026"
  - **Source** : lien vers source officielle si disponible
- Performance : affichage < 500ms au clic (Success Criteria)

**4. Transparence & Disclaimers** :

**a) Modal Avertissement Première Visite** :
```
⚠️ Avertissement Important

NatureTranquille affiche les zones sans chasse CONNUES à partir de sources publiques.

Limitations :
- L'absence de zone NE signifie PAS que la chasse est autorisée partout
- Les données peuvent être incomplètes ou obsolètes
- Certains départements ne sont pas encore couverts

Vérifiez toujours localement avant sortie (mairie, ONF, panneaux terrain).
En utilisant ce site, vous acceptez ces conditions.

[J'ai compris] [En savoir plus]
```

**b) Page "Sources de Données"** (`/sources`) :
- Liste sources actuelles intégrées (RNCFS, Réserves Naturelles)
- Départements couverts (Bas-Rhin, Haut-Rhin, Moselle au MVP)
- Méthodologie validation données
- Roadmap expansion (prochains départements)
- Appel à contribution (départements peuvent proposer open data)
- Attribution licences (Licence Ouverte v2.0, ODbL OSM)

**c) Page "À Propos"** (`/a-propos`) :
- Mission NatureTranquille (accès nature sécurisé)
- Qui sommes-nous (Teddy, porteur projet)
- Mentions légales, politique confidentialité
- Contact (email pour feedback)

**5. Accessibilité RGAA 4.1 Niveau AA** :
- **Navigation clavier complète** : map, recherche, zones, modales
- **Contrastes** : ≥ 4.5:1 (texte), ≥ 3:1 (interactifs)
- **ARIA** : labels, landmarks, live regions (résultats recherche)
- **HTML sémantique** : `<header>`, `<main>`, `<nav>`, `<footer>`
- **Alternatives textuelles** : alt images, labels formulaires
- **Tests** : NVDA/JAWS (lecteurs écran), validation W3C, axe-core CI/CD
- **Checklist** : 80%+ critères AA respectés avant lancement

**6. Feedback Utilisateur (Simplifié MVP)** :
- **Email contact** : lien `mailto:` depuis page "À propos" ou détails zone
- **Formulaire basique** (optionnel) : nom (optionnel), email (optionnel), message
- **Traitement manuel** : emails lus et traités sous 48-72h
- **Pas de système tickets** au MVP (complexité inutile)

#### Périmètre Géographique MVP

**Départements Pilotes** : 2-3 départements Grand Est
- **Bas-Rhin** (67)
- **Haut-Rhin** (68)
- **Moselle** (57) (si données accessibles facilement)

**Justification Choix** :
- Grand Est : région riche en données open data (exemple RNCFS shapefile déjà obtenu)
- Diversité géographique : Alsace (Bas/Haut-Rhin) + Lorraine (Moselle)
- Population significative : ~5.5M habitants Grand Est (base utilisateurs potentielle)
- SEO viable : "zones sans chasse Grand Est" = requête longue traîne pertinente

**Nombre Zones Estimé MVP** : 15-30 zones sans chasse référencées
- RNCFS Grand Est : ~10-15 zones
- Réserves Naturelles Nationales : ~3-5 zones
- Total suffisant pour démontrer utilité produit

#### Sources de Données MVP

**Sources Intégrées Phase 1** :
1. **RNCFS (Réseau National Chasse Faune Sauvage)** - ONF
   - Licence : Licence Ouverte v2.0 (données publiques)
   - Format : Shapefile (déjà obtenu : dataset RNCFS Grand Est)
   - Fréquence MAJ : Annuelle (stable)
   
2. **Réserves Naturelles Nationales** - data.gouv.fr
   - Licence : Licence Ouverte v2.0
   - Format : GeoJSON ou Shapefile
   - Fréquence MAJ : Trimestrielle

**Sources Post-MVP (Phase 2)** :
- Open data départementaux (Bas-Rhin, Haut-Rhin si disponibles)
- Réserves Naturelles Régionales
- Parcs Naturels Régionaux (zones protection intégrale)
- Données crowdsourcées validées (si blocage sources officielles)

#### Contraintes & Exclusions MVP

**Exclusions Fonctionnelles** :
- ❌ Pas de comptes utilisateurs (anonymat total)
- ❌ Pas de favoris/sauvegarde zones (nécessite comptes)
- ❌ Pas de notifications push (complexité technique)
- ❌ Pas de filtres par type protection (tous types affichés)
- ❌ Pas d'export GPX/KML (feature avancée Phase 2)
- ❌ Pas de commentaires collaboratifs (modération = charge)
- ❌ Pas d'application mobile native (web responsive suffit)

**Exclusions Géographiques** :
- ❌ Départements hors Grand Est non couverts au MVP
- ❌ Zones de chasse (volontairement non affichées pour clarté)
- ❌ Zones "incertaines" (données non validées)

**Exclusions Analytics** :
- ❌ Pas de tracking comportemental détaillé au MVP
- ❌ Pas de cookies analytics tiers (conformité RGPD stricte)
- ❌ Métriques limitées : logs serveur basiques (pages vues, erreurs)

### Post-MVP Features

#### Phase 2: Growth (Q3-Q4 2026 - 3-6 mois post-lancement)

**Déclencheur** : MVP atteint **Success Criteria Phase 1** :
- 500 utilisateurs uniques/mois à 3 mois
- NPS > 30 (satisfaction utilisateurs)
- Feedback positif (70%+ disent "utile")
- Traction organique (partages réseaux sociaux, forums)

**Objectif Phase 2** : Expansion géographique + fonctionnalités demandées utilisateurs

**Nouvelles Fonctionnalités** :

**1. Expansion Géographique (10-15 départements supplémentaires)** :
- Priorité : départements forte demande utilisateurs (feedback/signalements)
- Régions cibles : Île-de-France, Auvergne-Rhône-Alpes, PACA, Nouvelle-Aquitaine
- Objectif 6 mois : **20 départements couverts** (Success Criteria long terme)

**2. Formulaire Feedback Intégré** :
- Formulaire structuré in-app (vs email externe)
- Catégories : Signaler erreur / Suggérer amélioration / Proposer nouvelle source
- Champs : Zone concernée (si applicable), description, email (optionnel)
- Backend : stockage PostgreSQL + notification email porteur projet
- Traitement : réponse sous 48-72h (manuel, pas de SLA garanti)

**3. Analytics Privacy-Friendly (Umami)** :
- **Umami auto-hébergé** (alternative Matomo, plus léger)
- **Ou Umami Cloud** (évaluation complexité auto-hébergement vs 9$/mois cloud)
- Métriques anonymisées :
  - Pages vues, utilisateurs uniques
  - Temps moyen session, taux rebond
  - Recherches populaires (villes/départements)
  - Zones les plus consultées
- Conformité RGPD : anonymisation IP, opt-out facile, pas de cookies tiers
- Objectif : optimiser UX basé sur données comportementales réelles

**4. Filtres Carte par Type de Protection** :
- Checkboxes : Réserves Naturelles / RNCFS / Parcs Naturels / Autres
- Activation/désactivation dynamique layers carte
- Préférences non sauvegardées (pas de comptes = pas de persistance)

**5. Liste "Zones Proches"** (Accessibility Enhancement) :
- Section textuelle sous carte (lecteurs écran)
- Liste zones dans rayon 50km position utilisateur
- Format : Nom zone, distance, lien vers détails
- Alternative navigation pour personnes malvoyantes

**6. Optimisations Performance** :
- CDN européen (Cloudflare France si trafic croît significativement)
- Cache tuiles MVT agressif (Varnish ou Redis)
- Lazy loading images/assets
- Compression Brotli

**Ressources Phase 2** :
- Temps dev : 4-6 semaines (features + départements)
- Budget hébergement : 15-30€/mois (scaling trafic)
- Total : ~500-1000€ si auto-dev

#### Phase 3: Expansion (2027+ - 12-18 mois post-lancement)

**Déclencheur** : Traction validée :
- 20+ départements couverts
- 2000+ utilisateurs actifs/mois
- NPS > 40 (excellente satisfaction)
- Partenariats institutionnels amorcés (LPO, FNE, Fédérations)

**Objectif Phase 3** : Couverture nationale + écosystème communautaire

**Nouvelles Fonctionnalités** :

**1. Couverture Nationale Complète** :
- 100 départements métropole + DOM-TOM
- Pipeline automatisé import données (réduction charge manuelle)
- Partenariats ONF, IGN pour accès données nationales

**2. Fonctionnalités Communautaires** :
- **Signalements collaboratifs** : utilisateurs proposent nouvelles zones
- **Validation modération** : équipe valide avant publication (évite spam/erreurs)
- **Commentaires zones** : infos pratiques ("Parking accessible", "Sentier balisé", "Accessible PMR")
- **Système réputation** : contributeurs actifs valorisés

**3. Accessibilité Physique (Champ Détails Zones)** :
- **Informations terrain** : Accessibilité PMR, difficulté sentiers, infrastructures
- **Crowdsourcé + validé** : communauté partage, équipe modère
- **Bénéfice Mireille** (user journey) : barrières physiques signalées

**4. Partenariats Institutionnels** :
- **Co-branding** : LPO, FNE, Fédérations Randonnée
- **Intégration données** : flux automatiques depuis partenaires
- **Légitimité renforcée** : logos partenaires, citations officielles

**5. API Ouverte (Open Data Contribution)** :
- **API REST publique** : accès données agrégées NatureTranquille
- **Licence ouverte** : associations, collectivités peuvent réutiliser
- **Rate limiting** raisonnable (prévient abus)
- **Documentation OpenAPI** (Swagger)

**6. Application Mobile Native (Si Demande Forte)** :
- **Déclencheur** : 30%+ utilisateurs demandent app native (vs web responsive)
- **Bénéfices** : géolocalisation mobile plus fiable, notifications, offline mode
- **Technologies** : React Native (partage code web) ou Flutter
- **Coût** : 3-6 mois dev + maintenance stores (Apple 99€/an, Google 25€ one-time)

**Ressources Phase 3** :
- Équipe : 1-2 devs + 1 community manager (modération)
- Budget : 500-2000€/mois (hébergement scaling, maintenance)
- Financement potentiel : Subventions civic tech, mécénat, crowdfunding

### Risk Mitigation Strategy

#### Risque Technique 1 : Blocage Acquisition Données MVP

**Probabilité** : Élevée (50%)
**Impact** : Critique (empêche lancement MVP)

**Mitigation** :

**Action Immédiate Pré-Développement** :
1. **Contacter ONF** : Confirmer accès données RNCFS nationales ou départementales
2. **Contacter 3 départements Grand Est** : Vérifier open data disponibles (Bas-Rhin, Haut-Rhin, Moselle)
3. **Valider data.gouv.fr** : Télécharger et tester import Réserves Naturelles
4. **Délai** : 1-2 semaines validation données AVANT premier commit code

**Fallback Stratégies** :
- **Plan A** : RNCFS + Réserves Naturelles (idéal, 25-30 zones)
- **Plan B** : Réserves Naturelles seules si RNCFS inaccessible (10-15 zones, suffisant pour MVP)
- **Plan C** : Crowdsourcing communautaire temporaire (utilisateurs signalent zones, validation manuelle intensive)
- **Plan D** : Abandon raisonné si aucune donnée accessible (pivot ou arrêt)

**Indicateur Décision Go/No-Go MVP** :
- ✅ **GO** : ≥ 10 zones validées sur 2 départements minimum
- ❌ **NO-GO** : < 10 zones ou aucune source fiable

#### Risque Technique 2 : Complexité PostGIS + Tuiles MVT Sous-Estimée

**Probabilité** : Moyenne (30%)
**Impact** : Moyen (retarde MVP 1-2 semaines)

**Mitigation** :

**Validation Technique Pré-MVP (Spike 2-3 jours)** :
1. **Setup PostGIS local** : Installation PostgreSQL 15+ + PostGIS 3.4+
2. **Import données test** : dataset RNCFS Grand Est déjà obtenu → table PostGIS
3. **Génération tuiles MVT** : script SQL `ST_AsMVT()` sur 1 département
4. **Intégration MapLibre** : affichage tuiles sur carte test
5. **Validation performance** : < 500ms génération tiles niveau zoom 10

**Tutoriels de Référence** :
- Documentation PostGIS MVT : https://postgis.net/docs/ST_AsMVT.html
- MapLibre + MVT : https://maplibre.org/maplibre-gl-js-docs/example/vector-source/
- Technical research déjà réalisé : document 1380 lignes exhaustif disponible

**Fallback** :
- Si MVT trop complexe : utiliser GeoJSON simple (performances dégradées mais fonctionnel)
- Optimisation MVT post-MVP une fois traction validée

#### Risque Marché 1 : Absence de Demande Réelle

**Probabilité** : Moyenne (30%)
**Impact** : Critique (échec produit)

**Mitigation** :

**Validation Pré-Développement (Landing Page Test)** :
1. **Créer landing page** descriptive (sans produit fonctionnel)
2. **Value proposition** claire : "Trouvez zones sans chasse près de chez vous"
3. **CTA** : Formulaire "Me prévenir au lancement" (email)
4. **Distribution** : Forums nature (Randonner-Léger, GR, Champis.net), Reddit r/Randonnee, Facebook groupes nature
5. **Objectif** : 200+ inscriptions en 1 mois
6. **Décision** : Si < 100 inscriptions → revoir positionnement ou abandonner

**Validation MVP (Métriques Success Criteria)** :
- **3 mois post-lancement** : 500 utilisateurs uniques/mois (seuil minimum viabilité)
- **NPS > 30** : satisfaction utilisateurs (via popup ou email après 2e visite)
- **Interviews qualitatives** : 10+ utilisateurs réels (comprendre usage, frustrations)

**Pivot Options si Demande Faible** :
- **Outil éducatif** : focus écoles/éducation environnement (nouveau public)
- **B2B associations** : vente données agrégées propres à LPO, FNE, Fédérations
- **Abandon raisonné** : si aucun signal positif après 6 mois, couper pertes

#### Risque Projet 1 : Feature Creep (Dérive Périmètre)

**Probabilité** : Moyenne (30%)
**Impact** : Moyen (retarde lancement, épuise motivation)

**Mitigation** :

**Discipline Stricte Scoping** :
1. **Checklist Must-Have** : feature non listée ci-dessus = automatiquement Phase 2
2. **Timeboxing rigoureux** : 6 semaines max développement MVP, deadline non négociable
3. **Revue hebdomadaire** : "Est-ce que le MVP fonctionne sans cette feature ?" → si oui, couper
4. **Mantra MVP** : "Carte + zones + transparence = suffisant pour valider demande"

**Gestion Distractions** :
- Idées features notées dans backlog (`docs/backlog-phase2.md`) pour ne pas oublier
- Evaluation post-MVP basée sur feedback utilisateurs réels (pas hypothèses)

#### Risque Projet 2 : Accessibilité RGAA Sous-Estimée

**Probabilité** : Moyenne (30%)
**Impact** : Moyen-Élevé (non-conformité ou retard significatif)

**Mitigation** :

**Budget Temps Accessibilité (20-25% Temps Dev)** :
- Sur 6 semaines MVP : 1-1.5 semaines dédiées accessibilité
- Intégration continue (pas "fix A11Y à la fin")

**Process A11Y** :
1. **Checklist RGAA** dès wireframes : navigation clavier, contrastes, structure HTML
2. **Tests continus** : axe-core en CI/CD (détecte violations automatiques)
3. **Tests manuels hebdomadaires** : navigation clavier complète, lecteur écran NVDA (gratuit)
4. **Acceptance Criteria** : 80%+ critères AA respectés avant lancement
5. **Amélioration continue** : monitoring post-lancement, corrections rapides si signalements

**Formation/Documentation** :
- Tutoriel ARIA : https://developer.mozilla.org/fr/docs/Web/Accessibility/ARIA
- RGAA 4.1 officiel : https://accessibilite.numerique.gouv.fr/
- Checklist A11Y Project : https://www.a11yproject.com/checklist/

#### Risque Ressource 1 : Budget/Temps Insuffisants

**Probabilité** : Faible (20%) si planning réaliste
**Impact** : Élevé (abandon ou compromis qualité)

**Mitigation** :

**Scénarios Ressources** :

**Scénario Nominal** :
- Solo dev, 4-6 semaines temps plein
- Budget 500€ (hébergement 6 mois + domaine)
- Compétences : Next.js, PostGIS, A11Y

**Scénario Dégradé (Budget/Temps -50%)** :
- Réduction périmètre : 1 département au lieu de 3 (Bas-Rhin seul)
- Analytics zéro (logs serveur basiques)
- Accessibilité 60% critères (vs 80%) avec roadmap amélioration
- Hébergement low-cost (Hetzner 4€/mois VPS)

**Équipe Minimum Viable** :
- 1 développeur full-stack (Next.js + PostGIS)
- Compétences secondaires : UX/UI basique, accessibilité, acquisition données
- Temps : 20-30h/semaine pendant 6 semaines = 120-180h total

**Seuil Abandon** :
- Si < 80h disponibles sur 2 mois : MVP irréaliste, reporter ou abandonner

---

## Functional Requirements

### 1. Visualisation Cartographique

**FR1** : Les utilisateurs peuvent visualiser une carte interactive de la France avec zones sans chasse affichées distinctement

**FR2** : Les utilisateurs peuvent zoomer et déplacer la carte pour explorer différentes régions géographiques

**FR3** : Les utilisateurs peuvent identifier visuellement les zones sans chasse (différenciation claire zone protégée vs zone non couverte)

**FR4** : Les utilisateurs peuvent utiliser leur géolocalisation pour centrer automatiquement la carte sur leur position actuelle

**FR5** : La carte s'affiche de manière responsive sur tous appareils (mobile, tablette, desktop) avec interface adaptée à la taille d'écran

### 2. Recherche & Localisation Géographique

**FR6** : Les utilisateurs peuvent rechercher une zone géographique par nom de ville

**FR7** : Les utilisateurs peuvent rechercher une zone géographique par code postal

**FR8** : Les utilisateurs peuvent rechercher une zone géographique par département

**FR9** : Le système propose des suggestions automatiques pendant la saisie de recherche (autocomplete)

**FR10** : La carte se centre et zoome automatiquement sur la zone géographique recherchée

### 3. Consultation Informations Zones

**FR11** : Les utilisateurs peuvent sélectionner une zone sans chasse affichée sur la carte pour consulter ses détails

**FR12** : Les détails d'une zone incluent : nom de la zone, type de protection, gestionnaire, date de mise à jour des données

**FR13** : Les détails d'une zone incluent la source officielle des données (nom de la source et URL si disponible)

**FR14** : Les utilisateurs peuvent consulter la page "Sources de données" listant toutes les sources intégrées avec leur nom, URL, licence et date dernière mise à jour

### 4. Transparence & Conformité

**FR15** : Les utilisateurs reçoivent un avertissement clair lors de leur première visite expliquant les limites des données (non-exhaustivité, couverture partielle)

**FR16** : Les utilisateurs peuvent consulter une page "À propos" décrivant la mission, le contexte et les contacts du projet

### 5. Feedback & Contribution Utilisateur

**FR17** : Les utilisateurs peuvent signaler une erreur sur une zone affichée (via email ou formulaire simple)

**FR18** : Les utilisateurs peuvent suggérer une amélioration du site (via email ou formulaire simple)

**FR19** : Les utilisateurs peuvent proposer une nouvelle source de données à intégrer

**FR20** : Les utilisateurs reçoivent une confirmation que leur signalement a été reçu

### 6. Accessibilité Universelle

**FR21** : Les utilisateurs peuvent naviguer entièrement sur le site en utilisant uniquement le clavier (sans souris)

**FR22** : Les contrôles de la carte (zoom, déplacement) sont accessibles au clavier

**FR23** : Les formulaires de recherche et feedback sont accessibles au clavier et aux lecteurs d'écran

**FR24** : Les zones interactives (zones carte, boutons, liens) indiquent clairement le focus clavier visiblement

**FR25** : Les utilisateurs avec lecteurs d'écran peuvent accéder aux informations textuelles alternatives pour tous contenus visuels

**FR26** : Les utilisateurs peuvent utiliser un "skip link" pour accéder directement à la carte sans passer par la navigation

**FR27** : Le site respecte les ratios de contraste minimum WCAG 2.1 AA pour tous les textes et éléments interactifs

**FR28** : Le site utilise une structure HTML sémantique avec landmarks ARIA pour navigation assistée

### 7. Navigation & Routing

**FR29** : Les utilisateurs peuvent accéder directement à une vue de carte centrée sur un département spécifique via URL dédiée (ex: `/departements/bas-rhin`)

**FR30** : Les utilisateurs peuvent accéder directement à une vue de carte centrée sur une région via URL dédiée (ex: `/regions/grand-est`)

**FR31** : Les métadonnées de page (title, description) s'adaptent dynamiquement selon la route consultée pour optimisation SEO

**FR32** : Le site génère un sitemap XML à jour listant toutes les routes disponibles pour indexation moteurs de recherche

### 8. Gestion Données (Scripts Serveur)

**FR33** : Le système peut importer des données géospatiales depuis fichiers Shapefile via scripts d'import serveur

**FR34** : Le système peut importer des données géospatiales depuis fichiers GeoJSON via scripts d'import serveur

**FR35** : Le système peut importer des données géospatiales depuis fichiers GeoPackage via scripts d'import serveur

**FR36** : Le système stocke les géométries de zones en projection WGS84 (EPSG:4326) pour compatibilité web

**FR37** : Le système associe à chaque zone un identifiant de source de données et une date de mise à jour

**FR38** : Le système peut servir les données cartographiques au format tuiles vectorielles optimisé pour performance

**FR39** : Le système peut régénérer les pages statiques périodiquement pour intégrer nouvelles données (rebuild automatique via scripts)

---

## Non-Functional Requirements

### Performance

**NFR-PERF-1 : Temps de Chargement Initial**
- **Critère** : La page d'accueil (carte France entière) se charge complètement en **< 2 secondes** (75th percentile, connexion 3G mobile)
- **Mesure** : Google Lighthouse CI, métriques Core Web Vitals LCP (Largest Contentful Paint) < 2.5s
- **Justification** : Success Criteria défini étape 3, critique pour rétention utilisateurs mobiles

**NFR-PERF-2 : Réactivité Détails Zone**
- **Critère** : L'affichage des détails d'une zone (popup/sidebar) après clic sur polygone s'exécute en **< 500ms**
- **Mesure** : Tests automatiques Playwright mesurant temps entre clic et affichage contenu
- **Justification** : Interaction core utilisateur (Tom, Marie, Mireille), réactivité perçue critique

**NFR-PERF-3 : Recherche Géographique**
- **Critère** : La recherche par ville/code postal/département + zoom carte s'exécute en **< 1 seconde**
- **Mesure** : Tests automatiques mesurant temps entre validation input et fin animation zoom
- **Justification** : Fonctionnalité critique (géoloc desktop peu fiable), alternative principale navigation

**NFR-PERF-4 : Interactivité Carte**
- **Critère** : Les interactions carte (zoom, pan, hover zones) maintiennent **60 FPS** sur desktop, **30 FPS minimum** sur mobile
- **Mesure** : Tests performance MapLibre GL JS, monitoring frame rate via Chrome DevTools
- **Justification** : Fluidité carte = expérience utilisateur core, MapLibre WebGL optimisé pour cela

**NFR-PERF-5 : Tuiles Vectorielles MVT**
- **Critère** : Les tuiles vectorielles MVT sont générées et servies en **< 200ms** par requête (backend)
- **Mesure** : Logs backend PostgreSQL `ST_AsMVT()` + temps réponse HTTP
- **Justification** : Performance tuiles = fluidité zoom/pan carte, cache navigateur + serveur atténue mais première requête critique

**NFR-PERF-6 : Core Web Vitals (Google)**
- **Critère** : 
  - **LCP** (Largest Contentful Paint) : < 2.5s
  - **FID** (First Input Delay) : < 100ms
  - **CLS** (Cumulative Layout Shift) : < 0.1
- **Mesure** : Google Lighthouse CI intégré pipeline, seuil score Performance 90+
- **Justification** : SEO critique pour référencement Google, Core Web Vitals = facteur ranking

**NFR-PERF-7 : Budget Bundle JavaScript**
- **Critère** : Bundle JavaScript initial (hors MapLibre GL JS) **< 200KB gzipped**
- **Mesure** : Webpack Bundle Analyzer, CI/CD fail si dépassement
- **Justification** : Chargement mobile 3G, chaque KB compte, MapLibre déjà ~500KB donc budget serré

### Accessibility

**NFR-A11Y-1 : Conformité RGAA 4.1 Niveau AA Minimum**
- **Critère** : **80%+ des critères RGAA 4.1 niveau AA respectés** au lancement MVP, 100% objectif post-MVP
- **Mesure** : Checklist RGAA officielle auto-évaluée, audit externe si financement Phase 2
- **Justification** : Exigence légale civic tech France, accessibilité universelle primordiale

**NFR-A11Y-2 : Contrastes Visuels WCAG 2.1 AA**
- **Critère** : 
  - Texte normal : ratio contraste **≥ 4.5:1**
  - Texte large (18pt+) : ratio contraste **≥ 3:1**
  - Éléments interactifs (boutons, liens) : ratio contraste **≥ 3:1**
- **Mesure** : Outil axe DevTools (Chrome), tests automatiques axe-core CI/CD
- **Justification** : Lisibilité utilisateurs malvoyants, zones carte vertes doivent contraster avec fond OSM

**NFR-A11Y-3 : Navigation Clavier Complète**
- **Critère** : **100% des fonctionnalités** (carte, recherche, zones, formulaires, modales) accessibles uniquement au clavier (sans souris)
- **Mesure** : Tests manuels navigation Tab, Entrée, Flèches, Échap sur tous parcours utilisateurs
- **Justification** : Utilisateurs handicap moteur, navigation assistive technologies

**NFR-A11Y-4 : Focus Visuel Distinct**
- **Critère** : Focus clavier visible avec **indicateur visuel clair** (outline 2px minimum, contraste ≥ 3:1)
- **Mesure** : Revue visuelle manuelle + tests axe-core
- **Justification** : Utilisateurs naviguant au clavier doivent savoir où ils sont (Mireille avec aide fils)

**NFR-A11Y-5 : Compatibilité Lecteurs d'Écran**
- **Critère** : Site **100% navigable et compréhensible** avec lecteurs d'écran NVDA (Windows, gratuit) et JAWS
- **Mesure** : Tests manuels hebdomadaires NVDA pendant développement, tests JAWS si accès disponible
- **Justification** : Utilisateurs aveugles/malvoyants, ARIA landmarks + alternatives textuelles critiques

**NFR-A11Y-6 : Structure HTML Sémantique**
- **Critère** : **HTML5 valide** (validation W3C zéro erreur critique), landmarks ARIA (`main`, `nav`, `footer`) sur toutes pages
- **Mesure** : Validation W3C automatique CI/CD, tests axe-core ARIA
- **Justification** : Navigation assistive technologies repose sur structure sémantique correcte

**NFR-A11Y-7 : ARIA Live Regions**
- **Critère** : Résultats recherche dynamiques annoncés via **ARIA live regions** (lecteurs écran informés changements)
- **Mesure** : Tests NVDA vérifiant annonces vocales lors recherche/zoom
- **Justification** : Feedback auditif pour utilisateurs aveugles ("5 zones trouvées")

### Reliability & Availability

**NFR-REL-1 : Disponibilité Service (Uptime)**
- **Critère** : Site disponible **98%+ du temps** (uptime mensuel), soit ~14h downtime max/mois
- **Mesure** : Monitoring UptimeRobot (gratuit) ou StatusCake, alertes email si indisponibilité > 5min
- **Justification** : Site informationnel (pas critique comme urgences), mais downtime prolonged frustre utilisateurs saison chasse

**NFR-REL-2 : Gestion Dégradation Gracieuse**
- **Critère** : En cas de **panne géolocalisation ou recherche géographique**, site reste utilisable avec navigation carte manuelle
- **Mesure** : Tests manuels simulation pannes (Nominatim indisponible, géoloc refusée)
- **Justification** : Dépendances externes (Nominatim OSM) peuvent échouer, fallback nécessaire

**NFR-REL-3 : Messages Erreur Clairs**
- **Critère** : Erreurs utilisateurs (recherche échouée, zone non chargée) affichent **messages explicites non techniques** avec action suggérée
- **Mesure** : Revue UX de tous messages erreur, tests utilisateurs réels
- **Justification** : Transparence, utilisateurs non-tech doivent comprendre problème ("Ville introuvable, essayez code postal")

**NFR-REL-4 : Récupération Automatique**
- **Critère** : En cas d'échec requête temporaire (timeout tuiles MVT), système **retente automatiquement 1-2 fois** avant afficher erreur
- **Mesure** : Tests simulation latence/timeouts réseau
- **Justification** : Réseaux mobiles instables, retry automatique améliore expérience sans intervention utilisateur

**NFR-REL-5 : Logs et Monitoring**
- **Critère** : Erreurs backend et frontend **loguées centralement** avec stack traces, monitoring erreurs via Sentry (gratuit tier) ou logs serveur
- **Mesure** : Dashboard Sentry ou logs agregés accessibles, alertes si taux erreur > 5%
- **Justification** : Débogage rapide post-lancement, identification bugs avant signalements utilisateurs massifs

### Integration & External Dependencies

**NFR-INT-1 : Geocodage Nominatim (OpenStreetMap)**
- **Critère** : Service géocodage **Nominatim public OSM** utilisé avec **rate limiting respecté** (1 requête/seconde max)
- **Mesure** : Throttling côté client (debounce input 300ms), logs requêtes
- **Justification** : Nominatim gratuit mais limité, abus = bannissement IP, respect fair use

**NFR-INT-2 : Fallback Géocodage**
- **Critère** : Si Nominatim indisponible, **fallback vers base locale codes postaux** (table PostgreSQL) pour recherche basique
- **Mesure** : Tests simulation panne Nominatim, vérification fallback fonctionnel
- **Justification** : Résilience, recherche par code postal/département possible hors ligne avec données locales

**NFR-INT-3 : Fond de Carte OpenStreetMap**
- **Critère** : Tuiles raster OSM chargées depuis **serveurs publics OSM** avec cache navigateur agressif (7 jours)
- **Mesure** : Headers HTTP cache vérifiés, monitoring temps chargement tiles
- **Justification** : OSM gratuit et fiable, cache réduit charge serveurs OSM (bonne citoyenneté)

**NFR-INT-4 : Email SMTP Feedback**
- **Critère** : Formulaires feedback envoient emails via **SMTP simple** (serveur mail Scalingo/CleverCloud ou SMTP public type Brevo gratuit)
- **Mesure** : Tests envoi emails réels, vérification réception
- **Justification** : Pas de système tickets complexe au MVP, email suffit, SMTP doit être fiable

**NFR-INT-5 : Sources Données Externes (RNCFS, data.gouv.fr)**
- **Critère** : Import données depuis sources externes (Shapefile, GeoJSON) **validé géospatialement** avant intégration (géométries valides, projections correctes)
- **Mesure** : Scripts validation PostGIS (`ST_IsValid()`, `ST_SRID()`) lors import
- **Justification** : Données tierces peuvent être corrompues, validation évite bugs affichage carte

### Maintainability

**NFR-MAINT-1 : Standards Code et Linting**
- **Critère** : Code TypeScript/JavaScript respect **ESLint + Prettier** configurés strictement, zéro warning au commit
- **Mesure** : Pre-commit hooks (Husky), CI/CD fail si lint errors
- **Justification** : Solo dev ou petite équipe, cohérence code critique pour maintenabilité long terme

**NFR-MAINT-2 : Couverture Tests Unitaires**
- **Critère** : **60%+ couverture code** par tests unitaires (Vitest) sur logique métier (utils, helpers, composants critiques)
- **Mesure** : Coverage reports Vitest, CI/CD affiche pourcentage
- **Justification** : Tests préviennent régressions lors ajouts features, 60% = équilibre pragmatique MVP (pas 100% sur-ingénierie)

**NFR-MAINT-3 : Tests End-to-End (E2E)**
- **Critère** : **User journeys critiques** (Tom, Marie, Mireille) couverts par **tests E2E Playwright** (3-5 scénarios minimum)
- **Mesure** : Tests E2E exécutés CI/CD avant déploiement, fail si scénario échoue
- **Justification** : Garantit parcours complets fonctionnels (recherche → zoom → détails zone), détecte bugs intégration

**NFR-MAINT-4 : Documentation Code**
- **Critère** : Fonctions complexes (ex: génération tuiles MVT, transformations géospatiales) **documentées via JSDoc/TSDoc**
- **Mesure** : Revue code manuelle, exigence PR (pull requests)
- **Justification** : PostGIS/géospatial = domaine technique, documentation aide onboarding futurs contributeurs

**NFR-MAINT-5 : README et Documentation Setup**
- **Critère** : **README.md complet** avec instructions setup environnement local (PostgreSQL + PostGIS, Node.js, variables env, import données)
- **Mesure** : Test setup depuis zéro sur machine vierge (ou Docker)
- **Justification** : Reproductibilité environnement, contributeurs externes ou handover futur

**NFR-MAINT-6 : Scripts Import Données Documentés**
- **Critère** : Scripts import Shapefile/GeoJSON **documentés avec exemples** dans `docs/import-data.md`
- **Mesure** : Documentation revue, tests scripts sur nouvelles sources
- **Justification** : Import données = processus récurrent (nouveaux départements), doit être reproductible sans friction

**NFR-MAINT-7 : Versioning Sémantique**
- **Critère** : Releases suivent **Semantic Versioning** (SemVer 2.0) : `MAJOR.MINOR.PATCH` (ex: 1.0.0 MVP, 1.1.0 Phase 2)
- **Mesure** : Tags Git, CHANGELOG.md mis à jour chaque release
- **Justification** : Traçabilité versions, utilisateurs et contributeurs comprennent changements

### Security

**NFR-SEC-1 : HTTPS Obligatoire**
- **Critère** : **100% trafic HTTPS** (TLS 1.2+), redirection automatique HTTP → HTTPS
- **Mesure** : Tests HTTPS partout, certificat Let's Encrypt auto-renouvelé
- **Justification** : Exigence RGPD, sécurité formulaires feedback, SEO Google (HTTPS = ranking factor)

**NFR-SEC-2 : Protection CSRF (Cross-Site Request Forgery)**
- **Critère** : Formulaires feedback protégés par **tokens CSRF** (Next.js built-in ou bibliothèque)
- **Mesure** : Tests sécurité tentatives CSRF, vérification tokens
- **Justification** : Évite soumissions formulaires malveillantes depuis sites tiers

**NFR-SEC-3 : Protection Spam Formulaires**
- **Critère** : Formulaires feedback protégés par **honeypot** (champ invisible) ou **CAPTCHA simple** (hCaptcha gratuit, accessible)
- **Mesure** : Tests soumissions automatiques bloquées
- **Justification** : Évite spam bots, honeypot = invisible utilisateurs légitimes, hCaptcha RGPD-friendly

**NFR-SEC-4 : Sanitization Inputs Utilisateur**
- **Critère** : Inputs formulaires (recherche, feedback) **sanitizés** contre injections XSS (Cross-Site Scripting)
- **Mesure** : Zod validation + bibliothèque sanitization (DOMPurify côté client)
- **Justification** : Évite injections scripts malveillants via champs texte

**NFR-SEC-5 : Pas de Stockage Données Personnelles**
- **Critère** : **Zéro donnée personnelle stockée** sauf emails volontaires feedback (supprimés après traitement ou 1 an max)
- **Mesure** : Revue base données, audit RGPD
- **Justification** : Conformité RGPD par design, pas de comptes = pas de données à protéger

**NFR-SEC-6 : Headers Sécurité HTTP**
- **Critère** : Headers HTTP sécurité configurés :
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Content-Security-Policy` basique
  - `Strict-Transport-Security` (HSTS)
- **Mesure** : Tests SecurityHeaders.com, Mozilla Observatory
- **Justification** : Durcissement sécurité standard, protection clickjacking/MIME sniffing

**NFR-SEC-7 : Dépendances À Jour**
- **Critère** : Dépendances npm **mises à jour mensuellement**, vulnérabilités critiques patchées **< 48h**
- **Mesure** : `npm audit` CI/CD, Dependabot/Renovate alerts GitHub
- **Justification** : Vulnérabilités dépendances = vecteur attaque fréquent, veille sécurité nécessaire

---
