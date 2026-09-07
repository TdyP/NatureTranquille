import {notFound} from 'next/navigation';
import dynamicImport from 'next/dynamic';
import Link from 'next/link';
import type {Metadata} from 'next';
import {
    getDepartementsWithZones,
    getDepartementBySlug,
    getDepartementBounds,
    getZonesByDepartement,
} from '@/lib/db/departements';
import {schemaOrgBreadcrumb} from '@/lib/schema';

const Map = dynamicImport(() => import('@/components/Map'), {
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

// Disable static generation - pages will be generated at request time
export const dynamic = 'force-dynamic';

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

    const breadcrumbLd = schemaOrgBreadcrumb([
        {name: 'Accueil', url: 'https://naturetranquille.fr'},
        {name: 'Départements', url: 'https://naturetranquille.fr/departements'},
        {name: dept.nom, url: `https://naturetranquille.fr/departements/${params.slug}`},
    ]);

    return (
        <div className="flex h-full flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumbLd)}}
            />
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

            {/* SSR content visible to crawlers without JavaScript */}
            <section className="sr-only">
                <p>
                    Le {dept.nom} ({dept.code}) compte {dept.zonesCount} zones sans chasse référencées sur
                    NatureTranquille.
                </p>
                {zones.length > 0 && (
                    <ul>
                        {zones.map((zone) => (
                            <li key={zone.id}>
                                {zone.nom ?? `Zone ${zone.id}`}
                                {zone.typeProtection ? ` — ${zone.typeProtection}` : ''}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

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
