# Sprint Change Proposal - Correct Course

Date: 2026-03-27
Trigger Story: Epic 0 / Story 0.2 (import script)
Scope Classification: Moderate

## 1) Issue Summary

Le besoin technique identifie est de separer strictement les responsabilites entre:

- la structure de base de donnees (schema, index, migrations),
- l'ingestion de donnees (import script).

Problemes constates:

- La story d'import imposait des operations de structure (creation table/index), ce qui melangeait les responsabilites.
- Le contexte d'import etait hardcode sur des sources/territoires specifiques.
- Le nom de table `zones_sans_chasse` devait etre renomme en `zones` pour alignement technique.

## 2) Impact Analysis

### Epic Impact

- Epic 0 impacte directement:
    - ajout d'une story prealable pour migrations backend,
    - refonte de la story 0.2 pour import generique data-only.
- Epics dependants impactes indirectement:
    - stories avec snippets SQL pointant vers l'ancienne table.

### Story Impact

- Nouvelle story creee: Story 0.1b (migrations backend).
- Story 0.2 modifiee:
    - suppression des hardcodes source/territoire,
    - interdiction explicite des operations DDL dans le script.
- Stories SQL alignees sur `zones`:
    - Story 3.3
    - Story 5.4
    - Story 6.1
    - Story 6.3
- Epic summary mis a jour (5 stories sur Epic 0).

### Artifact Conflicts

- Epics document: sections Epic 0 + snippets SQL techniques.
- Architecture docs: schema et diagrammes utilisant l'ancien nom de table.
- Init DB script: commentaire indiquant a tort que l'import cree la structure.

### Technical Impact

- Clarification architecture:
    - backend migrations = owner du schema,
    - import script = owner de l'ecriture de donnees uniquement.
- Harmonisation SQL globale sur `zones`.
- Reduction du risque de regressions structurelles dans les scripts ETL.

## 3) Recommended Approach

Approche retenue: Direct Adjustment (Option 1)

Rationale:

- Changement localise et coherent avec les bonnes pratiques (separation schema/data).
- Pas de rollback necessaire.
- Pas de reduction MVP necessaire.

Estimate:

- Effort: Medium
- Risk: Low to Medium
- Timeline impact: faible (documentation/stories + alignement snippets)

## 4) Detailed Change Proposals

### Stories

1. Story 0.2 - Import

- OLD: import specifique a des sources/territoires et creation structure/index par le script.
- NEW: import generique, parametre, data-only, sans DDL, ecriture dans `zones`.
- Rationale: script robuste, reutilisable, non couple au schema.

2. New Story 0.1b - Backend migrations

- OLD: pas de story dediee a la gestion de schema avant import.
- NEW: story explicite pour creation table/index via migrations backend.
- Rationale: ordre d'execution clair et gouvernance structurelle cote backend.

### Architecture / Documentation

1. Table rename

- OLD: `zones_sans_chasse`
- NEW: `zones`
- Rationale: nom plus court, coherent, applique partout dans les snippets techniques.

2. Init DB contract

- OLD: commentaire indiquant que l'import cree la structure.
- NEW: commentaire explicitant que la structure est geree par migrations backend.
- Rationale: eviter la confusion operationnelle.

## 5) Implementation Handoff

Recommended recipients:

- Dev team: implementation stories 0.1b et 0.2
- PO/SM: priorisation et sequencing backlog Epic 0

Responsibilities:

- Dev team:
    - implementer migrations backend de schema `zones`,
    - implementer script import data-only, parametre, sans hardcode.
- PO/SM:
    - ordonnancer Story 0.1b avant Story 0.2,
    - verifier alignement des dependances stories Epic 0.

Success criteria:

- Aucune operation DDL executee par le script d'import.
- Toutes les references techniques utilisent `zones`.
- Story 0.1b executee avant Story 0.2.
- Script d'import capable d'ingerer tout jeu de donnees demande sans hardcode source/territoire.

## Checklist Status Snapshot

-   1. Trigger and context: [x] Done
-   2. Epic impact: [x] Done
-   3. Artifact conflict analysis: [x] Done
-   4. Path forward evaluation: [x] Done (Option 1)
-   5. Proposal components: [x] Done
-   6. Final review and handoff: [!] Action-needed (validation finale PO/SM)
