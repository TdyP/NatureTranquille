import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'NatureTranquille - Carte des zones sans chasse en France',
    description:
        'Carte interactive gratuite des zones sans chasse en France : réserves naturelles, RNCFS. Trouvez les zones protégées près de chez vous.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="fr">
            <body className="font-sans antialiased">{children}</body>
        </html>
    );
}
