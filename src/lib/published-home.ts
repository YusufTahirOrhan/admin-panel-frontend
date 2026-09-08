import { cache } from 'react';
import { fetchPublicHome } from './public-content';

// Share one CMS read between the layout's theme and the page's content.
export const getPublishedHome = cache(() => fetchPublicHome(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'));
