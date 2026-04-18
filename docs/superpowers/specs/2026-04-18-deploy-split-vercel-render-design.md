# Split Deployment: Vercel (Frontend) + Render (Backend)

**Date:** 2026-04-18
**Status:** Approved for implementation planning
**Supersedes (partially):** The production-deployment assumption in `2026-04-16-moist-cit-website-design.md` line 347 ("Go serves the built React app in production"). The Go server will no longer serve the React SPA; Vercel will.

## Goal

Deploy the MOIST CIT IT Days 2026 website as two separate services:

- **Frontend** — the Vite/React 19 SPA — on **Vercel**, reachable at `https://moistbsit.vercel.app` (or a suffixed variant if that subdomain is globally taken).
- **Backend** — the Go/Gin API plus `/images/*` static assets — on **Render Free tier**, reachable at `https://moistbsit-api.onrender.com` (or a suffixed variant).

GitHub repo: existing empty public repo `CharlieJamesGwapo/bsit` (SSH: `git@github.com:CharlieJamesGwapo/bsit.git`). Both services auto-deploy on `git push` to `main` after initial setup.

## Non-Goals

- Custom domain configuration (e.g., `moistbsit.com`) — out of scope.
- Moving contact-form persistence off the ephemeral Render filesystem.
- Upgrading Render to a paid tier to eliminate cold starts.
- Any frontend/backend feature changes beyond what deployment requires.

## Architecture

```
                    ┌─────────────────────────────┐
  Browser ──HTTPS──▶│  moistbsit.vercel.app       │  (Vercel CDN)
                    │  React SPA, served static   │
                    └─────────────┬───────────────┘
                                  │
                                  │ fetch() via VITE_API_BASE_URL
                                  ▼
                    ┌─────────────────────────────┐
                    │  moistbsit-api.onrender.com │  (Render Free)
                    │  Go/Gin: /api/* + /images/* │
                    │  Sleeps after 15min idle    │
                    └─────────────────────────────┘
```

The two services communicate cross-origin. The backend permits the Vercel origin via `ALLOWED_ORIGIN`.

## Code Changes

### Backend (`backend/main.go`)

Two changes to `main()`:

1. **Port binding** — read `PORT` env var (Render injects this), fall back to `8080` for local development.
2. **CORS origin** — read `ALLOWED_ORIGIN` env var, fall back to `http://localhost:5173` for local development.

Pseudocode:

```go
port := os.Getenv("PORT")
if port == "" {
    port = "8080"
}
allowed := os.Getenv("ALLOWED_ORIGIN")
if allowed == "" {
    allowed = "http://localhost:5173"
}
r.Use(cors.New(cors.Config{
    AllowOrigins:     []string{allowed},
    AllowMethods:     []string{"GET", "POST"},
    AllowHeaders:     []string{"Content-Type"},
    AllowCredentials: true,
}))
// ...
r.Run(":" + port)
```

Everything else — route registration, static file serving at `./backend/static/images`, handlers — stays unchanged.

### Frontend — centralized URL helper

New file `frontend/src/lib/api.ts`:

```ts
const BASE = import.meta.env.VITE_API_BASE_URL ?? "";
export const api = (path: string) => `${BASE}${path}`;
export const img = (filename: string) => `${BASE}/images/${filename}`;
```

Behavior:

- **Dev** — `VITE_API_BASE_URL` unset → `BASE = ""` → URLs remain relative (`/api/events`, `/images/foo.jpg`) → Vite dev proxy handles forwarding to `localhost:8080`. Existing `frontend/vite.config.ts` proxy config is kept.
- **Prod** — `VITE_API_BASE_URL` set to Render URL at build time → URLs become absolute (`https://moistbsit-api.onrender.com/api/events`).

### Frontend — sweep replacements

All 9 fetch calls and all 12 image references must route through the helper.

**Fetch calls (9 sites):**

| File | Line | Change |
|---|---|---|
| `src/pages/HomePage.tsx` | 73 | `fetch("/api/events")` → `fetch(api("/api/events"))` |
| `src/pages/HomePage.tsx` | 74 | `fetch("/api/instructors")` → `fetch(api("/api/instructors"))` |
| `src/pages/HomePage.tsx` | 75 | `fetch("/api/info")` → `fetch(api("/api/info"))` |
| `src/components/HeroSection.tsx` | 11 | `fetch("/api/events")` → `fetch(api("/api/events"))` |
| `src/components/ContactForm.tsx` | 24 | `fetch("/api/contact", ...)` → `fetch(api("/api/contact"), ...)` |
| `src/pages/EventDetailPage.tsx` | 19 | `fetch(\`/api/events/${id}\`)` → `fetch(api(\`/api/events/${id}\`))` |
| `src/pages/InstructorsPage.tsx` | 33 | `fetch("/api/instructors")` → `fetch(api("/api/instructors"))` |
| `src/pages/AboutPage.tsx` | 54 | `fetch("/api/info")` → `fetch(api("/api/info"))` |
| `src/pages/EventsPage.tsx` | 30 | `fetch("/api/events")` → `fetch(api("/api/events"))` |

Each of those 9 files needs `import { api } from "../lib/api";` (adjust path).

**Image references (12 sites):**

| File | Line | Change |
|---|---|---|
| `src/components/EventCard.tsx` | 25 | `src={\`/images/${event.image}\`}` → `src={img(event.image)}` |
| `src/components/Timeline.tsx` | 47 | `src={\`/images/${event.image}\`}` → `src={img(event.image)}` |
| `src/components/HeroSection.tsx` | 50 | `src="/images/logo.jpg"` → `src={img("logo.jpg")}` |
| `src/components/HeroSection.tsx` | 146 | `src={\`/images/${event.image}\`}` → `src={img(event.image)}` |
| `src/components/Navbar.tsx` | 37 | `src="/images/logo.jpg"` → `src={img("logo.jpg")}` |
| `src/components/Navbar.tsx` | 108 | `src="/images/logo.jpg"` → `src={img("logo.jpg")}` |
| `src/components/Footer.tsx` | 11 | `src="/images/logo.jpg"` → `src={img("logo.jpg")}` |
| `src/pages/EventDetailPage.tsx` | 60 | `src={\`/images/${event.image}\`}` → `src={img(event.image)}` |
| `src/pages/ContactPage.tsx` | 79 | `src="/images/logo.jpg"` → `src={img("logo.jpg")}` |
| `src/components/InstructorCard.tsx` | 18 | `src={\`/images/${instructor.photo}\`}` → `src={img(instructor.photo)}` |
| `src/pages/InstructorsPage.tsx` | 93 | `src={\`/images/${inst.photo}\`}` → `src={img(inst.photo)}` |
| `src/pages/AboutPage.tsx` | 108 | `src="/images/logo.jpg"` → `src={img("logo.jpg")}` |

Each file gets `import { img } from "../lib/api";` (adjust path).

### New files

**`.gitignore` (repo root):**

```
# OS
.DS_Store

# Node
node_modules/
frontend/dist/

# Go build artifacts
app
backend/app

# Env files
.env
.env.local
frontend/.env.local
.vercel
```

`frontend/.env.example` is committed; `frontend/.env.local` is not.

**`render.yaml` (repo root)** — Render Blueprint:

```yaml
services:
  - type: web
    name: moistbsit-api
    runtime: go
    plan: free
    buildCommand: go build -o app ./backend
    startCommand: ./app
    envVars:
      - key: ALLOWED_ORIGIN
        value: https://moistbsit.vercel.app
```

Render auto-injects `PORT`; we do not set it in the Blueprint. The `go build -o app ./backend` command runs from repo root; the resulting binary runs from repo root, so `./backend/static/images` in the Go code resolves correctly.

**`frontend/vercel.json`** — SPA fallback for React Router:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**`frontend/.env.example`:**

```
# Set in Vercel project → Settings → Environment Variables
# Empty/unset in local dev — Vite proxy handles forwarding to localhost:8080
VITE_API_BASE_URL=
```

## Data Flow

1. User opens `https://moistbsit.vercel.app`.
2. Vercel CDN serves `index.html` + bundled JS/CSS.
3. React mounts. Components call `fetch(api("/api/events"))` etc.
4. At build time on Vercel, `VITE_API_BASE_URL` was `https://moistbsit-api.onrender.com`, so those fetches go directly to Render.
5. Render receives the cross-origin request; `cors` middleware sees `Origin: https://moistbsit.vercel.app` matches `ALLOWED_ORIGIN` → allowed.
6. Handler reads from `backend/data/*.json`, returns response.
7. `<img src={img(...)}>` elements load from `https://moistbsit-api.onrender.com/images/...`.

First visit after 15 min idle: steps 4–6 take 30–50s while Render wakes. No loading UI is added in this spec — the app continues to use the existing `useEffect`-then-`setState` pattern, which means users see an empty page during cold start.

## Deployment Sequence

Order matters because Vercel needs the Render URL before build, and Render's CORS may need the final Vercel URL.

1. **Implement code changes locally** — backend env vars, frontend helper + sweep, new files above.
2. **Local smoke test** — run `go run ./backend` and `npm run dev` in `frontend/`, verify all pages work through the Vite proxy.
3. **Connect local repo to GitHub and push** — the GitHub repo already exists. From repo root:
   ```
   git init  # if not already initialized — the repo is already a git repo per gitStatus
   git remote add origin git@github.com:CharlieJamesGwapo/bsit.git
   git branch -M main
   git add -A
   git commit -m "chore: prepare split deployment (vercel + render)"
   git push -u origin main
   ```
   (If `origin` already exists, skip the `remote add`.)
4. **Deploy Render (manual, one-time)** — open https://dashboard.render.com/blueprints, "New Blueprint Instance", select the `bsit` repo. Render reads `render.yaml` and creates the service. Wait for first build (~2–4 min). Record the service URL.
5. **Set Vercel env var** — `cd frontend && vercel link` (accept/override project name `moistbsit`), then `vercel env add VITE_API_BASE_URL production` and paste the Render URL recorded in step 4.
6. **Deploy Vercel** — `vercel --prod` from `frontend/`. Record the production URL.
7. **Reconcile CORS if needed** — if the Vercel URL from step 6 differs from `https://moistbsit.vercel.app`, open the Render dashboard, update the `ALLOWED_ORIGIN` env var to match, trigger a redeploy.
8. **End-to-end verification** — open the Vercel URL in a browser, confirm: events list loads, event detail page loads, instructors list loads, about page loads, contact form POSTs successfully (check Network tab for 200 response), images render across all pages. First load will be slow due to cold start.

## Naming Collisions — Fallback Plan

| Resource | Desired name | If taken |
|---|---|---|
| Vercel project subdomain | `moistbsit.vercel.app` | Accept Vercel's suffixed URL (e.g., `moistbsit-capstonee2-8767.vercel.app`) during `vercel link`, update `ALLOWED_ORIGIN` in Render to match |
| Render service subdomain | `moistbsit-api.onrender.com` | Render auto-suffixes; update Vercel's `VITE_API_BASE_URL` to the actual URL before `vercel --prod` |
| GitHub repo | `CharlieJamesGwapo/bsit` | Already created; no collision possible |

## Testing

The underlying app's tests (unit/integration) are unchanged by this deploy work. Verification for the deploy itself is the step-8 end-to-end check. Success criteria:

- Vercel URL serves the app shell in < 2s.
- All 9 API endpoints return expected data when called from the live frontend.
- All 12 image references render (not broken-image icons).
- Contact form POST receives a 200 response.
- React Router deep-links (e.g., `/events/basketball-tournament`) load directly without 404.

## Risks and Mitigations

| Risk | Mitigation |
|---|---|
| Vercel subdomain taken | Accept suffix; update `ALLOWED_ORIGIN` in Render |
| Render subdomain taken | Accept suffix; update `VITE_API_BASE_URL` in Vercel and redeploy |
| Cold-start UX (30–50s on first visit after sleep) | Documented; no code changes in this spec. Users will see empty content briefly |
| Render filesystem is ephemeral | Out of scope; contact form submissions are lost on redeploy. Flagged for future work |
| CORS misconfigured after URL reconciliation | Browser console will show CORS error; fix is a one-line env var update + Render redeploy |
| `VITE_API_BASE_URL` not set at build time on Vercel | Build succeeds but frontend calls fail in prod. Mitigation: set the env var *before* first `vercel --prod` |

## Out of Scope (Future Work)

- Persistent storage for contact form submissions (e.g., Render Postgres, or SMTP email).
- Custom domain.
- Render paid tier / always-on service.
- Frontend loading states for slow first-fetch (would mitigate cold-start UX).
- CI/CD verification on pull requests.
