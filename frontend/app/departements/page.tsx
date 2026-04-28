import Link from 'next/link';
import {getDepartementsWithZones} from '@/lib/db/departements';

export const metadata = {
    title: 'Départements - NatureTranquille',
    description: 'Liste des départements avec des réserves de chasse référencées sur NatureTranquille.',
};

export default async function DepartementsPage() {
    const departements = await getDepartementsWithZones();

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                    <li>
                        <Link href="/" className="hover:text-foreground">
                            Accueil
                        </Link>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li aria-current="page" className="text-foreground">
                        Départements
                    </li>
                </ol>
            </nav>

            <h1 className="mb-6 text-3xl font-bold">Réserves de chasse par département</h1>

            <p className="mb-8 text-muted-foreground">
                {departements.length} département(s) avec des réserves de chasse référencées.
            </p>

            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {departements.map((dept) => (
                    <li key={dept.code}>
                        <Link
                            href={`/departements/${dept.slug}`}
                            className="block rounded-lg border p-4 hover:bg-accent transition-colors"
                        >
                            <span className="font-medium">{dept.nom}</span>
                            <span className="ml-2 text-sm text-muted-foreground">({dept.code})</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
