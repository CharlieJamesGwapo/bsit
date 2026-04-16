# MOIST College of Information Technology — IT Days 2026 Website

## Overview

A fully functional, responsive, dynamic website for the College of Information Technology at Misamis Oriental Institute of Science and Technology (MOIST), Inc. The site showcases the college's identity, program information, and the IT Days 2026 event series.

**Theme:** "Connecting Through Technology, Inspiring Innovation and Collaboration"

**Target Users:** Students, prospective students, faculty, and visitors — user-facing only, no admin panel.

## Tech Stack

- **Frontend:** React 18+ with Vite, TypeScript, Tailwind CSS, React Router v6
- **Backend:** Go with Gin framework, REST API
- **Data Storage:** JSON files on disk (events.json, instructors.json, info.json, messages.json)
- **Static Assets:** Served by Go (images, built React app in production)
- **Dev Workflow:** React dev server proxies API calls to Go during development

## Project Structure

```
bsit/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── InstructorCard.tsx
│   │   │   ├── CountdownTimer.tsx
│   │   │   ├── SectionHeader.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── Timeline.tsx
│   │   │   └── ContactForm.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── EventsPage.tsx
│   │   │   ├── EventDetailPage.tsx
│   │   │   ├── InstructorsPage.tsx
│   │   │   └── ContactPage.tsx
│   │   ├── hooks/
│   │   │   └── useCountdown.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
├── backend/
│   ├── main.go
│   ├── handlers/
│   │   ├── events.go
│   │   ├── instructors.go
│   │   ├── contact.go
│   │   └── info.go
│   ├── models/
│   │   └── models.go
│   ├── data/
│   │   ├── events.json
│   │   ├── instructors.json
│   │   ├── info.json
│   │   └── messages.json
│   └── static/
│       └── images/
│           ├── logo.jpg
│           ├── bsit.png
│           ├── basketball.jpg
│           ├── counterstrike.jpg
│           ├── crimping.jpg
│           ├── dance.jpg
│           ├── duet.jpg
│           ├── familyfeud.jpg
│           └── programming.jpg
├── go.mod
└── go.sum
```

## Visual Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Primary (Dark Navy) | `#0a1628` | Main backgrounds, hero, navbar |
| Secondary (Teal) | `#00a5a5` | Buttons, links, accents (from CIT logo) |
| Accent (Gold) | `#c9a84c` | Highlights, borders, hover states, decorative |
| Text Light | `#ffffff` | Text on dark backgrounds |
| Text Dark | `#0a1628` | Text on light backgrounds |
| Surface Light | `#f5f5f5` | Alternating light content sections |
| Surface Dark | `#111d33` | Card backgrounds on dark sections |

### Typography

- **Headings:** Playfair Display (Google Fonts, bold weight) to match the LED wall's premium aesthetic
- **Body:** Clean sans-serif (Inter) for readability
- **Accent text:** Italic serif for taglines and theme text

### Design Elements

- Subtle CSS particle/sparkle animation on hero section (matching LED wall aesthetic)
- Gold gradient borders on cards and section dividers
- Smooth fade/slide-in animations on scroll (Intersection Observer)
- Cards with hover lift effect and gold border glow
- Transparent navbar that becomes solid dark navy on scroll

### Responsive Breakpoints

- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+
- Large: 1280px+

## Pages

### Home Page (`/`)

1. **Hero Section**
   - `bsit.png` as background with dark overlay
   - Logo (`logo.jpg`) centered with subtle gold glow animation
   - Title: "Information Technology Days 2026"
   - Subtitle: "Misamis Oriental Institute of Science and Technology Inc."
   - Theme: "Connecting Through Technology, Inspiring Innovation and Collaboration"
   - Subtle floating particle/sparkle effect (CSS-only)
   - CTA button: "View Events" links to events page

2. **About Preview**
   - Brief vision statement snippet
   - "Learn More" link to About page

3. **Program Objectives Highlights**
   - 6 objectives displayed as icon cards in a grid

4. **Upcoming Events Carousel/Grid**
   - Shows nearest upcoming events with countdown timers
   - Links to full Events page

5. **Instructors Preview**
   - If instructor data exists: show first few instructor cards
   - If empty: styled "Coming Soon" placeholder
   - Link to full Instructors page

6. **Contact Snippet**
   - Address, phone, website
   - Link to Contact page

### About Page (`/about`)

- **Vision** — styled card with teal accent
- **Mission** — styled card with gold accent
- **Core Values** — styled card
- **Program Objectives** — animated list/grid with icons, 6 items:
  1. Pursue a successful career in IT
  2. Demonstrate effective communication skills
  3. Demonstrate professional and ethical responsibilities
  4. Implement computing solutions for real-world problems
  5. Work effectively as individuals or team members
  6. Engage in life-long learning
- College established 2014 badge/note

### Events Page (`/events`)

- **Day Tabs:** "Day 1 — April 17" and "Day 2 — April 18"
- **Timeline View** per day — vertical timeline, events in chronological order
- **Event Cards** with:
  - Poster thumbnail
  - Event name
  - Date, time, venue
  - Category badge (Academic/Sports/Cultural)
  - Countdown timer
- **Category Filter:** Academic (teal), Sports (gold), Cultural (white)
- Click event to go to detail page

**Event Categories:**
- Academic: Crimping Contest, Programming Contest
- Sports: Basketball Tournament, Counter-Strike Tournament
- Cultural: Dance Competition, Duet Singing Contest, Family Feud

### Event Detail Page (`/events/:id`)

- Full poster image
- Event name, date, time, venue
- Live countdown timer (upcoming → "Happening Now" → "Completed")
- Full mechanics/rules list
- Description
- Back to events link

### Instructors Page (`/instructors`)

- Grid of instructor cards fetched from `GET /api/instructors`
- Each card: photo, name, position/title, specialization
- If no data: styled "Coming Soon" message with animated icon
- Data-driven — adding an instructor means adding a JSON entry and dropping a photo in the images folder

### Contact Page (`/contact`)

- **Contact Info:**
  - Address: Sta. Cruz, Cogon, Balingasag, Misamis Oriental
  - Phone: 09974994766
  - Website: moist.ph
- **Contact Form:**
  - Fields: Name, Email, Subject, Message
  - Client-side validation (required fields, email format)
  - Posts to `POST /api/contact`
  - Success/error toast notification

## Shared Components

### Navbar
- Sticky top position
- Transparent on hero, solid dark navy (`#0a1628`) on scroll
- Logo on left, navigation links on right
- Mobile: hamburger icon, slide-in drawer menu
- Active page highlighted with gold underline
- Links: Home, About, Events, Instructors, Contact

### Footer
- Dark navy background
- Logo and college name
- Quick links to all pages
- Contact info (address, phone, website)
- Copyright: "2026 College of Information Technology — MOIST Inc."

### EventCard
- Poster image with aspect ratio preservation
- Event name, date/time, venue
- Category badge color-coded
- Countdown timer
- Hover: lift effect with gold border glow
- Click: navigates to event detail

### InstructorCard
- Circular or rounded photo
- Name, position, specialization
- Hover: subtle scale + gold border

### CountdownTimer
- Displays days, hours, minutes, seconds
- Updates every second
- States: countdown → "Happening Now" (gold pulse) → "Completed" (checkmark)

### SectionHeader
- Consistent heading style: gold accent line, section title, optional subtitle

## Backend API

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/events` | Returns all events |
| GET | `/api/events/:id` | Returns single event by ID |
| GET | `/api/instructors` | Returns all instructors |
| GET | `/api/instructors/:id` | Returns single instructor by ID |
| POST | `/api/contact` | Handles contact form submission |
| GET | `/api/info` | Returns college info (vision, mission, values, objectives, contact) |

### Data Models

**Event:**
```json
{
  "id": "crimping-contest",
  "name": "Crimping Contest",
  "category": "academic",
  "date": "2026-04-17",
  "startTime": "08:00",
  "endTime": "",
  "venue": "MOIST RPV Gym",
  "description": "Test your speed, accuracy, and cable-making skills!",
  "mechanics": [
    "All materials (LAN cable, RJ45 connectors, and tools) will be provided by the department.",
    "Participants are required to create a properly crimped Ethernet cable following the assigned standard (T568A or T568B).",
    "The competition will evaluate both speed and accuracy in cable crimping.",
    "Each completed cable will be tested using a cable tester to verify functionality.",
    "Only cables that pass all tests and are fully functional will be considered valid.",
    "The first participant to successfully complete and pass the cable test will be declared the winner."
  ],
  "image": "crimping.jpg"
}
```

**Instructor:**
```json
{
  "id": "instructor-1",
  "name": "John Doe",
  "position": "Program Head",
  "specialization": "Web Development",
  "photo": "instructor-1.jpg"
}
```

**Contact Message:**
```json
{
  "id": "msg-1713300000",
  "name": "Juan Dela Cruz",
  "email": "juan@example.com",
  "subject": "Inquiry",
  "message": "Hello...",
  "timestamp": "2026-04-16T10:00:00Z"
}
```

**College Info:**
```json
{
  "name": "College of Information Technology",
  "institution": "Misamis Oriental Institute of Science and Technology Inc.",
  "established": 2014,
  "address": "Sta. Cruz, Cogon, Balingasag, Misamis Oriental",
  "phone": "09974994766",
  "website": "moist.ph",
  "vision": "The College of Information Technology envisions providing globally competitive individuals in uplifting technology in the modern world.",
  "mission": "To achieve our vision, the College of Information Technology promotes the institution's ideals to provide well-educated and competent individuals with the opportunity to establish their own way of developing computer-based systems and demonstrate their competence through organizing and participating in technical programs.",
  "coreValues": "The College of Information Technology believes in the capacity of students to promote technological innovations in the community through knowledge of computing; to prove their sense of self-worth in elevating the level of competence and to understand the essence of teamwork in developing computer-based systems.",
  "objectives": [
    "Pursue a successful career in the field of Information Technology.",
    "Demonstrate effective communication skills.",
    "Demonstrate professional and ethical responsibilities towards the environment and society.",
    "Implement computing solutions for real-world problems leading to new innovations in Information Technology.",
    "Work effectively as individuals or as a member of a team in dealing with computer and information technology problems.",
    "Engage in life-long learning to obtain additional qualifications to enhance career positions in IT industries."
  ]
}
```

### Pre-populated Events Data

| ID | Name | Category | Date | Time | Venue |
|----|------|----------|------|------|-------|
| crimping-contest | Crimping Contest | academic | 2026-04-17 | 08:00 AM | MOIST RPV Gym |
| programming-contest | Programming Contest | academic | 2026-04-17 | 09:00 AM | MOIST RPV Gym |
| duet-singing | Duet Singing Contest | cultural | 2026-04-17 | 10:00 AM | RPV Gym |
| dance-competition | Dance Competition | cultural | 2026-04-17 | 03:00-05:00 PM | RPV Gym |
| basketball-tournament | Basketball Tournament | sports | 2026-04-18 | 08:00 AM-12:00 PM | MOIST Court |
| counterstrike-tournament | Counter-Strike Source Tournament | sports | 2026-04-18 | 01:00-03:00 PM | Comlab |
| family-feud | Family Feud | cultural | 2026-04-18 | 04:30-05:30 PM | RPV Gym |

### Static File Serving

- `/images/*` → serves from `backend/static/images/`
- In production: all non-API routes serve the built React app (`backend/static/dist/index.html`)
- CORS enabled for development (React dev server on different port)

### Contact Form Handler

- Validates required fields (name, email, message)
- Validates email format
- Appends message with timestamp to `data/messages.json`
- Returns success/error JSON response

## Interaction Details

### Countdown Timer Logic

```
if now < event.startTime:
  show countdown (days, hours, minutes, seconds)
if now >= event.startTime AND now <= event.endTime:
  show "Happening Now" with gold pulse animation
if now > event.endTime:
  show "Completed" with checkmark icon
```

### Navbar Scroll Behavior

- On hero (scroll position < hero height): transparent background, white text
- Past hero: solid dark navy background with subtle shadow

### Scroll Animations

- Sections fade in + slide up when entering viewport
- Triggered once per element via Intersection Observer
- Staggered delay for grid items (cards appear one by one)

### Event Category Colors

- Academic: teal (`#00a5a5`)
- Sports: gold (`#c9a84c`)
- Cultural: white (`#ffffff`) with subtle border

## Development Workflow

1. Start Go backend: `go run ./backend` (serves on `:8080`)
2. Start React dev server: `cd frontend && npm run dev` (serves on `:5173`, proxies `/api` to `:8080`)
3. For production: `cd frontend && npm run build`, copy `dist/` to `backend/static/dist/`, run Go server

## Out of Scope

- Admin panel / content management
- User authentication / accounts
- Database (SQLite, PostgreSQL, etc.)
- Email sending from contact form
- Photo gallery for past events
- Student organizations section
- News/announcements section
