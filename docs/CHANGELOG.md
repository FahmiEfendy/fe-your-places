# Your Places — Frontend Changelog

All notable changes to the frontend will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Planned
- Add comprehensive `.gitignore` and `.dockerignore`

---

## [1.1.0] — 2026-07-29

### Added
- `ErrorBoundary` component (`src/shared/components/UIElements/ErrorBoundary.jsx`) wrapping the routed app — catches render-time errors and shows a fallback card instead of a white screen
- `NotFound` page (`src/shared/pages/NotFound.jsx`), wired into both logged-in and logged-out route catch-alls
- Skeleton loading states on initial load for `AllPlaces`, `Users`, and `UserPlace` (reusing the existing `PlaceItemSkeleton`/`UserItemSkeleton` components instead of a bare spinner)
- Loading/error states in `Map.jsx` while waiting for the Google Maps SDK to become available
- File type/size validation in `ImageUpload.jsx` (jpg/png only, 5MB max by default, both configurable via `acceptedTypes`/`maxSizeMB` props) with a specific inline error message
- Auth session-expiry handling: `http-hook.js` emits an `auth:unauthorized` event on any 401 from an authenticated request; `auth-hook.js` listens for it, force-logs-out, and exposes a `sessionExpired` flag shown as a banner on the login page; protected routes (`/place/new`, `/place/:placeId`) now redirect to `/auth` instead of 404 if the session drops mid-visit
- `useDocumentMeta` hook (`src/shared/hooks/document-meta-hook.js`) — sets per-page `<title>`, `<meta description>`, and Open Graph tags without adding a new dependency; applied to all 6 pages
- Static Open Graph fallback tags in `index.html` (`og:site_name`, `og:type`, `og:title`, `og:description`, `og:image`)
- `Content-Security-Policy` header in `nginx.conf`, scoped to this app's actual origins (Google Maps, Openinary image host, same-origin API)

### Fixed
- `Auth.jsx`: the "Name" field's required validator was passed uncalled (`validators={[VALIDATOR_REQUIRE]}` instead of `VALIDATOR_REQUIRE()}`), so an empty name always validated as non-empty and could reach signup
- Removed the unused, no-op `VALIDATOR_FILE` export from `validators.js` — file validation now lives in `ImageUpload.jsx` where the `File` object actually is (the string-oriented `validate()` function can't validate a `File`)
- `Map.jsx`: fixed a bug (introduced during this same change, caught before release) where the SDK-ready poll interval was never cleared on the very first successful synchronous init, causing a duplicate `google.maps.Map`/`Marker` to be created every 250ms for as long as the map stayed mounted

### Changed
- `docs/TODO.md` — checked off the 7 critical items above.

## [1.0.0] — 2026-06-22

### Added
- React 18 + Vite single-page application
- User authentication flow (signup with profile image, login, logout)
- Places listing page showing all public places
- Place detail page with map view and creator info
- User profile page with all places by that user
- Create / update / delete places (authenticated users only)
- Google Maps integration for address geocoding and map display
- Image upload for places and user profile via Openinary
- JWT-based auth with protected routes
- Client-side routing via React Router v6
- Transition animations via React Transition Group
- Multi-stage Dockerfile — Vite build → Nginx (stable-alpine) serving
- Internal Nginx config for SPA routing and API proxy (`/api/` → `yp-be:5001`)
- GitHub Actions CI/CD pipeline — builds with `VITE_*` build args and pushes to GHCR
