# CMS default theme

Site editor > Hero > Varsayılan site teması controls the published storefront default. It uses the existing block content JSON and draft/publish API; no backend migration or API change is required. Only the first enabled published hero applies. A missing, disabled or invalid setting falls back to system preference. Explicit visitor light/dark/system cookie preferences override the CMS default.

The layout and page share a request-scoped React cache entry to avoid reading the CMS twice. The theme is applied during server rendering. The editor's illustrative block preview remains separate from the actual storefront theme; inspect the published local storefront to verify final rendering.

Verification: 18 tests passed, including CMS theme fallback and visitor precedence. Production build and targeted ESLint passed. On the isolated local backend, saved/published dark theme was returned by the public API and rendered into server HTML; a light visitor cookie overrode it. Original publication was restored afterward. Browser editor selection, draft save confirmation and reload persistence were checked. The local draft was left with dark selected for review; production content was not changed.

The editor's side-by-side preview breakpoint was moved to 1700px after a 1280px browser inspection showed the form squeezed between the block list and preview. At narrower widths the preview follows the form.
