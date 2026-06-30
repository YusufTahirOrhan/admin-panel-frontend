# OptiMaxx Frontend

Next.js frontend for the OptiMaxx public website, admin panel, and sales/POS screens.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The frontend expects the backend at `http://localhost:8080` by default. Override it with:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Quality Checks

```bash
npm run lint
npm run build
```

## Implemented Areas

- Public OptiMaxx homepage reads published CMS blocks from `/api/v1/public/pages/home`.
- Admin routes exist for dashboard, transactions, inventory, customers, users, analytics, audits, settings, and site editing.
- Sales routes exist for POS, repairs, prescriptions, and customers.
- Auth proxy routes keep refresh tokens in HttpOnly cookies.

## Deploy Notes

Required environment variable:

```bash
NEXT_PUBLIC_API_URL=https://api.optimaxx.com.tr
```

Optional panel subdomain variables:

```bash
PANEL_ORIGIN=https://panel.optimaxx.com.tr
PANEL_HOSTNAMES=panel.optimaxx.com.tr
```

The public website should not expose login, admin, panel, or randevu/appointment links. Requests to `/login`, `/admin`, or `/sales` on the public host redirect to `PANEL_ORIGIN` when configured. Localhost keeps the standard local development flow.

When deploying the Docker image to Heroku, the runtime binds to Heroku's `$PORT`. Cloudinary-hosted CMS images from `https://res.cloudinary.com/**` are allowed by `next.config.ts`.

The final hosting target can be Vercel, a Node container, or another Next.js-compatible runtime. Choose the public URL after the domain is purchased.
