import {MetadataRoute} from 'next';
import {getDepartementsWithZones} from '@/lib/db/departements';

const BASE_URL = 'https://naturetranquille.fr';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/a-propos`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/feedback`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ];

    const departements = await getDepartementsWithZones();

    const deptPages: MetadataRoute.Sitemap = departements.map((d) => ({
        url: `${BASE_URL}/departements/${d.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    return [...staticPages, ...deptPages];
}
