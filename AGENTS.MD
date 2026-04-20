## Wording

- Evite les termes trop techniques pour les utilisateurs finaux ou contributeurs au projet (ex: RNCFS => réserve de chasse)

## Conventions générales

- Tous les commentaires et autre doc doivent être en anglais
- Les noms de variables, fonctions, classes, etc. doivent être en anglais et explicites, évite les abréviations.

## Dépendances

- Pour ajouter des dépendances, lance l'install et laisse npm mettre à jour le package.json et package-lock.json.
- Ne modifie jamais manuellement le package-lock.json.

## Conventions de code

- Code clair > commentaires. Les commentaires doivent être exceptionnels, pour des algos compliqués et impossible à simplifier.

## Typescript

- Utilise des types explicites pour les fonctions, objets, etc. évite les `any`
- Laisse typescript inférer les types le plus possible. Ajoute des annotations quand c'est strictement nécessaire.

## Lancement de l'app

- N'essaye de pas de lancer l'app. Je m'en occupe.

## Commits

- Commits clairs et descriptifs, en anglais, en suivant la conventional commits (feat, fix, docs, etc.)
- Commits uniquement sur demande.
- JAMAIS de push, sauf demande explicite.
