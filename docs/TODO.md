# Your Places — Frontend TODO

## 🔴 Critical


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
