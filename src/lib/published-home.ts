import { fetchPublicHome } from './public-content';
import { API_BASE } from './api-base';

/** Reads the published CMS homepage from the API (in the browser; the site is a static export). */
export function getPublishedHome() {
  return fetchPublicHome(API_BASE);
}
