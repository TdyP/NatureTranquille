### Story 4.2: Page `/sources` statique SSG avec liste sources et méthodologie


**User Story**
En tant que **Marie (photographe nature professionnelle)**, je veux consulter la liste complète des sources de données intégrées avec leur licence et date de mise à jour, afin de valider la fiabilité des informations avant de planifier mes sorties.

**Acceptance Criteria**

**GIVEN** : L'application Next.js est buildée
**WHEN** : L'utilisateur accède à `http://localhost:3000/sources`
**THEN** :

- Page statique générée avec SSG (`export const dynamic = 'force-static'`)
- Structure page :

```tsx
// app/sources/page.tsx
export const metadata = {
    title: 'Sources de données - NatureTranquille',
    description: 'Liste complète des sources officielles de zones sans chasse intégrées dans NatureTranquille',
};

export default function SourcesPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Sources de données</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">Données intégrées</h2>
                <div className="space-y-4">
                    {sources.map((source) => (
                        <Card key={source.id}>
                            <CardHeader>
                                <CardTitle>{source.nom}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <dl className="space-y-2">
                                    <div>
                                        <dt className="text-sm font-medium">Type</dt>
                                        <dd>{source.type}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium">Couverture géographique</dt>
                                        <dd>{source.couverture}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium">Licence</dt>
                                        <dd>{source.licence}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium">Date dernière mise à jour</dt>
                                        <dd>{source.date_maj}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium">Source officielle</dt>
                                        <dd>
                                            <a
                                                href={source.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary hover:underline"
                                            >
                                                {source.url}
                                            </a>
                                        </dd>
                                    </div>
                                </dl>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">Méthodologie de validation</h2>
                <div className="prose">
                    <p>Chaque zone intégrée suit un processus de validation rigoureux :</p>
                    <ol>
                        <li>Vérification source officielle (arrêté préfectoral, décret, gestionnaire confirmé)</li>
                        <li>Validation géométrie (cohérence, pas de trous, projection correcte)</li>
                        <li>Croisement avec cadastre si disponible</li>
                        <li>Métadonnées complètes (nom, gestionnaire, date)</li>
                    </ol>
                    <p>
                        Les zones partielles ou non confirmées sont <strong>exclues</strong> par précaution.
                    </p>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-3">Roadmap couverture</h2>
                <p>Départements actuellement couverts : Bas-Rhin (67), Haut-Rhin (68), Moselle (57), Savoie (73)</p>
                <p>Prochains départements : Haute-Savoie (74), Isère (38) — prévu Q2 2026</p>
            </section>
        </main>
    );
}
```

**AND** : Données sources dans `/data/sources.json` :

```json
[
    {
        "id": "rncfs-grand-est",
        "nom": "RNCFS Grand Est",
        "type": "Réserve Nationale de Chasse et Faune Sauvage",
        "couverture": "Bas-Rhin, Haut-Rhin, Moselle",
        "licence": "Licence Ouverte / Etalab 2.0",
        "date_maj": "2026-01-15",
        "url": "https://www.ofb.gouv.fr/le-reseau-des-reserves"
    },
    {
        "id": "reserves-savoie",
        "nom": "Réserves Naturelles de Savoie",
        "type": "Réserves Naturelles Régionales et Nationales",
        "couverture": "Savoie (73)",
        "licence": "Données publiques",
        "date_maj": "2026-02-01",
        "url": "https://www.savoie.fr/environnement/reserves-naturelles"
    }
]
```

**Accessibility Integration**

- Structure HTML sémantique (`<main>`, `<section>`, `<h1>`-`<h3>`)
- Hiérarchie titres logique (H1 page → H2 sections → H3 si nécessaire)
- Listes `<dl>` pour métadonnées (definition list sémantique)
- Liens externes avec `rel="noopener noreferrer"` (sécurité)
- Texte contrasté WCAG AA (vérification axe DevTools)

**Performance & Technical Acceptance**

- Page statique SSG (build time)
- Pas de JavaScript hydration nécessaire (100% static)
- Lighthouse score ≥ 95 (Performance, Accessibility, SEO)
- JSON sources < 5KB (peu de sources au MVP)

---

