# Your Places — Frontend

## Overview

React single-page application for Your Places, a platform where users can create accounts and share their favorite places. Built with Vite and served via Nginx in production. Handles client-side routing, Google Maps integration, and image uploads via Openinary; talks to the backend directly (not proxied through this container).

**Container name:** `yp-fe`
**Image:** `ghcr.io/fahmiefendy/fe-your-places:latest`
**Port:** `80` (internal Nginx)
**Runtime:** Nginx stable-alpine (serving static build)
**Public URL:** `places.fahmiefendy.dev`

## Architecture

```
Browser → Cloudflare → infra-nginx (conf.d/yourplaces.conf)
                          ├── places.fahmiefendy.dev     → yp-fe:80 (this app)
                          └── api-places.fahmiefendy.dev → yp-be:5001 (backend, direct)
```

`yp-fe`'s own internal Nginx (`nginx.conf`) only serves the static SPA build and handles client-side routing fallback — it does **not** proxy API calls. The browser calls the backend directly at `VITE_API_BASE_URL` (baked in at build time), which in production resolves to `api-places.fahmiefendy.dev`.

## Directory Structure

```
fe-your-places/
├── index.html            # HTML entry point
├── vite.config.js        # Vite build configuration
├── nginx.conf            # Internal Nginx config (SPA routing + API proxy)
├── src/                  # React application source
│   ├── places/           # Places feature (list, detail, new, update)
│   ├── shared/           # Shared components (UI kit, hooks, utils)
│   └── user/             # User feature (auth, profile, user places)
├── public/               # Static assets
├── docs/                 # Documentation
├── Dockerfile            # Multi-stage build (Vite → Nginx)
└── .github/workflows/
    └── deploy.yml        # CI/CD — build & push to GHCR
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API URL (build-time, baked into JS bundle) | `http://localhost:5001` | Yes |
| `VITE_GOOGLE_API_KEY` | Google Maps API key (restrict to your domain) | — | Yes |
| `VITE_OPENINARY_URL` | Openinary image service URL | `http://localhost:3000` | Yes |

> **Note:** All `VITE_` variables are set at **build time** via Docker build args and are embedded into the JavaScript bundle. Never store secrets in frontend env variables.

## Local Development

```bash
# Install dependencies
npm install

# Copy and configure environment
cp .env.example .env
# Edit .env — set VITE_API_BASE_URL to your local backend URL

# Start development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Docker Deployment

The container is built and pushed via GitHub Actions on every push to `main`. The `VITE_*` variables are injected at build time via `--build-arg`.

On the homeserver:

```bash
# Start the app stack
cd /path/to/homeserver/apps/your-places
docker compose up -d

# View logs
docker logs yp-fe --tail 50 -f

# Check the frontend is serving
curl -s -o /dev/null -w "%{http_code}" http://places.fahmiefendy.dev/
```

## Internal Nginx Configuration

The frontend container runs its own Nginx instance (`nginx.conf`) with the following routing:

| Path | Handler | Description |
|------|---------|-------------|
| `/` | `try_files $uri $uri/ /index.html` | SPA fallback for client-side routing |

It also sends a `Content-Security-Policy` header on every response, scoped to this app's actual external dependencies (Google Maps JS SDK, Google Fonts, the Openinary image host) plus `'self'` for same-origin assets and API calls. If you add a new external script/image/font/API host, update the relevant `-src` directive in `nginx.conf` or the browser will silently block it.

API calls are **not** proxied through this container — the browser calls the backend origin directly (see Architecture above).

## Security

- **Error boundary** — the routed app is wrapped in an `ErrorBoundary` (`src/shared/components/UIElements/ErrorBoundary.jsx`) so a render-time crash in any page shows a fallback card instead of a blank white screen.
- **404 handling** — unknown routes render `NotFound` instead of silently redirecting.
- **Session expiry** — any 401 from an authenticated request (create/update/delete place) force-logs-out the user, shows a "session expired" message on the login page, and redirects protected routes to `/auth` instead of a confusing 404.
- **Client-side validation** — required fields, email format, min length, and file type/size (jpg/png, 5MB default) are validated before submission; see `src/shared/utils/validators.js` and `src/shared/components/FormElements/ImageUpload.jsx`.
- **Content-Security-Policy** — set by this container's Nginx (`nginx.conf`), restricting script/style/image/connect sources to `'self'` plus the known external hosts (Google Maps, Google Fonts, Openinary). Anything outside that allowlist is blocked by the browser, not just a good practice on paper.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page | Check browser console for JS errors. Verify `VITE_API_BASE_URL` was set correctly at build time. If a component threw during render, the `ErrorBoundary` fallback card should show instead of a truly blank page — a blank page with no fallback usually means the crash happened above the boundary (e.g. in `App.jsx` itself) |
| API calls failing | Verify `yp-be` is running and reachable at `VITE_API_BASE_URL` (production calls it directly at `api-places.fahmiefendy.dev`, not proxied through this container) |
| Google Maps not loading | Verify `VITE_GOOGLE_API_KEY` was set at build time and not restricted to another domain. Also check the browser console for CSP violations — the Maps script/styles must be allowed by `nginx.conf`'s `Content-Security-Policy` header |
| Images not loading | Check Openinary service is reachable; verify `VITE_OPENINARY_URL` build arg. Also check the console for CSP `img-src`/`connect-src` violations if the image host changed |
| 404 on page refresh | Verify `nginx.conf` has `try_files $uri $uri/ /index.html` for SPA routing |
| 502 from infra-nginx | Check `yp-fe` is running: `docker ps --filter name=yp-fe` |
| Old content after deploy | Clear browser cache or do a hard refresh (Ctrl+Shift+R) |
| Console error `Refused to load/connect ... violates CSP` | The resource's host isn't in `nginx.conf`'s `Content-Security-Policy` allowlist — add it to the relevant `-src` directive and redeploy |
| Kicked to login unexpectedly | A request came back `401` — the JWT expired or the backend rejected it. Check the backend's `JWT_TOKEN_KEY`/`JWT_FALLBACK_KEYS` are configured correctly (see backend docs) if this happens right after a key rotation |

## Related Files

- [docker-compose.yml](../../docker-compose.yml) — Service definition
- [Dockerfile](../Dockerfile) — Multi-stage container build
- [nginx.conf](../nginx.conf) — Internal Nginx routing config
- [deploy.yml](../.github/workflows/deploy.yml) — CI/CD pipeline
- [vite.config.js](../vite.config.js) — Build configuration
