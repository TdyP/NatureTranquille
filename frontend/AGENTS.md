## Conventions générales

- Sépare la logique et la vue des composants.
- La logique doit être gérée dans des hooks, des reducers ou des fonctions utils.
- Respecte les règles de .npmrc

## Stratégie de test

- Test unitairement tous les fichiers contenant de la logique.
- Les fichiers boilerplate peuvent être exempté de tests.
- Ajoute des tests d'intégration pour les features (exemple: modal affichée au clique sur une zone, etc.)
