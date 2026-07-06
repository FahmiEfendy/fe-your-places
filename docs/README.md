# Your Places — Frontend

## Overview

React single-page application for Your Places, a platform where users can create accounts and share their favorite places. Built with Vite and served via Nginx in production. Handles client-side routing, API proxy to the backend, Google Maps integration, and image uploads via Openinary.

**Container name:** `yp-fe`
**Image:** `ghcr.io/fahmiefendy/fe-your-places:latest`
**Port:** `80` (internal Nginx)
**Runtime:** Nginx stable-alpine (serving static build)
**Public URL:** `places.fahmiefendy.dev`

## Architecture

```
Browser → Cloudflare → infra-nginx → yp-fe:80 (Nginx)
                                       ├── /            → Static SPA (index.html)
                                       ├── /assets/     → Vite-built JS/CSS bundles
                                       └── /api/*       → Proxy to yp-be:5001
```

The frontend container runs its own internal Nginx that:
1. Serves the Vite-built static files
2. Proxies `/api/*` requests to the backend container (`yp-be:5001`)
3. Handles SPA fallback routing (all paths → `index.html`)

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

The frontend container runs its own Nginx instance with the following routing:

| Path | Handler | Description |
|------|---------|-------------|
| `/` | `try_files` → `index.html` | SPA fallback for client-side routing |
| `/assets/` | `try_files` → 404 | Vite-built static assets |
| `/api/*` | `proxy_pass` → `yp-be:5001` | API proxy (strips `/api` prefix) |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank page | Check browser console for JS errors. Verify `VITE_API_BASE_URL` was set correctly at build time |
| API calls failing | Verify `yp-be` is running and on the same Docker network (`yp-internal`) |
| Google Maps not loading | Verify `VITE_GOOGLE_API_KEY` was set at build time and not restricted to another domain |
| Images not loading | Check Openinary service is reachable; verify `VITE_OPENINARY_URL` build arg |
| 404 on page refresh | Verify `nginx.conf` has `try_files $uri $uri/ /index.html` for SPA routing |
| 502 from infra-nginx | Check `yp-fe` is running: `docker ps --filter name=yp-fe` |
| Old content after deploy | Clear browser cache or do a hard refresh (Ctrl+Shift+R) |

## Related Files

- [docker-compose.yml](../../docker-compose.yml) — Service definition
- [Dockerfile](../Dockerfile) — Multi-stage container build
- [nginx.conf](../nginx.conf) — Internal Nginx routing config
- [deploy.yml](../.github/workflows/deploy.yml) — CI/CD pipeline
- [vite.config.js](../vite.config.js) — Build configuration
