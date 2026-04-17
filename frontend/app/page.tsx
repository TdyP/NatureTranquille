'use client';

import {useRef} from 'react';
import dynamic from 'next/dynamic';
import SearchBar, {AddressSearchResult} from '@/components/SearchBar';
import {MapHandle} from '@/components/Map';

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

export default function Home() {
    const mapRef = useRef<MapHandle>(null);

    const handleLocationSelect = (result: AddressSearchResult) => {
        if (!mapRef.current) return;

        const [lng, lat] = result.geometry.coordinates;

        // If bbox is available, use fitBounds for better viewport
        if (result.bbox) {
            mapRef.current.fitBounds(result.bbox as [number, number, number, number], 50);
        } else {
            // Otherwise, fly to the point with zoom 12
            mapRef.current.flyToLocation(lng, lat, 12);
        }
    };

    return (
        <main className="relative h-full">
            {/* Search bar overlay */}
            <div className="absolute left-1/2 top-4 z-10 w-full max-w-md -translate-x-1/2 px-4 sm:px-0">
                <SearchBar onSelectLocation={handleLocationSelect} className="shadow-lg" />
            </div>

            <Map ref={mapRef} />
        </main>
    );
}

