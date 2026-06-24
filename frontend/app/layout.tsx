import type {Metadata} from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import {Toaster} from 'sonner';
import {schemaOrgWebApp} from '@/lib/schema';

export const metadata: Metadata = {
    title: 'NatureTranquille - Carte des zones sans chasse en France',
    description:
        'Carte interactive gratuite des zones sans chasse en France : réserves naturelles, RNCFS. Trouvez les zones protégées près de chez vous pour profiter de la nature en toute sérénité.',
    keywords:
        'zones sans chasse, réserves naturelles, RNCFS, carte chasse France, nature tranquille, randonnée sécurisée',
    openGraph: {
        title: 'NatureTranquille - Zones sans chasse en France',
        description: 'Carte interactive des zones sans chasse',
        url: 'https://naturetranquille.fr',
        siteName: 'NatureTranquille',
        images: [
            {
                url: 'https://naturetranquille.fr/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Carte France avec zones sans chasse',
            },
        ],
        locale: 'fr_FR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'NatureTranquille - Zones sans chasse France',
        description: 'Carte interactive gratuite des zones sans chasse',
        images: ['https://naturetranquille.fr/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
        },
    },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="fr">
            <body className="h-screen overflow-hidden font-sans antialiased">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: JSON.stringify(schemaOrgWebApp)}}
                />
                <div className="flex h-full flex-col">
                    <Header />
                    <main id="main-content" className="flex-1 overflow-hidden">
                        {children}
                    </main>
                </div>
                <Toaster position="bottom-right" richColors aria-live="polite" />
                {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
                    <Script
                        src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? 'https://cloud.umami.is/script.js'}
                        data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
                        strategy="afterInteractive"
                    />
                )}
            </body>
        </html>
    );
}
