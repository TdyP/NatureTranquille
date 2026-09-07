import Link from 'next/link';
import MapClient from './MapClient';

export default function Home() {
    return (
        <div className="relative h-full overflow-hidden">
            {/* SSR content visible to crawlers without JavaScript */}
            <div className="sr-only">
                <h1>Carte des zones sans chasse en France</h1>
                <p>
                    NatureTranquille est une carte interactive gratuite des réserves de chasse et zones naturelles
                    protégées en France. Trouvez les zones sans chasse près de chez vous pour randonner, vous
                    promener ou photographier la nature en toute sérénité.
                </p>
                <p>
                    Parcourez les réserves de chasse{' '}
                    <Link href="/departements">par département</Link>, ou{' '}
                    <Link href="/a-propos">en savoir plus</Link> sur le projet.
                </p>
            </div>

            <MapClient />
        </div>
    );
}
