# Split Deployment (Vercel + Render) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy the MOIST CIT IT Days 2026 website as two services — React SPA on Vercel (`moistbsit.vercel.app`) and Go/Gin API on Render Free tier — with the existing `CharlieJamesGwapo/bsit` GitHub repo as the source of truth.

**Architecture:** Frontend talks directly to the backend via absolute URLs from a build-time `VITE_API_BASE_URL` env var. Backend reads `PORT` and `ALLOWED_ORIGIN` from env so the same binary runs locally and on Render. A centralized `frontend/src/lib/api.ts` helper means dev keeps using the Vite proxy (env var unset → relative URLs) while prod uses absolute URLs.

**Tech Stack:** Go 1.26 (Gin + gin-contrib/cors), Vite 8 + React 19 + TypeScript + Tailwind v4, Vercel Hobby, Render Free, GitHub CLI (`gh`), Vercel CLI.

**Spec reference:** `docs/superpowers/specs/2026-04-18-deploy-split-vercel-render-design.md`

**Note on TDD:** This is a deployment/configuration task with no business logic to unit-test. Verification is per-task: each code change is followed by a "still works locally?" check, and the plan ends with a live end-to-end verification on the deployed URL. No test framework is added.

## File Structure

| Path | Action | Responsibility |
|---|---|---|
| `.gitignore` | Create | Exclude OS junk, node_modules, dist, env files, Go binary |
| `render.yaml` | Create | Render Blueprint: defines the Go web service + env vars |
| `backend/main.go` | Modify | Read `PORT` + `ALLOWED_ORIGIN` from env |
| `frontend/.env.example` | Create | Document `VITE_API_BASE_URL` for future devs |
| `frontend/vercel.json` | Create | SPA fallback rewrite for React Router |
| `frontend/src/lib/api.ts` | Create | Single source of truth for backend URLs |
| `frontend/src/pages/HomePage.tsx` | Modify | Route 3 fetches through `api()` |
| `frontend/src/pages/EventsPage.tsx` | Modify | Route 1 fetch through `api()` |
| `frontend/src/pages/EventDetailPage.tsx` | Modify | Route 1 fetch + 1 image through helpers |
| `frontend/src/pages/InstructorsPage.tsx` | Modify | Route 1 fetch + 1 image through helpers |
| `frontend/src/pages/AboutPage.tsx` | Modify | Route 1 fetch + 1 image through helpers |
| `frontend/src/pages/ContactPage.tsx` | Modify | Route 1 image through `img()` |
| `frontend/src/components/HeroSection.tsx` | Modify | Route 1 fetch + 2 images through helpers |
| `frontend/src/components/ContactForm.tsx` | Modify | Route 1 fetch through `api()` |
| `frontend/src/components/EventCard.tsx` | Modify | Route 1 image through `img()` |
| `frontend/src/components/Timeline.tsx` | Modify | Route 1 image through `img()` |
| `frontend/src/components/Navbar.tsx` | Modify | Route 2 images through `img()` |
| `frontend/src/components/Footer.tsx` | Modify | Route 1 image through `img()` |
| `frontend/src/components/InstructorCard.tsx` | Modify | Route 1 image through `img()` |

---

## Task 1: Create `.gitignore` and Establish Baseline Commit

**Why first:** The repo currently has `frontend/node_modules/`, `frontend/dist/`, `.DS_Store`, and other large/local artifacts as untracked files. Without `.gitignore`, the next `git add -A` would commit hundreds of MB of `node_modules`. We also want a clean baseline commit of the existing app *before* layering deploy changes on top — so the deploy diff is small and reviewable.

**Files:**
- Create: `.gitignore`

- [ ] **Step 1: Create `.gitignore` at repo root**

Create `/Users/a1234/Desktop/bsit/.gitignore` with:

```
# OS
.DS_Store

# Node
node_modules/
frontend/node_modules/
frontend/dist/

# Go build output
app
backend/app

# Local env
.env
.env.local
frontend/.env.local

# Vercel
.vercel/
frontend/.vercel/

# Editor
.vscode/
.idea/
```

- [ ] **Step 2: Verify `.gitignore` excludes the right things**

Run: `git status --short | head -30`

Expected: no `node_modules/`, no `dist/`, no `.DS_Store` lines. You should see things like `M backend/main.go`, `?? .gitignore`, `?? backend/data/`, `?? backend/handlers/`, `?? backend/static/`, `?? frontend/`, `?? frontend/eslint.config.js` (etc.), `?? instructors/`, and the loose `*.jpg`/`*.png` images.

If `frontend/node_modules/` still appears, the gitignore was not picked up — re-check the file path is exactly `/Users/a1234/Desktop/bsit/.gitignore`.

- [ ] **Step 3: Stage and commit baseline (existing app + gitignore)**

Run:
```bash
git add .gitignore
git add backend/ frontend/ instructors/ go.mod go.sum *.jpg *.jpeg *.png
git status --short
```

Expected: all the files you just added show as `A`, nothing as `??`.

Then:
```bash
git commit -m "chore: baseline commit of existing app + .gitignore"
```

Expected: commit succeeds with hundreds of files added. (`backend/main.go` is included with its current "modified" state — that's fine, we're about to modify it again in Task 2.)

---

## Task 2: Backend — Read `PORT` and `ALLOWED_ORIGIN` from env

**Files:**
- Modify: `backend/main.go` (full rewrite — file is small)

- [ ] **Step 1: Replace `backend/main.go` with the env-aware version**

Overwrite `/Users/a1234/Desktop/bsit/backend/main.go` with:

```go
package main

import (
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"moist-cit-website/backend/handlers"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	allowed := os.Getenv("ALLOWED_ORIGIN")
	if allowed == "" {
		allowed = "http://localhost:5173"
	}

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{allowed},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))

	r.Static("/images", "./backend/static/images")

	api := r.Group("/api")
	{
		api.GET("/events", handlers.GetEvents)
		api.GET("/events/:id", handlers.GetEventByID)
		api.GET("/instructors", handlers.GetInstructors)
		api.GET("/instructors/:id", handlers.GetInstructorByID)
		api.GET("/info", handlers.GetInfo)
		api.POST("/contact", handlers.PostContact)
	}

	r.Run(":" + port)
}
```

Only two functional changes vs current state: `port` from `PORT` env (default 8080), `allowed` from `ALLOWED_ORIGIN` env (default localhost:5173). New import: `"os"`.

- [ ] **Step 2: Verify backend compiles**

Run: `go build -o /tmp/bsit-backend-check ./backend && rm /tmp/bsit-backend-check`

Expected: no output, exit 0.

If it fails with "package os not found" or import errors, recheck the import block.

- [ ] **Step 3: Verify backend still runs locally with no env vars**

Run: `go run ./backend &` then in another shell `curl -s http://localhost:8080/api/events | head -c 100`

Expected: JSON output starting with `[{"id":...`. Then kill the background process: `pkill -f 'go-build.*backend' || pkill -f 'exe/backend'`.

- [ ] **Step 4: Commit**

```bash
git add backend/main.go
git commit -m "feat(backend): read PORT and ALLOWED_ORIGIN from env"
```

---

## Task 3: Create `frontend/src/lib/api.ts` URL helper

**Files:**
- Create: `frontend/src/lib/api.ts`

- [ ] **Step 1: Create the helper file**

Create `/Users/a1234/Desktop/bsit/frontend/src/lib/api.ts` with:

```ts
const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export const api = (path: string) => `${BASE}${path}`;
export const img = (filename: string) => `${BASE}/images/${filename}`;
```

When `VITE_API_BASE_URL` is unset (local dev), `BASE` is `""` → `api("/api/events")` returns `/api/events` → Vite proxy in `vite.config.ts` forwards to `localhost:8080`. When set at Vercel build time, returns absolute URLs.

- [ ] **Step 2: Verify TypeScript accepts the file**

Run: `cd frontend && npx tsc --noEmit -p tsconfig.app.json`

Expected: no output, exit 0. If it complains about `import.meta.env`, the project's `vite/client` types may not be loaded — check that `tsconfig.app.json` includes `"types": ["vite/client"]` or the equivalent. (Don't add it speculatively; only if you see the error.)

- [ ] **Step 3: Commit**

```bash
git add frontend/src/lib/api.ts
git commit -m "feat(frontend): add api/img URL helpers for split deploy"
```

---

## Task 4: Sweep — route all 9 fetch calls through `api()`

**Files (7 unique):**
- Modify: `frontend/src/pages/HomePage.tsx` (3 fetches at lines 73-75)
- Modify: `frontend/src/pages/EventsPage.tsx` (1 fetch at line 30)
- Modify: `frontend/src/pages/EventDetailPage.tsx` (1 fetch at line 19)
- Modify: `frontend/src/pages/InstructorsPage.tsx` (1 fetch at line 33)
- Modify: `frontend/src/pages/AboutPage.tsx` (1 fetch at line 54)
- Modify: `frontend/src/components/HeroSection.tsx` (1 fetch at line 11)
- Modify: `frontend/src/components/ContactForm.tsx` (1 fetch at line 24)

- [ ] **Step 1: `HomePage.tsx`**

Add to imports (after the existing `import type { Event, Instructor, CollegeInfo } from "../types";` line):

```ts
import { api } from "../lib/api";
```

Replace lines 73-75:

Find:
```ts
    fetch("/api/events").then((r) => r.json()).then(setEvents).catch(() => {});
    fetch("/api/instructors").then((r) => r.json()).then(setInstructors).catch(() => {});
    fetch("/api/info").then((r) => r.json()).then(setInfo).catch(() => {});
```

Replace with:
```ts
    fetch(api("/api/events")).then((r) => r.json()).then(setEvents).catch(() => {});
    fetch(api("/api/instructors")).then((r) => r.json()).then(setInstructors).catch(() => {});
    fetch(api("/api/info")).then((r) => r.json()).then(setInfo).catch(() => {});
```

- [ ] **Step 2: `EventsPage.tsx`**

Add `import { api } from "../lib/api";` after the existing imports.

Find: `fetch("/api/events").then((r) => r.json()).then(setEvents).catch(() => {});`
Replace with: `fetch(api("/api/events")).then((r) => r.json()).then(setEvents).catch(() => {});`

- [ ] **Step 3: `EventDetailPage.tsx`**

Add `import { api } from "../lib/api";` after the existing imports.

Find: `fetch(`/api/events/${id}`)`
Replace with: `fetch(api(`/api/events/${id}`))`

- [ ] **Step 4: `InstructorsPage.tsx`**

Add `import { api } from "../lib/api";` after the existing imports.

Find: `fetch("/api/instructors")`
Replace with: `fetch(api("/api/instructors"))`

- [ ] **Step 5: `AboutPage.tsx`**

Add `import { api } from "../lib/api";` after the existing imports.

Find: `fetch("/api/info")`
Replace with: `fetch(api("/api/info"))`

- [ ] **Step 6: `HeroSection.tsx`**

Add to imports (after `import type { Event } from "../types";`):
```ts
import { api } from "../lib/api";
```

Find: `fetch("/api/events").then((r) => r.json()).then(setEvents).catch(() => {});`
Replace with: `fetch(api("/api/events")).then((r) => r.json()).then(setEvents).catch(() => {});`

- [ ] **Step 7: `ContactForm.tsx`**

Add to imports (after `import type { ContactFormData } from "../types";`):
```ts
import { api } from "../lib/api";
```

Find:
```ts
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
```

Replace with:
```ts
      const res = await fetch(api("/api/contact"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
```

- [ ] **Step 8: Verify no `fetch("/api` literals remain**

Run from repo root:
```bash
grep -rn 'fetch("/api' frontend/src
grep -rn "fetch(\`/api" frontend/src
grep -rn "fetch('/api" frontend/src
```

Expected: no output (all converted).

- [ ] **Step 9: TypeScript check**

Run: `cd frontend && npx tsc --noEmit -p tsconfig.app.json`

Expected: no errors.

- [ ] **Step 10: Commit**

```bash
git add frontend/src
git commit -m "refactor(frontend): route all fetch calls through api() helper"
```

---

## Task 5: Sweep — route all 12 image references through `img()`

**Files (10 unique; 4 already touched in Task 4):**
- Modify: `frontend/src/components/EventCard.tsx` (line 25)
- Modify: `frontend/src/components/Timeline.tsx` (line 47)
- Modify: `frontend/src/components/HeroSection.tsx` (lines 50, 146)
- Modify: `frontend/src/components/Navbar.tsx` (lines 37, 108)
- Modify: `frontend/src/components/Footer.tsx` (line 11)
- Modify: `frontend/src/components/InstructorCard.tsx` (line 18)
- Modify: `frontend/src/pages/EventDetailPage.tsx` (line 60)
- Modify: `frontend/src/pages/ContactPage.tsx` (line 79)
- Modify: `frontend/src/pages/InstructorsPage.tsx` (line 93)
- Modify: `frontend/src/pages/AboutPage.tsx` (line 108)

- [ ] **Step 1: `EventCard.tsx`**

Add `import { img } from "../lib/api";` after the existing imports.

Find: `src={\`/images/${event.image}\`}`
Replace with: `src={img(event.image)}`

- [ ] **Step 2: `Timeline.tsx`**

Add `import { img } from "../lib/api";` after the existing imports.

Find: `src={\`/images/${event.image}\`}`
Replace with: `src={img(event.image)}`

- [ ] **Step 3: `HeroSection.tsx` (already has `api` import from Task 4)**

Update the import line from Task 4 to also import `img`:

Find: `import { api } from "../lib/api";`
Replace with: `import { api, img } from "../lib/api";`

Then two replacements:

Find (line ~50): `src="/images/logo.jpg"`
Replace with: `src={img("logo.jpg")}`

Find (line ~146): `src={\`/images/${event.image}\`}`
Replace with: `src={img(event.image)}`

- [ ] **Step 4: `Navbar.tsx`**

Add `import { img } from "../lib/api";` after the existing imports.

There are two `src="/images/logo.jpg"` occurrences (lines ~37 and ~108). Replace both.

Use `replace_all` on the exact string:

Find: `src="/images/logo.jpg"`
Replace with: `src={img("logo.jpg")}`

- [ ] **Step 5: `Footer.tsx`**

Add `import { img } from "../lib/api";` after the existing imports.

Find: `src="/images/logo.jpg"`
Replace with: `src={img("logo.jpg")}`

- [ ] **Step 6: `InstructorCard.tsx`**

Add `import { img } from "../lib/api";` after the existing imports.

Find: `src={\`/images/${instructor.photo}\`}`
Replace with: `src={img(instructor.photo)}`

- [ ] **Step 7: `EventDetailPage.tsx` (already has `api` import from Task 4)**

Update the import line:

Find: `import { api } from "../lib/api";`
Replace with: `import { api, img } from "../lib/api";`

Find: `src={\`/images/${event.image}\`}`
Replace with: `src={img(event.image)}`

- [ ] **Step 8: `ContactPage.tsx`**

Add `import { img } from "../lib/api";` after the existing imports.

Find: `src="/images/logo.jpg"`
Replace with: `src={img("logo.jpg")}`

- [ ] **Step 9: `InstructorsPage.tsx` (already has `api` import from Task 4)**

Update the import line:

Find: `import { api } from "../lib/api";`
Replace with: `import { api, img } from "../lib/api";`

Find: `src={\`/images/${inst.photo}\`}`
Replace with: `src={img(inst.photo)}`

- [ ] **Step 10: `AboutPage.tsx` (already has `api` import from Task 4)**

Update the import line:

Find: `import { api } from "../lib/api";`
Replace with: `import { api, img } from "../lib/api";`

Find: `src="/images/logo.jpg"`
Replace with: `src={img("logo.jpg")}`

- [ ] **Step 11: Verify no raw `/images/` paths remain**

Run from repo root:
```bash
grep -rn '"/images/' frontend/src
grep -rn "'/images/" frontend/src
grep -rn '`/images/' frontend/src
```

Expected: no output. (If `index.html` references `/images/`, that's a static reference Vercel won't have at runtime — flag it. The current `index.html` does *not* reference `/images/`, only `/vite.svg` or similar; verify by `grep -n images frontend/index.html` — expected: no results.)

- [ ] **Step 12: TypeScript check**

Run: `cd frontend && npx tsc --noEmit -p tsconfig.app.json`

Expected: no errors.

- [ ] **Step 13: Commit**

```bash
git add frontend/src
git commit -m "refactor(frontend): route all image src through img() helper"
```

---

## Task 6: Add `frontend/vercel.json` for SPA fallback

**Files:**
- Create: `frontend/vercel.json`

- [ ] **Step 1: Create the file**

Create `/Users/a1234/Desktop/bsit/frontend/vercel.json` with:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Vercel checks the filesystem first (so `/assets/foo.js` still serves the actual file from `dist/assets/foo.js`); the rewrite only kicks in when no file matches — that's how React Router deep-links like `/events/basketball-tournament` work.

- [ ] **Step 2: Commit**

```bash
git add frontend/vercel.json
git commit -m "feat(frontend): add vercel.json SPA fallback"
```

---

## Task 7: Add `frontend/.env.example`

**Files:**
- Create: `frontend/.env.example`

- [ ] **Step 1: Create the file**

Create `/Users/a1234/Desktop/bsit/frontend/.env.example` with:

```
# Set in Vercel → Settings → Environment Variables (Production).
# Leave UNSET in local dev — the Vite proxy in vite.config.ts forwards /api and /images to localhost:8080.
# Example value: https://moistbsit-api.onrender.com
VITE_API_BASE_URL=
```

- [ ] **Step 2: Commit**

```bash
git add frontend/.env.example
git commit -m "docs(frontend): document VITE_API_BASE_URL env var"
```

---

## Task 8: Add `render.yaml` Blueprint

**Files:**
- Create: `render.yaml` (repo root)

- [ ] **Step 1: Create the Blueprint**

Create `/Users/a1234/Desktop/bsit/render.yaml` with:

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

Render auto-injects `PORT`; the Go code reads it. The build runs from repo root, producing `./app`; the start command runs from repo root, so the relative path `./backend/static/images` in `main.go` resolves correctly.

- [ ] **Step 2: Verify Blueprint syntax (optional but cheap)**

Run: `cat render.yaml` and visually confirm indentation is 2 spaces, no tabs.

- [ ] **Step 3: Commit**

```bash
git add render.yaml
git commit -m "feat(infra): add Render Blueprint for Go API"
```

---

## Task 9: Local end-to-end smoke test

**Files:** none (verification only)

- [ ] **Step 1: Start backend in one terminal**

Run from repo root: `go run ./backend`

Expected: Gin output, listens on `:8080`. Leave running.

- [ ] **Step 2: Start frontend dev server in another terminal**

Run: `cd frontend && npm run dev`

Expected: Vite output, server on `http://localhost:5173`. Leave running.

- [ ] **Step 3: Browser walkthrough**

Open `http://localhost:5173` and check each page:

| Page | What to verify |
|---|---|
| `/` (Home) | Hero loads, events list appears, instructors strip appears, info section shows. Logo image renders. |
| `/events` | Event cards render with images. |
| `/events/basketball-tournament` (or any event id) | Detail page loads with event image. |
| `/instructors` | Instructor cards render with photos. |
| `/about` | College info loads, logo renders. |
| `/contact` | Page renders with logo. Submit a test message → see "Sent" / success state. |

If any image is broken or any page hangs on data load, the helper is wired wrong. Open DevTools Network tab — URLs should be like `/api/events` and `/images/logo.jpg` (relative — env var is unset locally).

- [ ] **Step 4: Stop both servers**

`Ctrl-C` in both terminals.

- [ ] **Step 5: No commit (verification only)**

If anything failed in Step 3, fix it before continuing — do not deploy a broken local build.

---

## Task 10: Push to GitHub

**Files:** none (git operations only)

- [ ] **Step 1: Add the GitHub remote**

Run from repo root:
```bash
git remote add origin git@github.com:CharlieJamesGwapo/bsit.git
git remote -v
```

Expected: two lines showing `origin` for fetch and push.

- [ ] **Step 2: Confirm branch is `main`**

Run: `git branch --show-current`

Expected: `main`. If not, run `git branch -M main`.

- [ ] **Step 3: Push**

Run: `git push -u origin main`

Expected: push succeeds, branch tracking set up.

If the push is rejected because the GitHub repo has a default branch with a starter commit (README/license), reconcile with: `git pull --rebase origin main` then push again. If the rebase fails because of unrelated histories, run `git pull origin main --allow-unrelated-histories`, resolve any conflicts, commit, then push.

- [ ] **Step 4: Verify on GitHub**

Run: `gh repo view CharlieJamesGwapo/bsit --web` (opens browser) — confirm files are visible and `render.yaml` is at the root.

---

## Task 11: Deploy to Render via Blueprint (one-time dashboard step)

**Files:** none (dashboard action)

- [ ] **Step 1: Open Render Blueprints**

Visit https://dashboard.render.com/blueprints in a browser. Sign in if needed.

- [ ] **Step 2: New Blueprint Instance**

Click **"New Blueprint Instance"**. Connect GitHub if not already connected. Select the **`bsit`** repo. Render will read `render.yaml` and show the planned service `moistbsit-api`.

Click **"Apply"**.

- [ ] **Step 3: Wait for first build**

The build runs `go build -o app ./backend`. Watch the build log in the Render dashboard. Expected duration: 2–4 minutes for first build (Go module downloads).

If the build fails, the most likely causes are:
- Go version mismatch — `go.mod` declares `go 1.26.2`. Render's default Go version may be older. Fix: add a `GOLANG_VERSION` env var in the Render service to `1.26.2` and rebuild. Alternatively, lower the `go.mod` directive to a Render-supported version.
- Build path wrong — re-check `buildCommand` and `startCommand` in `render.yaml`.

- [ ] **Step 4: Record the service URL**

Once the service is "Live", note its URL. It will look like `https://moistbsit-api.onrender.com` or with a suffix if the name was taken (e.g., `https://moistbsit-api-xyz.onrender.com`).

Test it: `curl -s https://<your-render-url>/api/events | head -c 100`

Expected: JSON output (may take 30–50s on first call due to cold start). If you get HTML or "Application failed to respond," check the Render service logs.

- [ ] **Step 5: No commit (deploy step)**

---

## Task 12: Deploy to Vercel via CLI

**Files:** none (CLI deploy)

- [ ] **Step 1: Link the frontend to a Vercel project**

Run from repo root:
```bash
cd frontend
vercel link
```

When prompted:
- Set up and deploy? **Yes**
- Which scope? Pick your account (`capstonee2-8767` or whatever the active scope is)
- Link to existing project? **No**
- Project name? Enter **`moistbsit`**
- In which directory is your code located? `./` (the current `frontend` dir)
- Want to modify settings? **No** (Vite is auto-detected: build = `npm run build`, output = `dist`)

This creates `frontend/.vercel/` (already gitignored).

- [ ] **Step 2: Set the production env var**

Run:
```bash
vercel env add VITE_API_BASE_URL production
```

When prompted for the value, paste the Render URL from Task 11 step 4 (e.g., `https://moistbsit-api.onrender.com`). No trailing slash.

- [ ] **Step 3: Deploy to production**

Run from `frontend/`:
```bash
vercel --prod
```

Expected: Vercel uploads, builds (~1–2 min), prints the production URL. It will be either `https://moistbsit.vercel.app` (if the subdomain was free) or a suffixed variant.

- [ ] **Step 4: Record the production URL**

Note the URL printed by `vercel --prod`. You'll need it for Task 13.

- [ ] **Step 5: No commit (deploy step)**

---

## Task 13: Reconcile CORS and verify end-to-end

**Files:** none (env var update + verification)

- [ ] **Step 1: Compare actual Vercel URL to `ALLOWED_ORIGIN`**

If the production URL from Task 12 step 4 is exactly `https://moistbsit.vercel.app`, skip to Step 4 — `render.yaml` already allows that origin.

If it's anything else (e.g., `https://moistbsit-capstonee2-8767.vercel.app`), continue to Step 2.

- [ ] **Step 2: Update Render's `ALLOWED_ORIGIN` env var**

Open the Render dashboard → `moistbsit-api` service → **Environment** tab. Edit `ALLOWED_ORIGIN` to the actual Vercel production URL (no trailing slash). Save.

Render will trigger a redeploy automatically (~30–60s).

- [ ] **Step 3: Also update `render.yaml` in the repo to match**

Edit `render.yaml`, change the `value:` under `ALLOWED_ORIGIN` to the actual Vercel URL. Then:
```bash
git add render.yaml
git commit -m "chore(infra): point ALLOWED_ORIGIN at actual Vercel URL"
git push
```

This keeps the Blueprint and the deployed env var in sync.

- [ ] **Step 4: End-to-end browser verification**

Open the Vercel production URL in a browser. Walk through:

| Check | Expected |
|---|---|
| Home page loads | Hero appears immediately (CDN). API data loads after Render wakes (30–50s on first visit). |
| DevTools Network — `/api/events` request | Request URL is the Render URL. Status 200. Response is JSON. |
| DevTools Console | No CORS errors. |
| Image rendering | Logo and event/instructor photos load (URLs go to Render). |
| `/events/<id>` direct URL | Loads (vercel.json SPA fallback works). |
| Contact form submission | POST to `<render-url>/api/contact` returns 200. UI shows success. |

- [ ] **Step 5: If CORS error appears**

Browser console will say something like *"Access to fetch at 'https://moistbsit-api.onrender.com/api/events' from origin 'https://...' has been blocked by CORS policy"*. The blocked origin shown is what `ALLOWED_ORIGIN` must be set to. Repeat Step 2 with that value, redeploy, refresh.

- [ ] **Step 6: Final commit (only if Step 3 wasn't already done)**

If `render.yaml` already matches the deployed `ALLOWED_ORIGIN`, no commit needed — work is done.

---

## Done

After Task 13, both services are live and auto-deploying on every `git push origin main`. Future code changes flow through:

- Frontend change → push → Vercel auto-builds and deploys
- Backend change → push → Render auto-builds and deploys
- `render.yaml` change (e.g., env var update) → push → Render applies on next deploy

Cold starts remain a known UX rough edge (out of scope per the spec).
