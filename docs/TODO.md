# Your Places — Frontend TODO

## 🔴 Critical

- [ ] **Error boundaries** — Add React error boundary components to prevent white-screen crashes on unexpected errors
- [ ] **Loading states** — Add skeleton loaders or spinners for all async data fetching (places, users, map)
- [ ] **404 page** — Create a user-friendly "page not found" component for unknown routes
- [ ] **Form validation** — Client-side validation on all forms before submission (required fields, file type/size checks)
- [ ] **Auth token expiry handling** — Detect JWT expiry (401 responses), clear token, and redirect to login with a message
- [ ] **SEO meta tags** — Add proper `<title>`, `<meta description>`, and Open Graph tags per page
- [ ] **Content Security Policy** — Configure Nginx to send CSP headers restricting script/style sources

## 🟡 Medium

- [ ] **Image lazy loading** — Defer off-screen place images with `loading="lazy"` or Intersection Observer
- [ ] **Accessibility audit** — Run axe/Lighthouse audit; fix ARIA labels, keyboard navigation, and color contrast issues
- [ ] **Toast notifications** — Replace `alert()` / basic error display with a proper toast/notification system
- [ ] **Responsive design audit** — Test all pages on mobile, tablet, and desktop breakpoints
- [ ] **Search functionality** — Add a search bar to filter places by title, address, or creator
- [ ] **Pagination / infinite scroll** — Handle large place catalogs without loading everything at once
- [ ] **Map clustering** — Cluster nearby map markers when showing all places on a map view
- [ ] **PWA support** — Add `manifest.json` and service worker for offline access and "Add to Home Screen"
- [ ] **Automated tests** — Add Vitest + React Testing Library tests for key components and hooks
- [ ] **CI test pipeline** — Run tests in GitHub Actions before building the Docker image

## 🟢 Nice to Have

- [ ] **E2E tests** — Add Playwright or Cypress tests for critical user flows (signup, create place, delete place)
- [ ] **Dark mode** — Add a theme toggle with system preference detection
- [ ] **i18n** — Internationalization support for multi-language content
- [ ] **Analytics** — Integrate Google Analytics or Plausible for page view tracking
- [ ] **Performance monitoring** — Add Web Vitals tracking (LCP, FID, CLS)
- [ ] **Image optimization** — Serve WebP format and responsive image sizes
- [ ] **Share functionality** — Deep link sharing for individual place pages
- [ ] **Sitemap generation** — Auto-generate `sitemap.xml` for search engine crawlers
- [ ] **Storybook** — Component library documentation for development
