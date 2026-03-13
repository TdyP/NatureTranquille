---
stepsCompleted: [1, 2, 3]
inputDocuments:
    - '_bmad-output/planning-artifacts/product-brief-NatureTranquille-2026-02-27.md'
    - '_bmad-output/planning-artifacts/prd.md'
    - '_bmad-output/planning-artifacts/research/technical-stockage-donnees-geolocalisees-pour-carte-research-2026-03-09.md'
project_name: 'NatureTranquille'
date: '2026-03-13'
author: 'Teddy'
---

# UX Design Specification NatureTranquille

**Author:** Teddy
**Date:** 13 mars 2026

---

## Executive Summary

### Project Vision

NatureTranquille est une application web cartographique qui démocratise l'accès aux zones sans chasse en France. Le produit transforme des données publiques géospatiales éclatées et techniques (RNCFS, réserves naturelles, open data départementaux) en une carte interactive unique, simple et accessible au grand public.

La vision UX repose sur trois piliers :

1. **Simplicité Radicale** : Une carte, une recherche, des détails. Pas de complexité SIG, pas de jargon technique.
2. **Transparence comme Force** : Afficher clairement ce qui est connu vs inconnu, transformer les limites en opportunité de contribution communautaire.
3. **Performance Multi-Échelle** : Navigation fluide du niveau national au niveau local avec affichage instantané des détails (< 500ms).

Le moment décisif : un utilisateur découvre une zone protégée près de chez lui qu'il ne connaissait pas et planifie sereinement sa sortie nature.

### Target Users

**Persona Primaire : Tom - Le Parent Sécuritaire**

- 38 ans, papa de 2 enfants en bas âge (Léa 4 ans, Hugo 6 ans)
- Veut emmener ses enfants en forêt le dimanche sans risque pendant la saison de chasse
- Niveau tech : utilisateur moyen, privilégie simplicité et rapidité
- Devices : mobile pour géolocalisation terrain, desktop pour planification weekend
- Moment d'usage : samedi soir après avoir couché les enfants
- Besoin UX : **trouver une zone sûre en moins de 2 minutes** avec confiance dans l'information

**Persona Secondaire : Marie - La Photographe Méthodique**

- 52 ans, photographe animalière semi-professionnelle
- Cherche spots d'affût sans perturbation humaine pour photographier cerfs/chevreuils
- Niveau tech : savvy, utilise Google Maps satellite pour cross-check
- Devices : desktop pour recherche approfondie, mobile sur terrain
- Moment d'usage : planification 2-3 semaines à l'avance pour sessions photo
- Besoin UX : **exploration stratégique** avec critères multiples (forêt dense, proximité cours d'eau) + fiabilité données

**Persona Tertiaire : Mireille - La Cueilleuse Traditionnelle**

- 64 ans, retraitée passionnée de mycologie
- Adore cueillette champignons mais redoute stress de la chasse
- Niveau tech : moyennement à l'aise, a besoin d'aide de son fils
- Devices : desktop avec assistance familiale
- Moment d'usage : saison champignons (septembre-octobre)
- Besoin UX : **interface très simple** avec gros boutons clairs, pas de terminologie complexe

**Caractéristiques Communes :**

- Frustration avec solutions actuelles : données éclatées, barrière technique
- Résultat actuel : **renoncement** aux sorties nature pendant chasse
- Attente : solution simple, rapide, fiable avec transparence sur limites

### Key Design Challenges

**Challenge 1 : Gestion UX de l'Incertitude et des Données Incomplètes**

Le défi fondamental de NatureTranquille est que la couverture territoriale sera progressive (5 départements au MVP → 20 à 6 mois → nationale à plus long terme). Comment communiquer clairement que la carte affiche **uniquement les zones connues** sans décourager l'utilisation ?

**Edge Case Critique :**

- Tom recherche "Givors 69700" → carte zoom sur sa zone... mais elle est vide (Rhône pas encore couvert)
- Risque : frustration, incompréhension ("pas de zones sans chasse près de chez moi ?"), abandon

**Solutions UX :**

- **Disclaimer visible mais non intrusif** : bandeau info discret ou bouton ℹ️ "À propos" bien placé
- **Message clair** : "Carte affiche SEULEMENT zones sans chasse identifiées à ce jour. Absence de zone ≠ chasse autorisée partout (peut être manque de données)."
- **Page "Sources de données"** accessible avec liste départements couverts + roadmap expansion visible
- **Feedback valorisé** : bouton "Signaler mon intérêt pour cette zone" → email confirmation "Département prévu Q2 2026"
- **Framing positif** : "Données en expansion continue - aidez-nous à compléter !" vs "Données incomplètes"

**Challenge 2 : Performance Cartographique Multi-Échelle**

Afficher des milliers de zones polygonales complexes (certaines avec des milliers de points) du niveau national (France entière) au niveau local (parcelle) avec navigation fluide.

**Contraintes Techniques :**

- Chargement initial < 2s (75th percentile, 3G mobile)
- Détails zone < 500ms au clic
- Navigation (zoom, pan) sans lag perceptible
- Support mobile (tactile) + desktop (souris)

**Solutions UX/Technique :**

- **Tuiles vectorielles MVT** : format binaire compact (~10x plus léger que GeoJSON), simplification géométrique adaptative par zoom (Douglas-Peucker)
- **Clustering visuel** si densité zones élevée à faible zoom
- **Données embarquées dans tuiles** : métadonnées (nom, type, gestionnaire) incluses → popup instantanée sans API call
- **Code splitting** : MapLibre GL JS (~500KB gzipped) chargé séparément
- **Cache multi-niveaux** : navigateur 1 an (tiles immutables), serveur Nginx, CDN UE si nécessaire

**Challenge 3 : Accessibilité Multi-Générations et Conformité RGAA 4.1**

3 générations d'utilisateurs (Tom 38 ans, Marie 52 ans, Mireille 64 ans) avec niveaux techniques différents, dont certains nécessitant assistance (Mireille + fils).

**Exigences RGAA Niveau AA :**

- **Contrastes** : ratios ≥ 4.5:1 texte normal, ≥ 3:1 texte large/éléments interactifs
- **Navigation clavier complète** : carte navigable touches fléchées, focus visible, ordre tabulation logique
- **Mobile tactile** : boutons ≥ 44px minimum, bottom sheet pour détails zones (ne masque pas carte)
- **Zones identifiables sans couleur seule** : motif/forme en plus de vert
- **Labels explicites** : tooltips pour termes techniques (RNCFS → "Réserve Nationale de Chasse et de Faune Sauvage")
- **Lecteurs d'écran** : ARIA landmarks, description textuelle alternative carte (liste zones sous carte)

**Solutions UX :**

- **Design responsive mobile-first** : carte plein écran 100vh, header minimal fixe
- **Contrôles tactiles natifs MapLibre** : pinch-zoom, pan, boutons zoom +/- tactiles 44px
- **Simplicité interface** : pas de menus complexes, fonctions principales accessibles en 1-2 taps
- **Aide contextuelle** : bouton aide visible, tooltips sur termes techniques

**Challenge 4 : Clarification Terminologique et Pédagogie sur Types de Zones**

Un piège sémantique majeur menace l'adoption du produit : **"réserve de chasse"** peut être interprété à l'opposé de sa signification réelle.

**Confusion Potentielle :**

- Utilisateur lit "Réserve de Chasse" → pense "zone réservée À la chasse" → évite la zone
- Réalité : RNCFS = Réserve Nationale de Chasse et de Faune Sauvage = **chasse interdite**
- Risque : utilisateurs ne vont pas dans des zones sûres par incompréhension du terme

**Problèmes de Wording :**

- "Zone sans chasse" : correct mais inélégant, peu engageant
- "Réserve de chasse" : ambigu, peut être mal compris
- Besoin : terminologie claire, compréhensible instantanément, alignée avec recherches Google

**Considérations SEO :**
Les utilisateurs recherchent :

- "carte des réserves de chasse" (ambigu mais recherché)
- "carte zone chasse interdite" (clair mais verbeux)
- "où se promener sans chasse"
- "forêt sans chasseurs"

Il faut que le wording UX soit à la fois :

1. **Clair** : aucune ambiguïté possible sur "chasse autorisée vs interdite"
2. **SEO-friendly** : matche les termes recherchés par les utilisateurs
3. **Élégant** : pas trop technique, engageant

**Solutions UX :**

1. **Système de Labeling Hiérarchique**
    - **Titre principal carte** : "Zones Protégées de la Chasse" (clair + SEO)
    - **Sous-titre explicatif** : "Réserves naturelles et zones où la chasse est interdite"
    - **Dans les détails** : utiliser le nom officiel ("RNCFS") avec explication immédiate

2. **Espace Pédagogique Intégré**
   Prévoir dans l'UX un espace accessible (sans être intrusif) pour expliquer les types de zones :
    - **Bouton ℹ️ "Types de zones"** dans le header (à côté recherche)
    - **Modal/panneau latéral** avec explications :

        ```
        🌲 Réserve Naturelle
        Zone protégée pour la biodiversité. Chasse interdite toute l'année.

        🦌 RNCFS (Réserve Nationale de Chasse et de Faune Sauvage)
        Espace de protection de la faune. Chasse interdite.
        Note : "réserve de chasse" signifie zone SANS chasse, pas zone pour chasser.

        🏞️ Réserve Régionale/Départementale
        Zone protégée par autorité locale. Chasse interdite.

        🔒 Terrain Privé - Chasse Interdite
        Propriété privée où le propriétaire interdit la chasse.
        ```

3. **Clarifications Visuelles**
    - **Icônes distinctives** par type (🌲 réserve naturelle, 🦌 RNCFS, etc.)
    - **Code couleur** : toutes en vert (sûres) mais nuances différentes par type
    - **Tooltip hover desktop** : "RNCFS - Chasse interdite"
    - **Popup détails** : première ligne toujours "✅ Chasse interdite" en gras

4. **Wording Page d'Accueil et SEO**
    - **H1** : "Carte des Zones où la Chasse est Interdite en France"
    - **Meta description** : "Trouvez les réserves naturelles, RNCFS et zones protégées de la chasse pour vos balades en forêt en toute sécurité."
    - **URLs départements** : `/departements/bas-rhin/zones-chasse-interdite` ou `/departements/bas-rhin/zones-protegees`
    - **Contenu texte minimal SEO** (footer) : "Réserves de chasse (RNCFS), réserves naturelles, zones chasse interdite"

5. **Glossaire/FAQ Intégré**
   Page `/glossaire` accessible depuis footer :
    - "Qu'est-ce qu'une RNCFS ?"
    - "Pourquoi 'réserve de chasse' signifie 'sans chasse' ?"
    - "Quels types de zones sont affichés ?"
    - SEO-friendly pour requêtes informationnelles

**Affinage Progressif :**
Au MVP, tester plusieurs formulations avec utilisateurs réels (A/B testing si trafic suffisant) :

- Variante A : "Zones Protégées de la Chasse"
- Variante B : "Zones Sans Chasse"
- Variante C : "Espaces Nature Sécurisés"

Mesurer :

- Taux de compréhension (questionnaire post-usage)
- Taux de clics sur explication "Types de zones"
- Signalements d'erreurs liés à confusion terminologique

### Design Opportunities

**Opportunité 1 : Transparence Radicale comme Avantage Compétitif**

Plutôt que de promettre l'exhaustivité (approche marketing classique impossible à garantir), faire de la **transparence sur les limites** une stratégie de différenciation.

**Positionnement Unique :**

- "Voici ce que nous savons" vs "Voici tout ce qu'il y a"
- Page "Sources de données" détaillée avec méthodologie de validation, roadmap départements, appel à contribution
- Signalements utilisateurs = amélioration visible du produit
- Confiance renforcée à long terme vs sur-promesse → déception

**UX Innovation :**

- Transformer limitation en force : communauté contributrice (signalements zones manquantes, suggestions sources départementales)
- Feedback loop visible : "Grâce à vos signalements, nous avons ajouté 3 nouveaux départements ce mois"
- Positionnement factuel et apaisé vs militant anti-chasse

**Opportunité 2 : Deep Linking SEO-Optimisé pour Découvrabilité Maximale**

NextJS 14+ avec SSG permet génération de routes statiques pour chaque département avec métadonnées dynamiques.

**Pattern UX :**

- URLs typées `/departements/bas-rhin`, `/regions/grand-est` → carte auto-zoomée sur zone
- `<title>` dynamique : "Zones Sans Chasse - Bas-Rhin | NatureTranquille"
- OpenGraph pour partage réseaux sociaux : image carte + description zone
- Simplicité maximale : pas de contenu texte généré (FAQ, listes), juste carte + métadonnées SEO

**Avantages Discovery :**

- Utilisateur cherche "zones sans chasse Bas-Rhin" → trouve lien direct département
- Clic → carte affichée **directement zoomée** sur Bas-Rhin, pas de navigation manuelle
- Partage facilité : Tom envoie lien WhatsApp aux parents d'élèves → accès direct zone
- Référencement Google optimisé par départements

**Opportunité 3 : Simplicité Extrême vs Complexité SIG Institutionnelle**

Les portails gouvernementaux géospatiaux sont souvent complexes, techniques, destinés à des professionnels. NatureTranquille peut se différencier par une **simplicité radicale**.

**Design Principles :**

- **Une seule page** : carte interactive, pas de navigation multi-pages
- **Clarté terminologique** : privilégier "chasse interdite" aux termes ambigus, prévoir espace pédagogique accessible mais non intrusif (modal/panneau "Types de zones")
- **Pas de jargon non expliqué** : RNCFS toujours accompagné de "Chasse interdite" ou d'une icône ✅
- **Zéro configuration** : pas de réglages, pas de compte utilisateur au MVP
- **Focus unique** : afficher zones, expliquer clairement ce qu'elles signifient
- **Mobile-first** : optimisé pour usage terrain avec tooltips tactiles pour explications

**Contraste Différenciateur :**

- Portails SIG institutionnels : WMS/WFS, CQL filters, projections multiples, exports techniques
- NatureTranquille : carte + recherche + détails + clarifications, c'est tout
- Courbe d'apprentissage : < 30 secondes vs plusieurs minutes pour portails SIG

---

## Core User Experience

### Defining Experience

L'expérience centrale de NatureTranquille repose sur une action primaire unique et critique :

**"Trouver rapidement une zone sans chasse autour de moi"**

Cette action définit tout le produit. Que ce soit Tom samedi soir planifiant sa sortie du dimanche, Marie cherchant un spot d'affût 3 semaines à l'avance, ou Mireille explorant de nouveaux coins champignons, tous convergent vers cette action fondamentale.

**L'expérience se décompose en trois étapes critiques :**

1. **Arrivée et Contexte** (0-5 secondes)
    - Carte charge instantanément (< 2s)
    - Hiérarchie de contextes intelligente (sans configuration utilisateur) :
        1. **Géolocalisation accordée** → zoom automatique position utilisateur
        2. **Pas de géoloc + utilisateur récurrent** → zoom dernière zone consultée (mémorisée au clic zone)
        3. **Pas de géoloc + nouveau visiteur** → affichage France entière avec **zone de recherche bien visible**

2. **Découverte Visuelle** (5-60 secondes)
    - Navigation fluide : zoom, pan, rotation sans lag perceptible
    - Zones vertes immédiatement identifiables et compréhensibles
    - Clustering visuel si forte densité à faible zoom
    - Simplification géométrique adaptative automatique selon niveau de zoom
    - **Contrôle "Vue France"** (🏠) : réinitialiser vue vers France entière en 1 clic (bottom-right, discret)

3. **Validation et Détails** (1-2 minutes)
    - Clic sur zone → popup instantanée (< 500ms) avec métadonnées embarquées
    - Première ligne toujours "✅ Chasse interdite" (clarté immédiate)
    - Type de zone + explication pédagogique accessible (modal "Types de zones")
    - Informations complémentaires : gestionnaire, date mise à jour, source données
    - **Stockage automatique** : `lastViewedRegion` sauvegardé au clic zone (intention explicite), pas navigation passive

**Moment "Aha!" :**
L'utilisateur voit une zone verte près de chez lui qu'il ne connaissait pas et réalise : _"Je peux aller me promener là en toute sécurité."_

**Objectif temporel :**
De l'URL tapée à la découverte d'une zone pertinente : **moins de 2 minutes** pour un utilisateur moyen, **moins de 30 secondes** pour un utilisateur récurrent.

### Platform Strategy

**Plateforme Primaire : Web Application Responsive (Mobile-First)**

NatureTranquille est une **Single Page Application (SPA)** accessible via navigateur web, optimisée mobile-first avec support desktop complet.

**Justification Stratégique :**

1. **Pas d'app native au MVP** :
    - Barrière d'installation éliminée (pas de téléchargement App Store/Play Store)
    - Découvrabilité SEO maximale (Google indexation directe)
    - Maintenance simplifiée (une seule codebase)
    - Partage facilité (URL directe, pas "télécharge l'app d'abord")

2. **Web-first mais mobile-optimized** :
    - 70%+ usage attendu mobile (géolocalisation terrain, recherche en mobilité)
    - 30% usage desktop (planification approfondie, exploration stratégique)
    - Design responsive adaptatif, pas simplement réduit

3. **Progressive Web App (PWA) - Post-MVP** :
    - Installable sur home screen mobile sans app native
    - Mode hors-ligne potentiel (cache tuiles zones favorites)
    - Notifications push géolocalisées ("Vous approchez d'une zone sans chasse")
    - Intégration GPS temps réel pour randonneurs

**Modalités d'Interaction :**

- **Mobile (< 768px)** : Tactile primaire
    - Pinch-to-zoom, pan gestuel, tap pour détails
    - Bottom sheet slide-up pour détails zones (ne masque pas carte)
    - Boutons tactiles ≥ 44px (WCAG)
    - Recherche fixe top, toujours accessible
    - Contrôle "Vue France" 🏠 32px (action secondaire)

- **Desktop (≥ 1024px)** : Souris + Clavier
    - Scroll-wheel zoom, drag pan, clic pour détails
    - Sidebar permanent 400px pour détails zones
    - Hover states sur polygones (highlight au survol)
    - Navigation clavier complète (accessibilité RGAA)
    - Contrôle "Vue France" avec tooltip "Voir la France entière"

**Capacités Plateforme Exploitées :**

- **Geolocation API** (mobile primaire) : zoom automatique position utilisateur
- **LocalStorage** : mémorisation `lastViewedRegion` (clic zone), préférences disclaimer
- **Service Workers** (PWA post-MVP) : cache tuiles pour performance et offline
- **Clipboard API** : partage URL position/zoom spécifique
- **Share API** (mobile) : partage natif zone découverte

**Contraintes Plateforme :**

- **Support navigateurs** : 3 dernières versions Chrome, Firefox, Safari, Edge
- **Pas de support IE11** : EOL 2022, incompatible MapLibre GL JS
- **Performance 3G mobile** : chargement < 2s même sur connexion lente (contrainte design)
- **Accessibilité** : RGAA 4.1 niveau AA obligatoire (service public)

**Partage Social et OpenGraph :**

- **MVP** : Image OpenGraph statique (carte France + logo NatureTranquille)
- **V1 (Post-MVP)** : Images dynamiques par département (pré-générées au build Next.js)
- Partage URL avec preview optimisé pour WhatsApp, Facebook, Twitter

### Effortless Interactions

Les interactions suivantes doivent être **complètement naturelles, sans friction, intuitives** :

**1. Découverte Visuelle des Zones**

- **Comportement** : Zones vertes immédiatement visibles dès chargement carte
- **Zero Effort** : Pas de clic "afficher les zones", pas de layer toggle, pas de config
- **Technique** : Tuiles vectorielles MVT pré-chargées, rendu côté client instantané
- **Feedback** : Zones apparaissent progressivement pendant zoom (pas de flash/reload)

**2. Navigation Cartographique Multi-Échelle**

- **Comportement** : Zoom fluide du niveau France au niveau parcelle sans lag
- **Zero Effort** : Pas de bouton "simplifier géométries", adaptation automatique
- **Technique** : Simplification géométrique (Douglas-Peucker) par niveau de zoom côté serveur, clustering visuel si densité élevée
- **Feedback** : Navigation instantanée, pas de spinner/loader pendant pan/zoom

**3. Accès aux Détails d'une Zone**

- **Comportement** : Clic/tap sur polygone → popup détails instantanée (< 500ms)
- **Zero Effort** : Pas de "charger les détails", pas d'attente, métadonnées déjà là
- **Technique** : Métadonnées embarquées dans tuiles MVT (nom, type, gestionnaire, date)
- **Feedback** : Popup/bottom sheet apparaît immédiatement, pas d'API call visible

**4. Localisation et Mémorisation Contextuelle**

- **Comportement** : Arrivée sur site → contexte intelligent hiérarchique (géoloc > dernière zone > France)
- **Zero Effort** : Pas de "revenir à ma zone", pas de configuration, adaptation automatique
- **Technique** : Geolocation API + LocalStorage `lastViewedRegion` (stocké au clic zone, pas navigation passive)
- **Feedback** : Zoom immédiat sur contexte pertinent, contrôle 🏠 disponible pour réinitialiser

**5. Recherche Géographique**

- **Comportement** : Barre recherche bien visible top, autocomplete instantané
- **Zero Effort** : Tape "Lyon" → suggestions département/ville apparaissent, Enter → zoom
- **Technique** : Geocoding via Nominatim (OSS) ou base locale codes postaux, debounce 300ms
- **Feedback** : Suggestions dès 3 caractères, zoom smooth vers résultat

**6. Compréhension des Types de Zones**

- **Comportement** : Termes techniques (RNCFS) toujours accompagnés d'explication contextuelle
- **Zero Effort** : Pas de "lire le glossaire d'abord", clarifications intégrées inline
- **Technique** : Tooltips hover desktop, tap mobile, modal "Types de zones" accessible header
- **Feedback** : Icônes distinctives par type (🌲 réserve naturelle, 🦌 RNCFS), code couleur nuancé

**Interactions Éliminées (vs Concurrents SIG) :**

- ❌ Pas de sélection de layers multiples (zones toujours affichées)
- ❌ Pas de choix projection/système coordonnées (WGS84 uniquement, transparent)
- ❌ Pas de configuration affichage (style unique optimisé)
- ❌ Pas de compte utilisateur obligatoire (accès direct anonyme)
- ❌ Pas de formulaires complexes avant d'accéder à la carte
- ❌ Pas de popup confirmation "revenir à dernière zone" (comportement par défaut intelligent)

### Critical Success Moments

**Moment 1 : First Impression (0-5 secondes) - "Je Comprends Immédiatement"**

**Critère de Succès :**
Un utilisateur qui arrive pour la première fois comprend **instantanément** de quoi il s'agit sans lire de texte explicatif.

**Éléments UX Critiques :**

- **H1 ultra-clair** : "Carte des Zones où la Chasse est Interdite en France"
- **Carte visible immédiatement** (pas de splash screen, pas de modal bloquant)
- **Zones vertes identifiables** en < 2 secondes de chargement
- **Disclaimer non intrusif** mais accessible (bandeau discret ou bouton ℹ️)

**Échec si :**

- Utilisateur se demande "c'est quoi ce site ?"
- Chargement > 3 secondes → frustration, rebond
- Carte vide (pas de zones visibles dans viewport initial) → confusion

**Mesure :** Taux de rebond < 40%, temps avant première interaction < 10 secondes

---

**Moment 2 : Discovery (5-60 secondes) - "Je Trouve une Zone Près de Moi"**

**Critère de Succès :**
L'utilisateur découvre **au moins une zone pertinente** dans sa zone géographique d'intérêt en moins de 1 minute.

**Éléments UX Critiques :**

- **Contexte intelligent** : géoloc → position, sinon dernière zone consultée (récurrent), sinon France + recherche visible
- **Recherche efficace** : recherche "Lyon" → zoom département → zones visibles
- **Zones visibles** : clustering intelligent pour éviter carte vide à faible zoom
- **Feedback couverture** : si zone vide, message clair "Pas encore de données pour cette région"
- **Contrôle utilisateur** : bouton 🏠 "Vue France" pour réinitialiser vue manuellement si besoin

**Échec si :**

- Utilisateur cherche sa ville, carte vide, pas d'explication → pense "pas de zones sûres ici"
- Navigation confuse, ne trouve pas comment zoomer sur sa région
- Trop de zones → surcharge visuelle, impossible de distinguer
- Dernière zone mémorisée frustrante (veut explorer ailleurs), pas de moyen facile de réinitialiser

**Mesure :** % sessions avec au moins 1 clic sur zone > 30%, recherche utilisée > 40% sessions sans géoloc, utilisation bouton 🏠 < 10% (signe que contexte intelligent fonctionne)

---

**Moment 3 : Validation (1-2 minutes) - "Cette Zone Est Sûre, Je Peux y Aller"**

**Critère de Succès :**
L'utilisateur clique sur une zone, lit les détails, et **valide mentalement** que c'est une zone sûre où il peut aller.

**Éléments UX Critiques :**

- **Popup instantanée** (< 500ms) avec info structurée et scannable
- **Première ligne en gras** : "✅ Chasse interdite" (validation immédiate)
- **Type de zone clair** : "Réserve Naturelle Régionale" + icône 🌲
- **Crédibilité** : Gestionnaire (Parc Naturel Régional du Pilat), date mise à jour (15/01/2026)
- **Explication accessible** : lien "Qu'est-ce qu'une réserve naturelle ?" vers modal pédagogique

**Échec si :**

- Popup trop lente (> 1s) → utilisateur clique ailleurs, frustration
- Infos floues/ambiguës → doute "est-ce vraiment sans chasse ?"
- Jargon non expliqué (RNCFS sans clarification) → incompréhension
- Données obsolètes visibles (mise à jour 2018) → perte de confiance

**Mesure :** Temps moyen sur détails zone > 5 secondes (lecture), taux de signalement confusion < 5%

---

**Moment 4 : Action (Post-Découverte) - "Je Planifie Ma Sortie / Je Partage"**

**Critère de Succès :**
L'utilisateur a suffisamment confiance pour **agir** : planifier une sortie, sauvegarder la zone, partager le lien.

**Éléments UX Critiques :**

- **Partage facile** : bouton "Partager cette zone" → copie URL avec position/zoom spécifique
- **Preview OpenGraph** : MVP = image statique (carte France + logo), V1 = images dynamiques par département
- **Recallabilité** : URL `/departements/bas-rhin` bookmarkable, retour direct à la zone
- **Confiance renforcée** : page "Sources de données" accessible, méthodologie transparente
- **Call-to-action subtil** : "Trouvé une erreur ? Signalez-la ici" (contribution communautaire)

**Échec si :**

- Utilisateur découvre zone mais ne peut pas retrouver facilement (pas d'URL partageable)
- Partage WhatsApp sans preview attrayant → faible taux de clic
- Doute persiste après lecture détails → ne va pas sur le terrain
- Pas de mécanisme pour signaler erreur → frustration silencieuse si info incorrecte

**Mesure :** Taux de partage (Share API + copie URL) > 10%, signalements utilisateurs > 5/semaine au MVP

---

**Moment 5 : Récurrence (Utilisateur Revenant) - "Je Reviens Régulièrement"**

**Critère de Succès :**
Un utilisateur satisfait revient explorer d'autres zones ou vérifier de nouvelles données.

**Éléments UX Critiques :**

- **Performance constante** : expérience aussi fluide à la 10e visite qu'à la 1ère
- **Contexte mémorisé** : zoom automatique dernière zone consultée (si pas de géoloc) → gain de temps immédiat
- **Évolution visible** : bandeau "3 nouveaux départements ajoutés ce mois" → sentiment de progrès
- **Valeur ajoutée** : utilisateur découvre des zones qu'il n'aurait jamais trouvées autrement
- **Facilité extrême** : bookmark homepage ou URL département favorite, accès direct

**Échec si :**

- Expérience régresse (performance dégradée, bugs introduits)
- Données stagnent (pas de mise à jour visible) → perd intérêt
- Utilisateur a fait le tour de sa région, pas d'incitation à explorer ailleurs
- Contexte mémorisé toujours même zone → frustrant s'il veut explorer ailleurs (mitigé par bouton 🏠)

**Mesure :** Taux de retour 30 jours > 20%, sessions moyennes par utilisateur récurrent > 3

### Experience Principles

**Principe 1 : "Visual-First, Zero Configuration"**

La carte EST l'interface. Aucune configuration, aucun réglage, aucune étape préliminaire. L'utilisateur arrive → la carte charge avec les zones → c'est tout.

**Application Concrète :**

- Pas de wizard "configurez votre recherche"
- Pas de choix de style carte (un seul, optimisé)
- Pas de toggle layers (zones toujours affichées)
- Pas de compte requis pour consulter

**Trade-off Assumé :** Moins de flexibilité vs simplicité radicale. Nous sacrifions la personnalisation pour l'instantanéité.

---

**Principe 2 : "Performance as a Feature"**

La vitesse n'est pas un détail technique, c'est une feature UX centrale. Chaque milliseconde compte pour l'expérience de découverte fluide.

**Application Concrète :**

- Chargement initial < 2s (contrainte design, pas "best effort")
- Détails zone < 500ms (métadonnées embarquées tuiles)
- Navigation (zoom, pan) 60 FPS minimum
- Pas de spinner/loader visible sauf chargement initial

**Performance Measurement (Monitoring Production) :**

- **Target** : 75th percentile, 3G mobile, France métropolitaine
- **Monitoring** : Real User Monitoring (RUM) avec alertes si dérive > 10%
- **Budget Performance** : < 200KB JS initial (hors MapLibre GL JS ~500KB)
- **Core Web Vitals** : LCP < 2.5s, FID < 100ms, CLS < 0.1

**Trade-off Assumé :** Complexité technique accrue (tuiles vectorielles, cache multi-niveaux, pré-génération) vs UX instantanée. Nous investissons en infra pour éviter latence utilisateur.

---

**Principe 3 : "Transparency Builds Trust"**

L'honnêteté radicale sur les limites est un actif UX, pas un défaut à cacher. L'utilisateur doit toujours savoir ce qu'il consulte et ce qui manque.

**Application Concrète :**

- Disclaimer visible mais non intrusif (pas de modal bloquant, bandeau discret)
- Page "Sources de données" accessible en 1 clic
- Roadmap expansion départements publique
- Date de mise à jour visible sur chaque zone
- Message clair si zone sans données : "Pas encore de données pour cette région, département prévu Q2 2026"

**Trade-off Assumé :** Risque de décourager certains utilisateurs vs confiance long terme. Nous préférons la transparence qui fidélise à la sur-promesse qui déçoit.

---

**Principe 4 : "Context-Aware, Not User-Configured"**

Le système s'adapte intelligemment au contexte utilisateur avec une hiérarchie de contextes claire, sans demander de configuration explicite.

**Hiérarchie de Contextes (du plus frais au fallback) :**

1. **Géolocalisation accordée** → zoom automatique position actuelle (contexte temps réel le plus pertinent)
2. **Pas de géoloc + utilisateur récurrent** → zoom dernière zone consultée (contexte mémorisé, pertinence élevée)
3. **Pas de géoloc + nouveau visiteur** → France entière + recherche bien visible (contexte neutre, découverte ouverte)

**Stockage Contexte :**

- `lastViewedRegion` sauvegardé **automatiquement lors du clic sur une zone** (manifeste intérêt explicite)
- **Pas** de stockage lors de navigation passive (pan/zoom) pour respecter vie privée et éviter mémorisation accidentelle
- Contrôle utilisateur : bouton 🏠 "Vue France" pour réinitialiser vue manuellement si besoin

**Adaptation Platform :**

- Mobile → contrôles tactiles optimisés (bottom sheet, boutons 44px)
- Desktop → sidebar permanente, hover states
- Première visite → disclaimer affiché
- Visite récurrente → disclaimer discret, expérience directe

**Trade-off Assumé :** Intelligence implicite vs contrôle utilisateur explicite. Nous misons sur l'adaptation automatique intelligente, avec contrôle de réinitialisation discret mais accessible.

---

**Principe 5 : "Pedagogy Through Interaction, Not Documentation"**

Les utilisateurs apprennent en utilisant, pas en lisant un manuel. L'éducation sur les types de zones se fait dans le flux d'usage, pas avant.

**Application Concrète :**

- Termes techniques (RNCFS) expliqués inline via tooltips/modals, pas dans un glossaire séparé à lire d'abord
- Modal "Types de zones" accessible depuis header, consultable à la demande
- Première ligne popup toujours "✅ Chasse interdite" (apprentissage immédiat)
- Icônes distinctives par type (🌲 🦌 🏞️) renforcent compréhension visuelle

**Trade-off Assumé :** Pas de guide complet préalable vs apprentissage progressif contextuel. Nous préférons la pédagogie just-in-time à la documentation exhaustive up-front.

---

**Principe 6 : "Gradual Complexity Reveal" (Progressive Disclosure)**

L'interface révèle progressivement la complexité selon le besoin utilisateur, du plus simple au plus avancé, sans jamais surcharger l'expérience initiale.

**Niveaux de Complexité :**

- **Niveau 1 (Arrivée)** : Carte + zones vertes visibles (ultra-simple, compréhension immédiate)
- **Niveau 2 (Interaction)** : Clic zone → détails structurés (un peu plus d'information)
- **Niveau 3 (Curiosité)** : Bouton ℹ️ "Types de zones" → modal pédagogique (optionnel, pour comprendre mieux)
- **Niveau 4 (Approfondissement)** : Page "Sources de données", méthodologie, roadmap (power users, transparence maximale)

**Application Concrète :**

- Arrivée → zéro interface visible sauf carte + recherche + contrôles essentiels
- Pas de sidebar avec 10 filtres/options dès le départ
- Fonctions avancées futures (ex: filtres par type de zone) → **cachées par défaut** derrière bouton discret "Filtrer les zones"
- Complexité croissante = choix utilisateur, jamais imposée

**Exemple Futur (Post-MVP Filtres) :**

- ❌ **Mauvais** : Sidebar avec checkboxes "RNCFS ☑", "Réserves Naturelles ☑", "Terrains Privés ☑" visible dès l'arrivée
- ✅ **Bon** : Bouton discret "Filtrer" → clic → panneau slide avec options, fermé par défaut

**Trade-off Assumé :** Power users doivent "chercher" les fonctions avancées vs expérience initiale ultralight. Nous priorisons la courbe d'apprentissage douce pour la majorité vs accès immédiat à toutes les fonctions pour experts.

---

<!-- UX design content continues through collaborative workflow steps -->
