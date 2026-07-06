# Your Places — Frontend Changelog

All notable changes to the frontend will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [Unreleased]

### Planned
- Migrate to proper `.env.example` (dotfile convention)
- Add comprehensive `.gitignore` and `.dockerignore`
- Add `docs/` folder with README, CHANGELOG, TEST_CHECKLIST, TODO

---

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
