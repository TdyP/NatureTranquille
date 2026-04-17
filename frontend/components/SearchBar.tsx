'use client';

import {useState, useEffect, useCallback, useRef} from 'react';
import {Search, X, Loader2} from 'lucide-react';
import {Command, CommandInput, CommandList, CommandItem, CommandEmpty} from '@/components/ui/command';
import {Button} from '@/components/ui/button';

/**
 * Result from API Adresse data.gouv.fr
 */
export interface AddressSearchResult {
    type: 'Feature';
    geometry: {
        type: 'Point';
        coordinates: [number, number]; // [lng, lat]
    };
    properties: {
        label: string; // "Strasbourg, Bas-Rhin (67000)"
        name: string; // "Strasbourg"
        postcode?: string; // "67000"
        city?: string;
        context?: string; // "67, Bas-Rhin, Grand Est"
        id: string;
    };
    bbox?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
}

export interface SearchBarProps {
    /**
     * Callback when user selects a location
     */
    onSelectLocation?: (result: AddressSearchResult) => void;
    /**
     * Additional CSS classes
     */
    className?: string;
    /**
     * Placeholder text
     */
    placeholder?: string;
}

const API_BASE_URL = 'https://api-adresse.data.gouv.fr';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 3;

/**
 * Geographic search bar with autocomplete
 * Uses API Adresse data.gouv.fr for geocoding
 * Implements debouncing, caching, and error handling
 */
export default function SearchBar({
    onSelectLocation,
    className = '',
    placeholder = 'Rechercher une ville, code postal, département...',
}: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<AddressSearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const abortController = useRef<AbortController | null>(null);
    const liveRegionRef = useRef<HTMLDivElement>(null);

    /**
     * Get cached results from sessionStorage
     */
    const getCachedResults = useCallback((searchQuery: string): AddressSearchResult[] | null => {
        try {
            const cacheKey = `search:${searchQuery}`;
            const cached = sessionStorage.getItem(cacheKey);
            if (!cached) return null;

            const {data, timestamp} = JSON.parse(cached);
            const isExpired = Date.now() - timestamp > CACHE_DURATION;

            if (isExpired) {
                sessionStorage.removeItem(cacheKey);
                return null;
            }

            return data;
        } catch {
            return null;
        }
    }, []);

    /**
     * Cache results in sessionStorage
     */
    const cacheResults = useCallback((searchQuery: string, results: AddressSearchResult[]) => {
        try {
            const cacheKey = `search:${searchQuery}`;
            sessionStorage.setItem(
                cacheKey,
                JSON.stringify({
                    data: results,
                    timestamp: Date.now(),
                })
            );
        } catch (error) {
            // Ignore quota exceeded errors
            console.warn('Failed to cache search results:', error);
        }
    }, []);

    /**
     * Fetch address suggestions from API
     */
    const fetchSuggestions = useCallback(
        async (searchQuery: string) => {
            // Check cache first
            const cached = getCachedResults(searchQuery);
            if (cached) {
                setSuggestions(cached);
                setIsLoading(false);
                setError(null);
                announceResults(cached.length);
                return;
            }

            // Abort previous request
            if (abortController.current) {
                abortController.current.abort();
            }

            abortController.current = new AbortController();

            try {
                const response = await fetch(`${API_BASE_URL}/search/?q=${encodeURIComponent(searchQuery)}&limit=5`, {
                    signal: abortController.current.signal,
                });

                if (!response.ok) {
                    throw new Error('API request failed');
                }

                const data = await response.json();
                const results = data.features || [];

                setSuggestions(results);
                setError(null);
                cacheResults(searchQuery, results);
                announceResults(results.length);
            } catch (err) {
                if (err instanceof Error && err.name === 'AbortError') {
                    return; // Ignore aborted requests
                }

                setError('Recherche temporairement indisponible, réessayez');
                setSuggestions([]);
                announceError();
            } finally {
                setIsLoading(false);
            }
        },
        [getCachedResults, cacheResults]
    );

    /**
     * Announce results to screen readers
     */
    const announceResults = useCallback((count: number) => {
        if (liveRegionRef.current) {
            if (count === 0) {
                liveRegionRef.current.textContent = 'Aucun résultat trouvé';
            } else {
                liveRegionRef.current.textContent = `${count} suggestion${count > 1 ? 's' : ''} disponible${
                    count > 1 ? 's' : ''
                }`;
            }
        }
    }, []);

    /**
     * Announce error to screen readers
     */
    const announceError = useCallback(() => {
        if (liveRegionRef.current) {
            liveRegionRef.current.textContent = 'Erreur de recherche';
        }
    }, []);

    /**
     * Handle input change with debouncing
     */
    useEffect(() => {
        if (query.length < MIN_QUERY_LENGTH) {
            setSuggestions([]);
            setError(null);
            setIsLoading(false);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        setIsOpen(true);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            fetchSuggestions(query);
        }, DEBOUNCE_MS);

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [query, fetchSuggestions]);

    /**
     * Handle location selection
     */
    const handleSelect = useCallback(
        (result: AddressSearchResult) => {
            setQuery('');
            setSuggestions([]);
            setIsOpen(false);
            onSelectLocation?.(result);

            if (liveRegionRef.current) {
                liveRegionRef.current.textContent = `Carte zoomée sur ${result.properties.label}`;
            }
        },
        [onSelectLocation]
    );

    /**
     * Clear search
     */
    const handleClear = useCallback(() => {
        setQuery('');
        setSuggestions([]);
        setError(null);
        setIsOpen(false);

        if (liveRegionRef.current) {
            liveRegionRef.current.textContent = 'Recherche réinitialisée';
        }
    }, []);

    return (
        <div className={`relative ${className}`}>
            <Command
                className="overflow-visible rounded-md border bg-background shadow-sm"
                shouldFilter={false}
                label="Rechercher un lieu"
            >
                <div className="relative bg-background">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <CommandInput
                        value={query}
                        onValueChange={setQuery}
                        placeholder={placeholder}
                        className="h-10 pl-9 pr-9 bg-background"
                        aria-busy={isLoading}
                        aria-invalid={!!error}
                        aria-describedby={error ? 'search-error' : undefined}
                    />
                    {query && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
                            onClick={handleClear}
                            aria-label="Effacer la recherche"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                    {isLoading && !query && (
                        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                    )}
                </div>

                {isOpen && (
                    <CommandList className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
                        {isLoading && (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span className="text-sm text-muted-foreground">Recherche en cours...</span>
                            </div>
                        )}

                        {!isLoading && error && (
                            <div className="p-4 text-center">
                                <p id="search-error" className="text-sm text-destructive" role="alert">
                                    {error}
                                </p>
                            </div>
                        )}

                        {!isLoading && !error && suggestions.length === 0 && query.length >= MIN_QUERY_LENGTH && (
                            <CommandEmpty>Aucun résultat trouvé pour &quot;{query}&quot;</CommandEmpty>
                        )}

                        {!isLoading && !error && suggestions.length > 0 && (
                            <>
                                {suggestions.map((result) => (
                                    <CommandItem
                                        key={result.properties.id}
                                        value={result.properties.label}
                                        onSelect={() => handleSelect(result)}
                                        className="cursor-pointer"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-medium">{result.properties.name}</span>
                                            {result.properties.context && (
                                                <span className="text-xs text-muted-foreground">
                                                    {result.properties.context}
                                                </span>
                                            )}
                                        </div>
                                    </CommandItem>
                                ))}
                            </>
                        )}
                    </CommandList>
                )}
            </Command>

            {/* ARIA live region for screen reader announcements */}
            <div ref={liveRegionRef} className="sr-only" aria-live="polite" aria-atomic="true" />
        </div>
    );
}
