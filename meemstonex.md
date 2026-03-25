# Meemstonex — Project Documentation (High Fidelity)

## 1) Project Summary

Meemstonex is a Next.js 15 application for showcasing and managing premium marble/stone products.

It includes:
- A public marketing website homepage with rich animated sections.
- A public product catalog with category filters, grouped display, and product detail modal.
- Category listing and category-specific browsing pages.
- An admin login and product management panel (create/edit/delete with toast feedback).
- MongoDB-backed APIs for products and categories.

---

## 2) Tech Stack

- Framework: Next.js 15 (App Router)
- Runtime: React 19
- Styling: Tailwind CSS v4 + utility classes in `src/app/globals.css`
- Animations/UI: Framer Motion, GSAP, Radix Dialog, custom UI components
- Database: MongoDB (native `mongodb` driver)
- Image handling: Next Image + optional Cloudinary server-side upload pass-through

---

## 3) Repository Layout

```text
meemstonex-website/
├── public/                         # static assets (images, products, videos, fonts)
├── scripts/                        # workspace utilities
├── src/
│   ├── app/
│   │   ├── page.js                 # homepage
│   │   ├── products/page.jsx       # public product catalog
│   │   ├── categories/page.jsx     # category index
│   │   ├── categories/[slug]/page.jsx
│   │   ├── admin/page.jsx          # admin login
│   │   ├── admin/products/page.jsx # admin editor
│   │   └── api/...                 # route handlers
│   ├── components/                 # feature + UI components
│   ├── lib/                        # db, i18n, category helpers
│   └── services/                   # frontend API client + mock API
├── middleware.js                   # admin route/API guard
├── next.config.mjs                 # Next image host config
├── package.json
├── .github/workflows/ci.yml        # lint + build automation
├── .editorconfig                   # editor consistency rules
└── meemstonex.md                   # this document
```

---

## 4) Core User Flows

### Public Site
1. User lands on `/`.
2. `HomeClient` dynamically loads sections (`Hero`, `About`, `OurProcess`, `CoverFlowCarousel`, etc.).
3. `CoverFlowCarousel` fetches featured products and renders them in `PanoramaRing`.

### Product Discovery
1. User opens `/products`.
2. Frontend fetches `/api/products` with paging and filters.
3. Products are grouped by category on the page.
4. Selecting a product opens a modal with details.

### Admin Management
1. Admin logs in at `/admin`.
2. Credentials are verified via `/api/admin/check`.
3. Middleware enforces session cookie for `/admin/*` and `/api/admin/*` (except check route).
4. Admin can create/edit/delete products, sync categories, and reset categories.

---

## 5) Pages and Routes

### App Routes
- `/` — marketing homepage
- `/products` — catalog + filters + detail modal
- `/categories` — category grid
- `/categories/[slug]` — category-specific view
- `/admin` — admin login
- `/admin/products` — admin products editor

### API Routes
- `GET/POST/PUT/DELETE /api/products`
  - list/create/update/delete products
  - supports query params: `page`, `pageSize`, `q`, `categories`, `featured`, `sort`
- `GET /api/products/[id]`
  - fetch single product by id
- `GET/POST/PUT/DELETE /api/categories`
  - list/add/rename/delete categories
  - reset all categories via `DELETE ?all=true`
- `POST /api/categories/seed`
  - seed categories from canonical list (token-gated)
- `POST /api/admin/check`
  - validates credentials and sets admin session cookie
- `POST /api/admin/sync-categories`
  - upserts canonical categories into DB (admin utility)
- `POST /api/contact`
  - sends form payload to Google Apps Script URL when configured
- `POST /api/upload`
  - optional Cloudinary server-side upload, otherwise returns provided URL
- `GET /api/health`
  - lightweight deployment health check endpoint

---

## 6) Data Model (MongoDB)

### Collection: `products`
Common fields used by UI/API:
- `name: string`
- `categories: string[]`
- `size_feet: string`
- `size_inches: string`
- `material: string`
- `customization: string`
- `service: string`
- `photos: string[]`
- `photo: string` (legacy compatibility)
- `description: string`
- `currency: string` (default `INR`)
- `featured: boolean`
- `createdAt: Date`
- `updatedAt: Date`

### Collection: `categories`
- `name: string` (unique index)
- `createdAt: Date`

### Indexes
On startup, app ensures:
- products: `name_asc`, `categories_asc`, `createdAt_desc`
- categories: unique `name_unique`

---

## 7) Environment Variables

Use `.env.example` as the template, then create `.env.local` (for local runtime) with values below:

```bash
# MongoDB
MONGODB_URI=
MONGODB_DB=meemstonex
MONGODB_TLS_INSECURE=0

# Admin auth
ADMIN_EMAIL=
ADMIN_PASSWORD=
# Optional: override generated token
ADMIN_SESSION_TOKEN=

# Optional integrations
GOOGLE_APPS_SCRIPT_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Frontend behavior
NEXT_PUBLIC_USE_MOCK=0
NEXT_PUBLIC_MOCK_ERROR_RATE=
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_WHATSAPP_MESSAGE=
```

Notes:
- `MONGODB_URI` is required for DB-backed API routes.
- `NEXT_PUBLIC_USE_MOCK=1` switches frontend service layer to mock API.
- `MONGODB_TLS_INSECURE=1` is dev-only and should never be enabled in production.

---

## 8) Local Development Setup

### Prerequisites
- Node.js 20+ (recommended)
- npm
- MongoDB Atlas/local instance

### Install and Run

```bash
npm install
npm run dev
```

Open:
- `http://localhost:3000` (site)
- `http://localhost:3000/admin` (admin login)

### Build and Production Run

```bash
npm run build
npm run start
```

### Run on VPS (bind externally)

```bash
npm run build
PORT=3000 npm run start:vps
```

### Lint

```bash
npm run lint
```

---

## 9) Available NPM Scripts

From `package.json`:
- `npm run dev` — starts Next dev server (turbopack)
- `npm run build` — production build
- `npm run start` — serves production build
- `npm run start:vps` — serves production build on `0.0.0.0` for reverse-proxy/VPS setups
- `npm run lint` — eslint
- `npm run extract:products` — extract rows from an Excel sheet into JSON

---

## 10) Deployment Runbook

### Vercel (current target)
1. Import this Git repository in Vercel.
2. Framework preset: `Next.js` (auto-detected).
3. Add all required environment variables from `.env.example` in Vercel Project Settings.
4. Deploy from `main` (or your preferred production branch).
5. Verify:
   - `/` loads
   - `/products` loads data
   - `/admin` login works
   - `/api/contact` succeeds with/without `GOOGLE_APPS_SCRIPT_URL`

### VPS (future migration)
Two supported paths:

1) Native Node process
- Run `npm ci`, `npm run build`, then `npm run start:vps`.
- Put Nginx/Caddy in front of port `3000`.

2) Docker (recommended for portability)
```bash
docker build -t meemstonex:latest .
docker run -d --name meemstonex -p 3000:3000 --env-file .env.local meemstonex:latest
```

Notes:
- `next.config.mjs` uses `output: "standalone"` for efficient container/self-hosted runtime.
- Keep `MONGODB_TLS_INSECURE=0` on Vercel/VPS production environments.

---

## 11) Data Seeding and Import Utilities

### Utility: `scripts/extract-products.js`
- Extracts rows from an Excel file and writes `products_extracted.json`
- Usage:
  - `npm run extract:products`
  - `node scripts/extract-products.js ./Products.xlsx ./products_extracted.json`

---

## 12) Admin Security Model

### How it works
- Login API checks `ADMIN_EMAIL` + `ADMIN_PASSWORD`.
- On success, server sets `admin_session` HTTP-only cookie.
- Middleware validates cookie for:
  - `/admin/:path*`
  - `/api/admin/:path*` (except `/api/admin/check`)

### Important constraints
- Session token defaults to `ADMIN_EMAIL:ADMIN_PASSWORD` unless `ADMIN_SESSION_TOKEN` is set.
- Cookies are marked `secure` only in production.
- Keep credentials and token in environment variables only.

---

## 13) Frontend Service Layer Behavior

`src/services/api.js` acts as a single client API adapter:
- Calls Next API routes by default.
- Falls back to mock API for specific paths when mock mode is enabled or on selected failures.
- Normalizes query params for pagination/filter/sort.

This design supports both:
- real MongoDB-backed operation
- local/offline UI workflows with mock data

---

## 14) Images and Media

### Local assets
- Product/media files are stored under `public/products`, `public/img`, `public/videos`, etc.

### Remote images
- Allowed hostnames are configured in `next.config.mjs` (`images.unsplash.com`, `res.cloudinary.com`, etc.).

### Upload endpoint
- `/api/upload` uses Cloudinary when credentials exist.
- If not configured, it returns the original URL unchanged.

---

## 15) Known Notes and Operational Guidance

- If category APIs fail, frontend may gracefully fallback to mock list in some flows.
- Product list endpoint returns safe fallback payload on DB errors instead of crashing the page.
- Ensure MongoDB indexes are allowed to initialize on first connection for best query performance.
- Admin sync/reset actions are powerful; use carefully in shared environments.

---

## 16) Quick Start Checklist

1. Add `.env.local` with required values.
2. Run `npm install`.
3. Run `npm run dev`.
4. Verify `/products` loads data.
5. Verify admin login via `/admin`.
6. Use `Sync Categories` in admin if category set is missing.

---

## 17) Ownership and Maintenance

When changing data contracts, update together:
- API route handlers in `src/app/api/*`
- frontend adapters in `src/services/api.js`
- admin/public UI components consuming product/category fields
- this documentation file (`meemstonex.md`)

This file is intended to be the single source of project documentation in this repository.