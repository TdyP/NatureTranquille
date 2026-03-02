---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments: []
date: 2026-02-27
author: Teddy
---

# Product Brief: NatureTranquille

## Executive Summary

**NatureTranquille** vise à centraliser sur une carte interactive les zones connues où la chasse est interdite ou fortement restreinte en France, afin de réduire l'incertitude pour les personnes qui souhaitent profiter de la nature en toute sécurité. L'objectif est de proposer une vue d'ensemble des zones sans chasse à partir des sources disponibles, tout en étant transparent sur les limites : la carte affiche les zones connues à partir des sources documentées, sans garantir une couverture exhaustive. L'outil s'adresse en priorité aux particuliers qui n'ont pas accès aux connaissances locales ou aux guides professionnels. La stratégie prévoit une phase pilote sur un territoire limité (riche en open data), une validation rapide avec les utilisateurs, puis une expansion progressive au niveau national.

---

## Core Vision

### Problem Statement

En France, il est très difficile de savoir où la chasse est interdite. Les sources sont éclatées : réserves naturelles, réserves de chasse nationales (RNCFS) ou régionales, terrains privés… Aucun outil ne centralise ces informations. Résultat : beaucoup de personnes renoncent aux balades en forêt pendant la saison de chasse.

### Problem Impact

Beaucoup évitent simplement les balades en forêt quand la chasse est ouverte. Certains ont des connaissances locales ; les autres restent en zone floue ou s'abstiennent. Les particuliers sans accès à un guide sont les plus touchés.

### Why Existing Solutions Fall Short

Des données existent partiellement : cartes des réserves nationales (RNCFS), open data pour certains départements (ex. Savoie). Mais aucune solution ne regroupe toutes ces zones pour la France entière. Les données ne sont pas toutes publiques ou accessibles, ce qui nécessite des recherches et une compréhension technique.

### Proposed Solution

Une carte interactive permettant de visualiser d'un coup d'œil les zones sans chasse connues, autour de soi ou n'importe où en France. L'outil agrège les données disponibles (open data et sources identifiées) et les présente de manière simple, avec transparence sur le niveau de confiance des données et les limites de couverture.

### Key Differentiators

- **Centralisation** : première vue d'ensemble des zones sans chasse connues sur le territoire
- **Transparence** : indication claire de la couverture des données et des limites de l'outil
- **Orientation grand public** : conçu pour les particuliers, pas pour les guides ou institutions
- **Positionnement neutre** : outil d'information pour profiter de la nature en sécurité, sans antagonisme

### Anticipation des Échecs (Pre-mortem)

**Risques identifiés :** couverture incomplète → perte de confiance ; données obsolètes → incidents ; absence de modèle de soutien → impossibilité de maintenir ; faible adoption ; positionnement perçu comme conflictuel.

**Stratégies de mitigation :** transparence sur les limites des données ; cadence de mise à jour claire ; réflexion précoce sur la viabilité (dons, partenariats) ; alliances avec associations de randonnée ; positionnement neutre ; phase pilote sur un territoire limité.

### Parcours vers le Succès (Reverse Engineering)

**État visé (3 ans) :** NatureTranquille est la référence pour trouver des zones sûres en période de chasse en France.

**Implications stratégiques :** phase pilote sur un territoire limité (ex. Savoie) plutôt que couverture nationale immédiate ; validation rapide avec utilisateurs réels avant expansion ; chaîne de données claire dès le MVP.

### Scénarios Exploratoires (What If)

**Scénarios clés :** open data généralisé → prioriser les sources existantes ; partenariat ONF/FFRandonnée → cibler dès le pilote ; app mobile indispensable → MVP web, concevoir pour PWA future ; opposition des fédérations → positionnement neutre ; crowdsourcing → prévoir contributions vérifiées ; concurrence Google Maps → se différencier par la spécialisation.

---

## Target Users

### Primary Users

**Tom** — Papa de 2 enfants en bas âge. Veut se promener le dimanche en forêt sans prendre de risque. Besoin : identifier rapidement des zones sûres pour une balade en famille.

**Marie** — Photographe animalière. Fait de l'affût en forêt là où il y a des animaux mais pas de chasseurs (risque élevé). Besoin : zones calmes sans chasse pour l'observation.

**Mireille** — Amatrice de champignons. Sort des sentiers pour trouver les meilleurs coins mais a peur des zones de chasse. Besoin : repérer des zones sans chasse pour cueillir en sécurité.

*Besoin commun* : accès rapide à l'information. Flux : arriver sur site/app → carte → (optionnel) géolocalisation → zones visibles → clic pour le type de restriction (parc naturel, RNCFS, réserve locale, terrain privé…). *Moment "aha"* : « Je vois une zone verte près de chez moi, je peux enfin planifier ma sortie sereinement. »

**Positionnement** : NatureTranquille est un outil d'information pour faciliter la cohabitation, pas un outil anti-chasse. Il améliore l'information du public sans restreindre les activités de chasse.

### Secondary Users

Clubs de randonnée, clubs photo, associations nature — relais de diffusion auprès de leurs adhérents.

### User Journey

- **Découverte** : recherche Google, bouche-à-oreille, relais associations
- **Usage principal** : préparation de sortie
- **Exigences** : trouvabilité Google, partage facile

---

---

## Success Metrics

### User Success

**Critère principal** : L'utilisateur trouve ce qu'il est venu chercher — une information sur les zones sûres autour de lui. Le succès se mesure à la satisfaction du besoin : découvre une zone qu'il ne connaissait pas, confirme qu'un spot repéré est safe, ou planifie une sortie en sérénité.

**Moments de succès** :
- "Ah tiens là c'est une réserve, je savais pas — je vais aller me balader là-bas"
- "L'endroit que j'ai repéré est dans une RNCFS, je peux y aller tranquille"
- "Où pourrais-je aller tranquille ce week-end ?" → trouve une réponse

### Growth Indicators

**Couverture territoriale** : étendue du territoire couvert (départements, régions). La couverture comme indicateur principal de croissance du projet.

### Secondary (plus tard)

Utilisateurs, performances — à considérer une fois le produit stabilisé.

---

---

## MVP Scope

### Core Features

- Carte affichant les zones sans chasse (zoom, déplacement)
- Géolocalisation utilisateur
- Clic sur une zone → détail : type d'interdiction, date de mise à jour, nom
- Signalement d'erreur : lien email simple (contact@...)
- App web responsive (consultation mobile)

### Out of Scope for MVP

- App native
- Mise à jour automatique des données
- Interdictions temporelles (dates d'ouverture chasse)
- Crowdsourcing / contributions utilisateurs

### Future Vision

1. Mise à jour automatique des données
2. Interdictions temporelles par département avec sélecteur de date
3. Crowdsourcing (incertitude technique — données à définir pour intégration)

---

<!-- Next: Complete (step 6) -->
