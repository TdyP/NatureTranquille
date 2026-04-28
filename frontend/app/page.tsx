'use client';

import {useRef, useCallback} from 'react';
import dynamic from 'next/dynamic';
import SearchBar, {AddressSearchResult} from '@/components/SearchBar';
import {MapHandle} from '@/components/Map';
import DisclaimerModal from '@/components/DisclaimerModal';

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
    const mapHandleRef = useRef<MapHandle | null>(null);

    const handleMapReady = useCallback((handle: MapHandle) => {
        console.log('Map is ready!');
        mapHandleRef.current = handle;
    }, []);

    const handleLocationSelect = useCallback((result: AddressSearchResult) => {
        console.log('Location selected:', result.properties.label);
        console.log('Map handle:', mapHandleRef.current);

        if (!mapHandleRef.current) {
            console.error('Map not ready yet!');
            return;
        }

        const [lng, lat] = result.geometry.coordinates;

        // If bbox is available, use fitBounds for better viewport
        if (result.bbox) {
            console.log('Using fitBounds with bbox:', result.bbox);
            mapHandleRef.current.fitBounds(result.bbox as [number, number, number, number], 50);
        } else {
            // Otherwise, fly to the point with zoom 12
            console.log('Using flyToLocation:', lng, lat);
            mapHandleRef.current.flyToLocation(lng, lat, 12);
        }
    }, []);

    return (
        <div className="relative h-full overflow-hidden">
            <DisclaimerModal />

            {/* Search bar overlay */}
            <div className="absolute left-1/2 top-4 z-10 w-full max-w-md -translate-x-1/2 px-4 sm:px-0">
                <SearchBar onSelectLocation={handleLocationSelect} className="shadow-lg" />
            </div>

            <Map onMapReady={handleMapReady} />
        </div>
    );
}
