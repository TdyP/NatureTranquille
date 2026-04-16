const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['maplibre-gl'],

    // Performance optimizations
    poweredByHeader: false,
    compress: true,

    // Image optimization
    images: {
        formats: ['image/webp', 'image/avif'],
    },

    // Experimental optimizations
    experimental: {
        optimizePackageImports: ['lucide-react'],
    },

    // Headers for caching
    async headers() {
        return [
            {
                source: '/tiles/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=86400, s-maxage=86400',
                    },
                ],
            },
        ];
    },
};

module.exports = withBundleAnalyzer(nextConfig);
