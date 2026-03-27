### Story 4.3: Page `/a-propos` avec mission, mentions légales, contact


**User Story**
En tant que **Mireille (retraitée militante écologie)**, je veux comprendre qui porte ce projet, quelle est sa mission, et comment contacter l'équipe, afin de décider si je peux faire confiance au site et éventuellement contribuer.

**Acceptance Criteria**

**GIVEN** : L'application Next.js est buildée
**WHEN** : L'utilisateur accède à `http://localhost:3000/a-propos`
**THEN** :

- Page statique SSG avec structure suivante :

```tsx
// app/a-propos/page.tsx
export const metadata = {
    title: 'À propos - NatureTranquille',
    description:
        'Mission, contexte et contact de NatureTranquille, projet open source de cartographie des zones sans chasse',
};

export default function AProposPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">À propos de NatureTranquille</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">Notre mission</h2>
                <div className="prose">
                    <p>
                        NatureTranquille est un projet open source visant à cartographier les zones sans chasse en
                        France pour faciliter l'accès à la nature en toute sérénité.
                    </p>
                    <p>
                        Nous croyons que chacun·e devrait pouvoir profiter de la nature sans crainte, que ce soit pour
                        une randonnée, une sortie photo, ou simplement une promenade en forêt.
                    </p>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">Contexte du projet</h2>
                <div className="prose">
                    <p>
                        Ce projet est né du constat que les informations sur les zones sans chasse sont dispersées,
                        difficiles d'accès, et rarement cartographiées de manière accessible au grand public.
                    </p>
                    <p>
                        NatureTranquille agrège des données officielles (RNCFS, Réserves Naturelles, etc.) pour les
                        rendre visibles et utilisables par tous, gratuitement.
                    </p>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">Porteur du projet</h2>
                <p>Projet personnel porté par [Nom/Pseudonyme], développeur·se web et passionné·e de nature.</p>
                <p>
                    Code source disponible sous licence MIT :
                    <a href="https://github.com/user/naturetranquille" className="text-primary hover:underline ml-1">
                        GitHub NatureTranquille
                    </a>
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">Contact</h2>
                <p>Pour signaler une erreur, suggérer une amélioration, ou proposer de nouvelles données :</p>
                <ul className="list-disc list-inside">
                    <li>
                        Email :{' '}
                        <a href="mailto:contact@naturetranquille.fr" className="text-primary hover:underline">
                            contact@naturetranquille.fr
                        </a>
                    </li>
                    <li>
                        Formulaire :{' '}
                        <a href="/feedback" className="text-primary hover:underline">
                            Page Feedback
                        </a>
                    </li>
                    <li>
                        GitHub Issues :{' '}
                        <a
                            href="https://github.com/user/naturetranquille/issues"
                            className="text-primary hover:underline"
                        >
                            Ouvrir un ticket
                        </a>
                    </li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-3">Mentions légales</h2>
                <div className="prose text-sm">
                    <p>
                        <strong>Éditeur</strong> : [Nom/Association]
                    </p>
                    <p>
                        <strong>Hébergement</strong> : [Scalingo France / CleverCloud France] (conformité RGPD UE)
                    </p>
                    <p>
                        <strong>Données personnelles</strong> : Ce site ne collecte aucune donnée personnelle sans
                        consentement. Les emails envoyés via le formulaire de feedback sont stockés uniquement pour
                        traitement.
                    </p>
                    <p>
                        <strong>Cookies</strong> : Ce site utilise uniquement des cookies techniques (localStorage
                        disclaimer, sessionStorage cache recherche). Pas de cookies publicitaires ou tiers.
                    </p>
                    <p>
                        <strong>Licence contenu</strong> : Les données cartographiques sont issues de sources publiques
                        (voir{' '}
                        <a href="/sources" className="text-primary hover:underline">
                            page Sources
                        </a>
                        ). Le code source est sous licence MIT.
                    </p>
                </div>
            </section>
        </main>
    );
}
```

**Accessibility Integration**

- Structure sémantique complète (`<main>`, `<section>`, titres hiérarchiques)
- Liens explicites (texte descriptif, pas "cliquez ici")
- Adresse email avec `mailto:` (ouvre client email)
- Texte classe `prose` avec Tailwind Typography (lisibilité optimisée)
- Contraste AAA pour texte principal (body text ≥ 7:1)

**Performance & Technical Acceptance**

- Page statique SSG (zéro JavaScript nécessaire)
- Lighthouse score ≥ 95 sur tous critères
- Temps chargement < 1s

---

---

