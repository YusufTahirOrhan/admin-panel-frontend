# OptiMaxx Frontend

Next.js frontend for the OptiMaxx public website, admin panel, and sales/POS screens.

## Local Development

This branch builds a **static export** for cheap shared hosting. The API is the PHP backend in
`spring-boot-admin-panel-project/php-backend` (branch `feature/php-backend`), served from the same domain.

```bash
# terminal 1: PHP API on :8080 (needs a MySQL/MariaDB database, see php-backend/.env.example)
cd ../spring-boot-admin-panel-project/php-backend
php -S localhost:8080 -t public bin/dev-router.php

# terminal 2: Next.js dev server on :3000, proxies /api/* to :8080
npm install
npm run dev
```

Use `BACKEND_DEV_URL` if the API runs elsewhere.

## Quality Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The regression tests use Node.js 22.6+ type stripping and the built-in test runner; no test dependency is required.
The public homepage uses published CMS content only. A failed request shows a retry state; an empty publication shows an empty state. It no longer substitutes demonstration contact details when the API is unavailable.

See `docs/review/REVIEW.md` for the UI review, verification results, screenshots, and remaining limitations.

## Implemented Areas

- Public OptiMaxx homepage reads published CMS blocks from `/api/v1/public/pages/home`.
- Admin routes exist for dashboard, transactions, inventory, customers, users, analytics, audits, settings, and site editing.
- Sales routes exist for POS, repairs, prescriptions, and customers.
- Auth proxy routes keep refresh tokens in HttpOnly cookies.

## Deploy (shared hosting)

```bash
npm run build          # writes the static site to out/
```

Copy everything inside `out/` into the PHP backend's `public/` folder (next to `index.php` and
`.htaccess`) and upload. `.htaccess` sends `/api/*` to PHP and maps `/admin/users` to
`admin/users.html`. See `php-backend/DEPLOY.md` for the full cPanel guide.

Optional build-time variables:

```bash
NEXT_PUBLIC_API_URL=https://api.example.com     # only if the API is on another domain (default: same domain)
NEXT_PUBLIC_PANEL_ORIGIN=https://panel.optimaxx.com.tr   # only if the panel has its own subdomain
NEXT_PUBLIC_PANEL_HOSTNAMES=panel.optimaxx.com.tr
```

What changed for the static export:

- The Next.js route handlers (`/api/auth/*`, the invoice proxy) and `proxy.ts` need a Node server;
  the PHP backend now serves the same `/api/auth/*` endpoints with the same HttpOnly cookies, and
  page guards run in the browser (`components/auth/panel-guard.tsx`). The API still checks every permission.
- The public homepage fetches its published CMS blocks in the browser instead of on the server.
- Inter is bundled from `@fontsource-variable/inter` (offline builds, Turkish glyphs, no Google request).
- The Dockerfile/Heroku flow (`next start`) still lives on `main`; it does not apply to this branch.
