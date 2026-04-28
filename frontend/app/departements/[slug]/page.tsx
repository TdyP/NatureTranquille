import {notFound} from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type {Metadata} from 'next';
import {getDepartementsWithZones, getDepartementBySlug, getDepartementBounds, getZonesByDepartement} from '@/lib/db/departements';

const Map = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => (
        <div className="flex h-full items-center justify-center">
            <div className="text-center">
                <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
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

    const zones = await getZonesByDepartement(dept.code);

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <nav aria-label="Breadcrumb" className="mb-6">
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

            <h1 className="mb-4 text-3xl font-bold">
                Zones sans chasse dans le {dept.nom} ({dept.code})
            </h1>

            <p className="mb-6 text-muted-foreground">
                {zones.length} zone(s) sans chasse identifiée(s) dans le département {dept.nom}.
            </p>

            <div
                className="mb-8 h-[450px] overflow-hidden rounded-lg border"
                role="region"
                aria-label={`Carte des zones sans chasse dans le ${dept.nom}`}
            >
                <Map
                    initialBounds={bounds ?? undefined}
                    highlightDepartement={dept.code}
                />
            </div>

            <section className="mt-8">
                <h2 className="mb-3 text-2xl font-semibold">Zones identifiées</h2>
                <ul className="space-y-2">
                    {zones.map((zone) => (
                        <li key={zone.id} className="rounded-md border p-3">
                            <strong>{zone.nom ?? 'Zone sans nom'}</strong>
                            {zone.typeProtection && (
                                <span className="ml-2 text-sm text-muted-foreground">
                                    — {zone.typeProtection}
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
