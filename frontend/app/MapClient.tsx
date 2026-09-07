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
            <div className="flex flex-col items-center gap-2 text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
            </div>
        </div>
    ),
});

export default function MapClient() {
    const mapHandleRef = useRef<MapHandle | null>(null);

    const handleMapReady = useCallback((handle: MapHandle) => {
        mapHandleRef.current = handle;
    }, []);

    const handleLocationSelect = useCallback((result: AddressSearchResult) => {
        if (!mapHandleRef.current) {
            return;
        }

        const [lng, lat] = result.geometry.coordinates;

        if (result.bbox) {
            mapHandleRef.current.fitBounds(result.bbox as [number, number, number, number], 50);
        } else {
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
