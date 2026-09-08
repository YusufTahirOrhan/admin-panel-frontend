# Storefront color palettes

Site editor > Site Görünümü now manages four curated palettes (forest, ocean, clay, graphite), each with light and dark tokens. Paired samples update immediately, and the expandable first-screen/collection previews use the same components as the public site with current draft content. The full editor preview also uses the shared renderer instead of a separate fixed-color imitation. Preview controls are inert; publishing remains an explicit action.

Appearance is persisted as a dedicated `appearance` block, outside the sortable content list. It is independent of Hero and travels through the existing draft/publish API. The backend must include `appearance` in its supported block types before the updated editor saves drafts. No database migration is needed. Unknown appearance JSON fields are retained on save. Legacy Hero defaultTheme values migrate into the appearance setting when saving; visitors' explicit mode preferences still take priority.

Palette tokens cover surfaces, text, primary actions, cards, menus, dialog portals and focus outlines. Palette choice comes from the publication, not visitor cookies. The layout/page share one request-scoped CMS fetch.

Verification:
- 21 frontend tests passed, including palette normalization, metadata parsing, theme precedence and 4.5:1 text/button contrast for all eight palette/mode combinations.
- Production build, TypeScript and targeted lint passed.
- Four SitePageService tests passed, including appearance without Hero.
- Real isolated backend API: draft did not alter publication; publishing ocean returned ocean and dark mode in server HTML. Original publication restored after the check.
- Browser: ocean/clay changes, paired content previews, draft save/reload persistence and 390px/1280px layouts checked. Fixed narrow-screen grid overflow. The local draft retains clay for review; production data was not modified.

Deployment requires the backend compatibility change first (or alongside the frontend). No deployment was performed.
