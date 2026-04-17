'use client';

import {useEffect, useRef, useState, useImperativeHandle, forwardRef} from 'react';
import maplibregl, {Map as MapLibreMap, MapLayerMouseEvent, LngLatBoundsLike} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import MapLegend from './MapLegend';
import ZoneDetails, {ZoneProperties} from './ZoneDetails';

export interface MapProps {
    /**
     * Map container class name
     */
    className?: string;
    /**
     * Initial center coordinates [lng, lat]
     */
    center?: [number, number];
    /**
     * Initial zoom level
     */
    zoom?: number;
    /**
     * MapLibre style URL
     */
    styleUrl?: string;
    /**
     * MVT tiles base URL
     */
    tilesUrl?: string;
    /**
     * Callback when map is ready
     */
    onMapReady?: (handle: MapHandle) => void;
}

export interface MapHandle {
    /**
     * Fly to a specific location with animation
     */
    flyToLocation: (lng: number, lat: number, zoom?: number) => void;
    /**
     * Fit map to bounds with animation
     */
    fitBounds: (bounds: LngLatBoundsLike, padding?: number) => void;
}

/**
 * Interactive map component using MapLibre GL JS
 * Displays a base OSM map with vector tiles of zones sans chasse
 */
const Map = forwardRef<MapHandle, MapProps>(function Map(
    {
        className = 'h-full w-full',
        center = [2.2137, 46.2276], // France center
        zoom = 6,
        styleUrl = process.env.NEXT_PUBLIC_MAPLIBRE_STYLE || 'https://tiles.openfreemap.org/styles/liberty',
        tilesUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
        onMapReady,
    },
    ref
) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<MapLibreMap | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedZone, setSelectedZone] = useState<ZoneProperties | null>(null);

    // Create map handle
    const mapHandle: MapHandle = {
        flyToLocation: (lng: number, lat: number, zoom = 12) => {
            if (!map.current) {
                console.warn('Map not yet initialized');
                return;
            }

            // Check for prefers-reduced-motion
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            map.current.flyTo({
                center: [lng, lat],
                zoom: zoom,
                duration: prefersReducedMotion ? 0 : 1000,
            });
        },
        fitBounds: (bounds: LngLatBoundsLike, padding = 50) => {
            if (!map.current) {
                console.warn('Map not yet initialized');
                return;
            }

            // Check for prefers-reduced-motion
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            map.current.fitBounds(bounds, {
                padding: padding,
                maxZoom: 12,
                duration: prefersReducedMotion ? 0 : 1000,
            });
        },
    };

    // Expose methods to parent component via ref
    useImperativeHandle(ref, () => mapHandle, []);

    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        // Initialize map
        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: styleUrl,
            center: center,
            zoom: zoom,
            attributionControl: true,
        });

        // Add navigation controls
        map.current.addControl(
            new maplibregl.NavigationControl({
                showCompass: true,
                showZoom: true,
            }),
            'top-right',
        );

        // Add geolocate control
        map.current.addControl(
            new maplibregl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                trackUserLocation: true,
            }),
            'top-right',
        );

        // Add zones layer when map loads
        map.current.on('load', () => {
            if (!map.current) return;

            // Add MVT source
            map.current.addSource('zones-sans-chasse', {
                type: 'vector',
                tiles: [`${tilesUrl}/tiles/{z}/{x}/{y}.mvt`],
                minzoom: 0,
                maxzoom: 18,
            });

            // Add fill layer with hover state
            map.current.addLayer({
                id: 'zones-fill',
                type: 'fill',
                source: 'zones-sans-chasse',
                'source-layer': 'zones',
                paint: {
                    'fill-color': '#10b981',
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        0.8,
                        ['boolean', ['feature-state', 'selected'], false],
                        1,
                        0.6,
                    ],
                },
            });

            // Add stroke layer with selected state
            map.current.addLayer({
                id: 'zones-stroke',
                type: 'line',
                source: 'zones-sans-chasse',
                'source-layer': 'zones',
                paint: {
                    'line-color': [
                        'case',
                        ['boolean', ['feature-state', 'selected'], false],
                        '#047857',
                        '#059669',
                    ],
                    'line-width': ['case', ['boolean', ['feature-state', 'selected'], false], 3, 2],
                },
            });

            // Add labels layer for high zoom levels
            map.current.addLayer({
                id: 'zones-label',
                type: 'symbol',
                source: 'zones-sans-chasse',
                'source-layer': 'zones',
                minzoom: 14,
                layout: {
                    'text-field': ['get', 'nom'],
                    'text-size': 14,
                    'text-anchor': 'center',
                },
                paint: {
                    'text-color': '#065f46', // green-900
                    'text-halo-color': '#ffffff',
                    'text-halo-width': 2,
                },
            });

            // Change cursor on hover
            map.current.on('mouseenter', 'zones-fill', () => {
                if (map.current) {
                    map.current.getCanvas().style.cursor = 'pointer';
                }
            });

            map.current.on('mouseleave', 'zones-fill', () => {
                if (map.current) {
                    map.current.getCanvas().style.cursor = '';
                }
            });

            // Handle hover state
            let hoveredStateId: number | null = null;
            map.current.on('mousemove', 'zones-fill', (e: MapLayerMouseEvent) => {
                if (!map.current) return;
                if (e.features && e.features.length > 0) {
                    if (hoveredStateId !== null) {
                        map.current.setFeatureState({source: 'zones-sans-chasse', sourceLayer: 'zones', id: hoveredStateId}, {hover: false});
                    }
                    hoveredStateId = e.features[0].id as number;
                    map.current.setFeatureState({source: 'zones-sans-chasse', sourceLayer: 'zones', id: hoveredStateId}, {hover: true});
                }
            });

            map.current.on('mouseleave', 'zones-fill', () => {
                if (!map.current || hoveredStateId === null) return;
                map.current.setFeatureState({source: 'zones-sans-chasse', sourceLayer: 'zones', id: hoveredStateId}, {hover: false});
                hoveredStateId = null;
            });

            // Handle click/selection
            map.current.on('click', 'zones-fill', (e: MapLayerMouseEvent) => {
                if (!map.current || !e.features || e.features.length === 0) return;

                const clickedFeature = e.features[0];
                const clickedId = clickedFeature.id as number;
                const properties = clickedFeature.properties as ZoneProperties;

                // Clear previous selection
                if (selectedZone !== null) {
                    map.current.setFeatureState({source: 'zones-sans-chasse', sourceLayer: 'zones', id: selectedZone.id}, {selected: false});
                }

                // Set new selection
                if (selectedZone?.id !== clickedId) {
                    map.current.setFeatureState({source: 'zones-sans-chasse', sourceLayer: 'zones', id: clickedId}, {selected: true});
                    setSelectedZone({...properties, id: clickedId});
                } else {
                    setSelectedZone(null);
                }
            });

            setIsLoading(false);

            // Notify parent that map is ready
            onMapReady?.(mapHandle);
        });

        // Cleanup on unmount
        return () => {
            map.current?.remove();
            map.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [center, zoom, styleUrl, tilesUrl]);

    // Handle zone details close
    const handleCloseZoneDetails = () => {
        if (!map.current || !selectedZone) return;

        // Clear selection state
        map.current.setFeatureState({source: 'zones-sans-chasse', sourceLayer: 'zones', id: selectedZone.id}, {selected: false});
        setSelectedZone(null);
    };

    return (
        <div className="relative h-full w-full">
            {isLoading && (
                <div
                    className="absolute inset-0 z-10 flex items-center justify-center bg-background/80"
                    role="status"
                    aria-live="polite"
                >
                    <div className="text-center">
                        <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        <p className="text-sm text-muted-foreground">Chargement de la carte...</p>
                    </div>
                </div>
            )}
            <div
                ref={mapContainer}
                className={className}
                role="application"
                aria-label="Carte interactive des zones sans chasse en France"
                tabIndex={0}
            />
            <MapLegend />
            <ZoneDetails zone={selectedZone} onClose={handleCloseZoneDetails} />
        </div>
    );
});

export default Map;

