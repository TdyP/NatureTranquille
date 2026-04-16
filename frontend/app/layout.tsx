import type {Metadata} from 'next';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
    title: 'NatureTranquille - Carte des zones sans chasse en France',
    description:
        'Carte interactive gratuite des zones sans chasse en France : réserves naturelles, RNCFS. Trouvez les zones protégées près de chez vous.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="fr">
            <body className="h-screen overflow-hidden font-sans antialiased">
                <div className="flex h-full flex-col">
                    <Header />
                    <main id="main-content" className="flex-1 overflow-hidden">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
