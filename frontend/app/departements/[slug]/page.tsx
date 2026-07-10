import {notFound} from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type {Metadata} from 'next';
import {getDepartementsWithZones, getDepartementBySlug, getDepartementBounds} from '@/lib/db/departements';

const Map = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => (
        <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
            </div>
        </div>
    ),
});

type Props = {
    params: {slug: string};
};

export async function generateStaticParams(): Promise<{slug: string}[]> {
    const departements = await getDepartementsWithZones();
    return departements.map((d) => ({slug: d.slug}));
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const dept = await getDepartementBySlug(params.slug);
    if (!dept) return {};

    return {
        title: `Zones sans chasse ${dept.nom} (${dept.code}) - NatureTranquille`,
        description: `Découvrez les ${dept.zonesCount} zones sans chasse identifiées dans le ${dept.nom}. Carte interactive, données officielles, accès gratuit.`,
        openGraph: {
            title: `${dept.nom} - Zones sans chasse`,
            url: `https://naturetranquille.fr/departements/${params.slug}`,
            images: [{url: '/og-image.png'}],
        },
    };
}

export default async function DepartementPage({params}: Props) {
    const [dept, bounds] = await Promise.all([
        getDepartementBySlug(params.slug),
        getDepartementBounds(params.slug.split('-').at(-1) ?? ''),
    ]);

    if (!dept) notFound();

    return (
        <div className="flex h-full flex-col">
            <div className="shrink-0 border-b bg-background px-4 py-3">
                <nav aria-label="Breadcrumb" className="mb-1">
                    <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                        <li>
                            <Link href="/" className="hover:text-foreground">
                                Accueil
                            </Link>
                        </li>
                        <li aria-hidden="true">/</li>
                        <li>
                            <Link href="/departements" className="hover:text-foreground">
                                Départements
                            </Link>
                        </li>
                        <li aria-hidden="true">/</li>
                        <li aria-current="page" className="text-foreground">
                            {dept.nom}
                        </li>
                    </ol>
                </nav>
                <h1 className="text-xl font-bold">
                    Réserves de chasse — {dept.nom} ({dept.code})
                </h1>
            </div>

            <div
                className="flex-1 overflow-hidden"
                role="region"
                aria-label={`Carte des réserves de chasse dans le ${dept.nom}`}
            >
                <Map
                    initialBounds={bounds ?? undefined}
                    highlightDepartement={dept.code}
                />
            </div>
        </div>
    );
}
