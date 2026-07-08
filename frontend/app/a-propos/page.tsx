import type {Metadata} from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'À propos - NatureTranquille',
    description:
        'Mission, contexte et contact de NatureTranquille, projet open source de cartographie des réserves de chasse',
};

export default function AProposPage() {
    return (
        <main className="container mx-auto h-full overflow-y-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">À propos de NatureTranquille</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">Notre mission</h2>
                <div className="prose">
                    <p>
                        NatureTranquille est un projet open source visant à cartographier les réserves de chasse en
                        France pour faciliter l&apos;accès à la nature en toute sérénité.
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
                        Ce projet est né du constat que les informations sur les réserves de chasse sont dispersées,
                        difficiles d&apos;accès, et rarement cartographiées de manière accessible au grand public.
                    </p>
                    <p>
                        NatureTranquille agrège des données officielles (RNCFS, Réserves Naturelles, etc.) pour les
                        rendre visibles et utilisables par tous, gratuitement.
                    </p>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">Porteur du projet</h2>
                <p>Projet personnel porté par un·e développeur·se web passionné·e de nature.</p>
                <p className="mt-2">
                    Code source disponible sous licence MIT :{' '}
                    <a
                        href="https://github.com/TdyP/naturetranquille"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        GitHub NatureTranquille
                    </a>
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">Contact</h2>
                <p>Pour signaler une erreur, suggérer une amélioration, ou proposer de nouvelles données :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
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
                            href="https://github.com/TdyP/naturetranquille/issues"
                            target="_blank"
                            rel="noopener noreferrer"
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
                        <strong>Éditeur</strong> : Projet open source individuel
                    </p>
                    <p>
                        <strong>Hébergement</strong> : France (conformité RGPD UE)
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
                        <strong>Licence contenu</strong> : Les données cartographiques sont issues de sources publiques.
                        Le code source est sous licence MIT.
                    </p>
                </div>
            </section>
        </main>
    );
}
