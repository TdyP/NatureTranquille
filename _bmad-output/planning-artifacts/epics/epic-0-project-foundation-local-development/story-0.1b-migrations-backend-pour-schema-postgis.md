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

---
