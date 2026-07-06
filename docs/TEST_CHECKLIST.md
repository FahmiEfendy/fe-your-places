# Your Places — Frontend Test Checklist

Run through this checklist after every deployment or significant code change.

---

## 1. Pre-Deployment

- [ ] **Container is built and pushed to GHCR**
  ```bash
  docker pull ghcr.io/fahmiefendy/fe-your-places:latest
  ```
  **Expected:** Image pulls successfully

- [ ] **Build-time variables were injected correctly**
  Check the GitHub Actions build log for `VITE_API_BASE_URL`, `VITE_GOOGLE_API_KEY`, `VITE_OPENINARY_URL`
  **Expected:** All three build args were passed

- [ ] **Container starts without errors**
  ```bash
  docker compose up -d yp-fe
  docker logs yp-fe --tail 20
  ```
  **Expected:** Nginx starts and logs `start worker processes`

---

## 2. Health & Availability

- [ ] **Frontend is reachable**
  ```bash
  curl -s -o /dev/null -w "%{http_code}" http://places.fahmiefendy.dev/
  ```
  **Expected:** `200`

- [ ] **Container is on the proxy network**
  ```bash
  docker network inspect proxy --format '{{range .Containers}}{{.Name}} {{end}}' | grep yp-fe
  ```
  **Expected:** `yp-fe` appears in the list

- [ ] **SPA routing works (deep link)**
  ```bash
  curl -s -o /dev/null -w "%{http_code}" http://places.fahmiefendy.dev/places/some-id
  ```
  **Expected:** `200` (Nginx serves `index.html`, not 404)

---

## 3. User Authentication

- [ ] **Signup page loads**
  Open `http://places.fahmiefendy.dev` in a browser and navigate to the signup page
  **Expected:** Form renders with name, email, password, and profile image fields

- [ ] **Signup with valid data**
  Fill in the signup form with valid details and profile image
  **Expected:** Account created, redirected to places list

- [ ] **Login page loads**
  Navigate to the login page
  **Expected:** Form renders with email and password fields

- [ ] **Login with valid credentials**
  Fill in the login form with previously registered credentials
  **Expected:** Logged in, JWT stored, nav updates to show logout option

- [ ] **Auth token persists on refresh**
  After login, refresh the page
  **Expected:** User remains logged in

- [ ] **Logout works**
  Click logout
  **Expected:** JWT cleared, redirected to home/login

---

## 4. Places

- [ ] **All places load on homepage**
  Navigate to `http://places.fahmiefendy.dev`
  **Expected:** List of all public places visible with images and creator info

- [ ] **Place detail page loads**
  Click on a place card
  **Expected:** Place detail page loads with map, description, and creator info

- [ ] **Google Maps renders on place detail**
  On the place detail page, verify the map component renders
  **Expected:** Map visible showing the place's location

- [ ] **User places page loads**
  Click on a user's name/avatar
  **Expected:** Page loads showing all places created by that user

- [ ] **Create place** (must be logged in)
  Click "Add Place", fill in title, description, address
  **Expected:** Place created, appears in your places list; coordinates resolved via geocoding

- [ ] **Update place** (must be owner)
  Click edit on your own place
  **Expected:** Update form pre-filled, changes save successfully

- [ ] **Delete place** (must be owner)
  Click delete on your own place and confirm
  **Expected:** Place removed from list

- [ ] **Non-owner cannot edit/delete**
  View a place created by another user
  **Expected:** No edit/delete buttons visible

---

## 5. Image Upload

- [ ] **Profile image uploads on signup**
  During signup, attach a profile image
  **Expected:** Image uploaded successfully, appears in user profile

- [ ] **Place image uploads on create**
  During place creation, attach a place image
  **Expected:** Image uploaded, displayed on place card and detail page

---

## 6. Error Handling

- [ ] **Protected route redirects unauthenticated users**
  Navigate to `/places/new` without being logged in
  **Expected:** Redirected to login

- [ ] **404 for unknown routes**
  Navigate to `http://places.fahmiefendy.dev/this-does-not-exist`
  **Expected:** 404 or fallback page shown

- [ ] **API error handled gracefully**
  Stop `yp-be` and try to load the places list
  ```bash
  docker stop yp-be
  ```
  **Expected:** Error message shown to user (not a white screen)
  ```bash
  docker start yp-be
  ```

---

## 7. Rollback

- [ ] **Previous image can be restored**
  ```bash
  # Pull a known good version
  docker compose pull yp-fe
  docker compose up -d yp-fe
  docker logs yp-fe --tail 10
  ```
  **Expected:** Container starts with previous version, site loads correctly
