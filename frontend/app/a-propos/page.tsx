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
                <h2 className="text-2xl font-semibold mb-3">Qui sommes-nous ?</h2>
                <div className="prose">
                    <p>
                        Ce projet est développé par <strong>Teddy Paul</strong>, développeur web freelance et passionné
                        de nature.
                    </p>
                    <p className="mt-2">Pour me contacter :</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>
                            LinkedIn :{' '}
                            <a
                                href="https://www.linkedin.com/in/teddypaul"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                Teddy Paul
                            </a>
                        </li>
                        <li>
                            Email :{' '}
                            <a href="mailto:hello+nt@teddypaul.fr" className="text-primary hover:underline">
                                hello@teddypaul.fr
                            </a>
                        </li>
                    </ul>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">Contribuer au projet</h2>
                <div className="prose">
                    <p className="mt-2">
                        Que vous souhaitiez signaler un bug, contribuer au code, toutes les contributions sont les
                        bienvenues:
                    </p>
                    <p className="mt-2">
                        <a
                            href="https://github.com/TdyP/NatureTranquille"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            GitHub NatureTranquille
                        </a>
                    </p>
                </div>
            </section>
        </main>
    );
}
