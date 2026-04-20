import type {Metadata} from 'next';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import sources from '@/data/sources.json';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'Sources de données - NatureTranquille',
    description:
        'Liste complète des sources officielles de réserves de chasse intégrées dans NatureTranquille',
};

type Source = {
    id: string;
    nom: string;
    type: string;
    couverture: string;
    licence: string;
    date_maj: string;
    url: string;
};

export default function SourcesPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Sources de données</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-3">Données intégrées</h2>
                <div className="space-y-4">
                    {(sources as Source[]).map((source) => (
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
                                                className="text-primary hover:underline break-all"
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
                <p className="mt-2">Prochains départements : Haute-Savoie (74), Isère (38) — prévu Q2 2026</p>
            </section>
        </main>
    );
}
