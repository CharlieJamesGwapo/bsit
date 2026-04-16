# MOIST CIT IT Days 2026 Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully functional, responsive React + Go website for the College of Information Technology at MOIST, showcasing the IT Days 2026 event series.

**Architecture:** React SPA (Vite + TypeScript + Tailwind CSS) communicates with a Go REST API (Gin). Data is stored in JSON files. Go serves both the API and static assets (images + built React app in production).

**Tech Stack:** React 18, Vite, TypeScript, Tailwind CSS, React Router v6, Go, Gin, JSON file storage

**Spec:** `docs/superpowers/specs/2026-04-16-moist-cit-website-design.md`

---

## File Map

### Backend (`backend/`)

| File | Responsibility |
|------|---------------|
| `backend/main.go` | Entry point: Gin router, CORS, static file serving, route registration |
| `backend/models/models.go` | Go structs for Event, Instructor, ContactMessage, CollegeInfo |
| `backend/handlers/events.go` | GET `/api/events`, GET `/api/events/:id` — reads `data/events.json` |
| `backend/handlers/instructors.go` | GET `/api/instructors`, GET `/api/instructors/:id` — reads `data/instructors.json` |
| `backend/handlers/info.go` | GET `/api/info` — reads `data/info.json` |
| `backend/handlers/contact.go` | POST `/api/contact` — validates + appends to `data/messages.json` |
| `backend/handlers/events_test.go` | Tests for events handlers |
| `backend/handlers/contact_test.go` | Tests for contact handler validation |
| `backend/data/events.json` | Pre-populated 7 events |
| `backend/data/instructors.json` | Empty array `[]` |
| `backend/data/info.json` | College vision, mission, values, objectives, contact |
| `backend/data/messages.json` | Empty array `[]` |
| `backend/static/images/` | All image assets (copied from project root) |

### Frontend (`frontend/`)

| File | Responsibility |
|------|---------------|
| `frontend/src/types/index.ts` | TypeScript interfaces: Event, Instructor, CollegeInfo, ContactMessage |
| `frontend/src/hooks/useCountdown.ts` | Countdown timer logic — returns days/hours/minutes/seconds + status |
| `frontend/src/components/Navbar.tsx` | Sticky navbar with transparent→solid scroll behavior, mobile hamburger |
| `frontend/src/components/Footer.tsx` | Site footer with links, contact info, copyright |
| `frontend/src/components/SectionHeader.tsx` | Reusable section heading with gold accent line |
| `frontend/src/components/CountdownTimer.tsx` | Renders countdown/happening-now/completed using useCountdown |
| `frontend/src/components/HeroSection.tsx` | Full-viewport hero with background, logo, sparkle particles, CTA |
| `frontend/src/components/EventCard.tsx` | Event poster card with category badge, countdown, hover effects |
| `frontend/src/components/Timeline.tsx` | Vertical timeline for day schedule |
| `frontend/src/components/InstructorCard.tsx` | Instructor photo card with hover effects |
| `frontend/src/components/ContactForm.tsx` | Contact form with validation and API submission |
| `frontend/src/pages/HomePage.tsx` | Hero + about preview + objectives + events grid + instructors preview + contact snippet |
| `frontend/src/pages/AboutPage.tsx` | Vision, mission, values, objectives cards |
| `frontend/src/pages/EventsPage.tsx` | Day tabs + timeline + category filter + event cards |
| `frontend/src/pages/EventDetailPage.tsx` | Single event: poster, details, countdown, mechanics |
| `frontend/src/pages/InstructorsPage.tsx` | Instructor grid or "Coming Soon" |
| `frontend/src/pages/ContactPage.tsx` | Contact info + contact form |
| `frontend/src/App.tsx` | React Router setup, layout with Navbar + Footer |
| `frontend/src/main.tsx` | Entry point, render App |
| `frontend/src/index.css` | Tailwind directives + custom CSS (particles, animations) |
| `frontend/vite.config.ts` | Vite config with API proxy to Go backend |
| `frontend/tailwind.config.js` | Custom colors, fonts, breakpoints |
| `frontend/package.json` | Dependencies |

---

## Task 1: Project Scaffolding — Go Backend

**Files:**
- Create: `backend/main.go`
- Create: `backend/models/models.go`
- Create: `go.mod`

- [ ] **Step 1: Initialize Go module**

```bash
cd /Users/a1234/Desktop/bsit
go mod init moist-cit-website
```

Expected: Creates `go.mod` with `module moist-cit-website`

- [ ] **Step 2: Install Gin**

```bash
cd /Users/a1234/Desktop/bsit
go get github.com/gin-gonic/gin
go get github.com/gin-contrib/cors
```

Expected: `go.sum` created, packages downloaded

- [ ] **Step 3: Create data models**

Create `backend/models/models.go`:

```go
package models

type Event struct {
	ID          string   `json:"id"`
	Name        string   `json:"name"`
	Category    string   `json:"category"`
	Date        string   `json:"date"`
	StartTime   string   `json:"startTime"`
	EndTime     string   `json:"endTime"`
	Venue       string   `json:"venue"`
	Description string   `json:"description"`
	Mechanics   []string `json:"mechanics"`
	Image       string   `json:"image"`
}

type Instructor struct {
	ID             string `json:"id"`
	Name           string `json:"name"`
	Position       string `json:"position"`
	Specialization string `json:"specialization"`
	Photo          string `json:"photo"`
}

type ContactMessage struct {
	ID        string `json:"id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	Subject   string `json:"subject"`
	Message   string `json:"message"`
	Timestamp string `json:"timestamp"`
}

type CollegeInfo struct {
	Name         string   `json:"name"`
	Institution  string   `json:"institution"`
	Established  int      `json:"established"`
	Address      string   `json:"address"`
	Phone        string   `json:"phone"`
	Website      string   `json:"website"`
	Vision       string   `json:"vision"`
	Mission      string   `json:"mission"`
	CoreValues   string   `json:"coreValues"`
	Objectives   []string `json:"objectives"`
}
```

- [ ] **Step 4: Create minimal main.go**

Create `backend/main.go`:

```go
package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))

	r.Static("/images", "./backend/static/images")

	api := r.Group("/api")
	{
		api.GET("/ping", func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "pong"})
		})
	}

	r.Run(":8080")
}
```

- [ ] **Step 5: Verify Go server starts**

```bash
cd /Users/a1234/Desktop/bsit
go run ./backend
```

Expected: Server starts on `:8080`, `curl http://localhost:8080/api/ping` returns `{"message":"pong"}`

- [ ] **Step 6: Commit**

```bash
git add go.mod go.sum backend/main.go backend/models/models.go
git commit -m "feat: scaffold Go backend with Gin, data models, and ping endpoint"
```

---

## Task 2: Go Backend — JSON Data Files

**Files:**
- Create: `backend/data/events.json`
- Create: `backend/data/instructors.json`
- Create: `backend/data/info.json`
- Create: `backend/data/messages.json`

- [ ] **Step 1: Create events.json with all 7 events**

Create `backend/data/events.json`:

```json
[
  {
    "id": "crimping-contest",
    "name": "Crimping Contest",
    "category": "academic",
    "date": "2026-04-17",
    "startTime": "08:00",
    "endTime": "09:00",
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
  },
  {
    "id": "programming-contest",
    "name": "Programming Contest",
    "category": "academic",
    "date": "2026-04-17",
    "startTime": "09:00",
    "endTime": "12:00",
    "venue": "MOIST RPV Gym",
    "description": "Test your logic, coding speed, and problem-solving skills!",
    "mechanics": [
      "Participants must solve the given programming problems within the allotted time.",
      "Only approved programming languages may be used.",
      "Outside assistance is not allowed.",
      "The first participant to correctly complete all required problems will be declared the winner.",
      "Final submissions must be made before the time limit.",
      "Only correct and fully functional solutions will be considered valid."
    ],
    "image": "programming.jpg"
  },
  {
    "id": "duet-singing",
    "name": "Duet Singing Contest",
    "category": "cultural",
    "date": "2026-04-17",
    "startTime": "10:00",
    "endTime": "12:00",
    "venue": "RPV Gym",
    "description": "Let's watch and listen! Show your vocal talent in this duet singing competition.",
    "mechanics": [
      "Each entry must consist of two performers (duet).",
      "Song choice is open to any genre.",
      "Performances will be judged on vocal quality, harmony, and stage presence.",
      "Each team must have a representative."
    ],
    "image": "duet.jpg"
  },
  {
    "id": "dance-competition",
    "name": "Dance Competition",
    "category": "cultural",
    "date": "2026-04-17",
    "startTime": "15:00",
    "endTime": "17:00",
    "venue": "RPV Gym",
    "description": "Open style dance competition — show your moves!",
    "mechanics": [
      "Category: Open Style.",
      "Minimum performance time of 3 minutes.",
      "Each team must have a representative.",
      "Performances will be judged on creativity, synchronization, and entertainment value."
    ],
    "image": "dance.jpg"
  },
  {
    "id": "basketball-tournament",
    "name": "Basketball Tournament",
    "category": "sports",
    "date": "2026-04-18",
    "startTime": "08:00",
    "endTime": "12:00",
    "venue": "MOIST Court",
    "description": "Basketball men with muse — each team must have a representative!",
    "mechanics": [
      "Basketball Men with Muse(Men).",
      "Each team must have a representative.",
      "Standard basketball rules apply.",
      "Champion prize will be awarded."
    ],
    "image": "basketball.jpg"
  },
  {
    "id": "counterstrike-tournament",
    "name": "Counter-Strike Source Tournament",
    "category": "sports",
    "date": "2026-04-18",
    "startTime": "13:00",
    "endTime": "15:00",
    "venue": "Comlab",
    "description": "Compete in Counter-Strike Source for the championship!",
    "mechanics": [
      "Participants may form teams with members from any year level, section, or group.",
      "Teams are not restricted to pre-assigned groups.",
      "Standard Counter-Strike Source competitive rules apply.",
      "Champion prize will be awarded."
    ],
    "image": "counterstrike.jpg"
  },
  {
    "id": "family-feud",
    "name": "Family Feud",
    "category": "cultural",
    "date": "2026-04-18",
    "startTime": "16:30",
    "endTime": "17:30",
    "venue": "RPV Gym",
    "description": "The classic game show — test your knowledge and teamwork!",
    "mechanics": [
      "Each team must have 5 representatives and 1 instructor.",
      "Standard Family Feud rules apply.",
      "Questions will cover general knowledge and IT-related topics.",
      "Champion prize will be awarded."
    ],
    "image": "familyfeud.jpg"
  }
]
```

- [ ] **Step 2: Create instructors.json (empty)**

Create `backend/data/instructors.json`:

```json
[]
```

- [ ] **Step 3: Create info.json**

Create `backend/data/info.json`:

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

- [ ] **Step 4: Create messages.json (empty)**

Create `backend/data/messages.json`:

```json
[]
```

- [ ] **Step 5: Copy images to static directory**

```bash
mkdir -p /Users/a1234/Desktop/bsit/backend/static/images
cp /Users/a1234/Desktop/bsit/logo.jpg /Users/a1234/Desktop/bsit/backend/static/images/
cp /Users/a1234/Desktop/bsit/bsit.png /Users/a1234/Desktop/bsit/backend/static/images/
cp /Users/a1234/Desktop/bsit/basketball.jpg /Users/a1234/Desktop/bsit/backend/static/images/
cp /Users/a1234/Desktop/bsit/counterstrike.jpg /Users/a1234/Desktop/bsit/backend/static/images/
cp /Users/a1234/Desktop/bsit/crimping.jpg /Users/a1234/Desktop/bsit/backend/static/images/
cp /Users/a1234/Desktop/bsit/dance.jpg /Users/a1234/Desktop/bsit/backend/static/images/
cp /Users/a1234/Desktop/bsit/duet.jpg /Users/a1234/Desktop/bsit/backend/static/images/
cp /Users/a1234/Desktop/bsit/familyfeud.jpg /Users/a1234/Desktop/bsit/backend/static/images/
cp /Users/a1234/Desktop/bsit/programming.jpg /Users/a1234/Desktop/bsit/backend/static/images/
```

- [ ] **Step 6: Commit**

```bash
git add backend/data/ backend/static/images/
git commit -m "feat: add JSON data files and copy image assets"
```

---

## Task 3: Go Backend — API Handlers

**Files:**
- Create: `backend/handlers/events.go`
- Create: `backend/handlers/instructors.go`
- Create: `backend/handlers/info.go`
- Create: `backend/handlers/contact.go`
- Create: `backend/handlers/events_test.go`
- Create: `backend/handlers/contact_test.go`
- Modify: `backend/main.go`

- [ ] **Step 1: Write failing test for events handler**

Create `backend/handlers/events_test.go`:

```go
package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"moist-cit-website/backend/models"
)

func setupTestRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.GET("/api/events", GetEvents)
	r.GET("/api/events/:id", GetEventByID)
	return r
}

func TestGetEvents(t *testing.T) {
	DataDir = "../../backend/data"
	r := setupTestRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/events", nil)
	r.ServeHTTP(w, req)

	if w.Code != 200 {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	var events []models.Event
	err := json.Unmarshal(w.Body.Bytes(), &events)
	if err != nil {
		t.Fatalf("failed to parse response: %v", err)
	}

	if len(events) != 7 {
		t.Fatalf("expected 7 events, got %d", len(events))
	}

	if events[0].ID != "crimping-contest" {
		t.Errorf("expected first event ID 'crimping-contest', got '%s'", events[0].ID)
	}
}

func TestGetEventByID(t *testing.T) {
	DataDir = "../../backend/data"
	r := setupTestRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/events/basketball-tournament", nil)
	r.ServeHTTP(w, req)

	if w.Code != 200 {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	var event models.Event
	err := json.Unmarshal(w.Body.Bytes(), &event)
	if err != nil {
		t.Fatalf("failed to parse response: %v", err)
	}

	if event.Name != "Basketball Tournament" {
		t.Errorf("expected 'Basketball Tournament', got '%s'", event.Name)
	}
}

func TestGetEventByID_NotFound(t *testing.T) {
	DataDir = "../../backend/data"
	r := setupTestRouter()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/api/events/nonexistent", nil)
	r.ServeHTTP(w, req)

	if w.Code != 404 {
		t.Fatalf("expected status 404, got %d", w.Code)
	}
}
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/a1234/Desktop/bsit
go test ./backend/handlers/ -v
```

Expected: FAIL — `GetEvents` and `GetEventByID` not defined

- [ ] **Step 3: Implement events handler**

Create `backend/handlers/events.go`:

```go
package handlers

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"moist-cit-website/backend/models"
)

var DataDir = "./backend/data"

func GetEvents(c *gin.Context) {
	data, err := os.ReadFile(DataDir + "/events.json")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read events"})
		return
	}

	var events []models.Event
	if err := json.Unmarshal(data, &events); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse events"})
		return
	}

	c.JSON(http.StatusOK, events)
}

func GetEventByID(c *gin.Context) {
	id := c.Param("id")

	data, err := os.ReadFile(DataDir + "/events.json")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read events"})
		return
	}

	var events []models.Event
	if err := json.Unmarshal(data, &events); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse events"})
		return
	}

	for _, event := range events {
		if event.ID == id {
			c.JSON(http.StatusOK, event)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "event not found"})
}
```

- [ ] **Step 4: Run events tests to verify they pass**

```bash
cd /Users/a1234/Desktop/bsit
go test ./backend/handlers/ -v -run TestGet
```

Expected: All 3 tests PASS

- [ ] **Step 5: Write failing test for contact handler**

Create `backend/handlers/contact_test.go`:

```go
package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
)

func setupContactRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/api/contact", PostContact)
	return r
}

func TestPostContact_Valid(t *testing.T) {
	tmpDir := t.TempDir()
	DataDir = tmpDir

	// Create empty messages.json
	os.WriteFile(tmpDir+"/messages.json", []byte("[]"), 0644)

	r := setupContactRouter()

	body := map[string]string{
		"name":    "Test User",
		"email":   "test@example.com",
		"subject": "Test",
		"message": "Hello world",
	}
	jsonBody, _ := json.Marshal(body)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/contact", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	if w.Code != 200 {
		t.Fatalf("expected status 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestPostContact_MissingName(t *testing.T) {
	tmpDir := t.TempDir()
	DataDir = tmpDir
	os.WriteFile(tmpDir+"/messages.json", []byte("[]"), 0644)

	r := setupContactRouter()

	body := map[string]string{
		"email":   "test@example.com",
		"message": "Hello",
	}
	jsonBody, _ := json.Marshal(body)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/contact", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	if w.Code != 400 {
		t.Fatalf("expected status 400, got %d", w.Code)
	}
}

func TestPostContact_InvalidEmail(t *testing.T) {
	tmpDir := t.TempDir()
	DataDir = tmpDir
	os.WriteFile(tmpDir+"/messages.json", []byte("[]"), 0644)

	r := setupContactRouter()

	body := map[string]string{
		"name":    "Test",
		"email":   "not-an-email",
		"message": "Hello",
	}
	jsonBody, _ := json.Marshal(body)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/api/contact", bytes.NewBuffer(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	r.ServeHTTP(w, req)

	if w.Code != 400 {
		t.Fatalf("expected status 400, got %d", w.Code)
	}
}
```

- [ ] **Step 6: Run contact tests to verify they fail**

```bash
cd /Users/a1234/Desktop/bsit
go test ./backend/handlers/ -v -run TestPostContact
```

Expected: FAIL — `PostContact` not defined

- [ ] **Step 7: Implement contact handler**

Create `backend/handlers/contact.go`:

```go
package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"regexp"
	"time"

	"github.com/gin-gonic/gin"
	"moist-cit-website/backend/models"
)

var emailRegex = regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)

func PostContact(c *gin.Context) {
	var input struct {
		Name    string `json:"name"`
		Email   string `json:"email"`
		Subject string `json:"subject"`
		Message string `json:"message"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	if input.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if input.Email == "" || !emailRegex.MatchString(input.Email) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "valid email is required"})
		return
	}
	if input.Message == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "message is required"})
		return
	}

	msg := models.ContactMessage{
		ID:        fmt.Sprintf("msg-%d", time.Now().Unix()),
		Name:      input.Name,
		Email:     input.Email,
		Subject:   input.Subject,
		Message:   input.Message,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}

	data, err := os.ReadFile(DataDir + "/messages.json")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read messages"})
		return
	}

	var messages []models.ContactMessage
	if err := json.Unmarshal(data, &messages); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse messages"})
		return
	}

	messages = append(messages, msg)

	output, err := json.MarshalIndent(messages, "", "  ")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to encode messages"})
		return
	}

	if err := os.WriteFile(DataDir+"/messages.json", output, 0644); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to save message"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Message sent successfully", "id": msg.ID})
}
```

- [ ] **Step 8: Run contact tests to verify they pass**

```bash
cd /Users/a1234/Desktop/bsit
go test ./backend/handlers/ -v -run TestPostContact
```

Expected: All 3 tests PASS

- [ ] **Step 9: Implement instructors and info handlers**

Create `backend/handlers/instructors.go`:

```go
package handlers

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"moist-cit-website/backend/models"
)

func GetInstructors(c *gin.Context) {
	data, err := os.ReadFile(DataDir + "/instructors.json")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read instructors"})
		return
	}

	var instructors []models.Instructor
	if err := json.Unmarshal(data, &instructors); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse instructors"})
		return
	}

	c.JSON(http.StatusOK, instructors)
}

func GetInstructorByID(c *gin.Context) {
	id := c.Param("id")

	data, err := os.ReadFile(DataDir + "/instructors.json")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read instructors"})
		return
	}

	var instructors []models.Instructor
	if err := json.Unmarshal(data, &instructors); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse instructors"})
		return
	}

	for _, instructor := range instructors {
		if instructor.ID == id {
			c.JSON(http.StatusOK, instructor)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "instructor not found"})
}
```

Create `backend/handlers/info.go`:

```go
package handlers

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"moist-cit-website/backend/models"
)

func GetInfo(c *gin.Context) {
	data, err := os.ReadFile(DataDir + "/info.json")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read info"})
		return
	}

	var info models.CollegeInfo
	if err := json.Unmarshal(data, &info); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse info"})
		return
	}

	c.JSON(http.StatusOK, info)
}
```

- [ ] **Step 10: Update main.go with all routes**

Replace `backend/main.go`:

```go
package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"moist-cit-website/backend/handlers"
)

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
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

	r.Run(":8080")
}
```

- [ ] **Step 11: Run all tests**

```bash
cd /Users/a1234/Desktop/bsit
go test ./backend/handlers/ -v
```

Expected: All 6 tests PASS

- [ ] **Step 12: Manual verification — start server and test endpoints**

```bash
cd /Users/a1234/Desktop/bsit
go run ./backend &
curl http://localhost:8080/api/events | head -c 200
curl http://localhost:8080/api/events/crimping-contest
curl http://localhost:8080/api/instructors
curl http://localhost:8080/api/info | head -c 200
kill %1
```

Expected: All endpoints return correct JSON data

- [ ] **Step 13: Commit**

```bash
git add backend/handlers/ backend/main.go
git commit -m "feat: implement all Go API handlers with tests (events, instructors, info, contact)"
```

---

## Task 4: Frontend Scaffolding — Vite + React + Tailwind

**Files:**
- Create: `frontend/` (entire Vite project)
- Create: `frontend/tailwind.config.js`
- Create: `frontend/src/types/index.ts`
- Create: `frontend/vite.config.ts`
- Create: `frontend/src/index.css`

- [ ] **Step 1: Create Vite React TypeScript project**

```bash
cd /Users/a1234/Desktop/bsit
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

Expected: `frontend/` created with React + TypeScript template

- [ ] **Step 2: Install dependencies**

```bash
cd /Users/a1234/Desktop/bsit/frontend
npm install react-router-dom
npm install -D tailwindcss @tailwindcss/vite
```

Expected: Packages installed

- [ ] **Step 3: Configure Vite with Tailwind and API proxy**

Replace `frontend/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
      '/images': 'http://localhost:8080',
    },
  },
})
```

- [ ] **Step 4: Configure Tailwind with custom theme**

Replace `frontend/src/index.css`:

```css
@import "tailwindcss";

@theme {
  --color-navy: #0a1628;
  --color-navy-light: #111d33;
  --color-teal: #00a5a5;
  --color-teal-dark: #008585;
  --color-gold: #c9a84c;
  --color-gold-light: #d4b95f;
  --color-surface: #f5f5f5;

  --font-heading: "Playfair Display", serif;
  --font-body: "Inter", sans-serif;
}

@layer base {
  body {
    font-family: var(--font-body);
    color: #0a1628;
    background-color: #ffffff;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-heading);
  }
}

/* Sparkle particle animation for hero */
@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes goldPulse {
  0%, 100% { box-shadow: 0 0 5px rgba(201, 168, 76, 0.3); }
  50% { box-shadow: 0 0 20px rgba(201, 168, 76, 0.6); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-sparkle {
  animation: sparkle 3s ease-in-out infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-gold-pulse {
  animation: goldPulse 2s ease-in-out infinite;
}

/* Staggered animation delays for grid items */
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
.stagger-5 { animation-delay: 0.5s; }
.stagger-6 { animation-delay: 0.6s; }
```

- [ ] **Step 5: Create TypeScript interfaces**

Create `frontend/src/types/index.ts`:

```typescript
export interface Event {
  id: string;
  name: string;
  category: "academic" | "sports" | "cultural";
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  description: string;
  mechanics: string[];
  image: string;
}

export interface Instructor {
  id: string;
  name: string;
  position: string;
  specialization: string;
  photo: string;
}

export interface CollegeInfo {
  name: string;
  institution: string;
  established: number;
  address: string;
  phone: string;
  website: string;
  vision: string;
  mission: string;
  coreValues: string;
  objectives: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type CountdownStatus = "upcoming" | "happening" | "completed";
```

- [ ] **Step 6: Update index.html with Google Fonts**

Replace `frontend/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/jpeg" href="/images/logo.jpg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
    <title>CIT — Information Technology Days 2026</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Set up basic App.tsx with React Router**

Replace `frontend/src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import InstructorsPage from "./pages/InstructorsPage";
import ContactPage from "./pages/ContactPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/instructors" element={<InstructorsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 8: Update main.tsx**

Replace `frontend/src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 9: Create placeholder page and component files so imports don't break**

Create stub files so the app compiles. Each file exports a minimal component:

`frontend/src/components/Navbar.tsx`:
```tsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/events", label: "Events" },
    { to: "/instructors", label: "Instructors" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-navy shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <img src="/images/logo.jpg" alt="CIT Logo" className="h-10 w-10 rounded-full" />
            <span className="text-white font-heading font-bold text-lg hidden sm:block">CIT — MOIST</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "text-gold border-b-2 border-gold pb-1"
                    : "text-white/80 hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-navy border-t border-white/10">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block py-2 px-3 rounded text-sm ${
                  location.pathname === link.to
                    ? "text-gold bg-white/5"
                    : "text-white/80 hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
```

`frontend/src/components/Footer.tsx`:
```tsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-navy text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & name */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/logo.jpg" alt="CIT Logo" className="h-12 w-12 rounded-full" />
              <div>
                <p className="font-heading font-bold">College of Information Technology</p>
                <p className="text-sm text-white/60">MOIST Inc.</p>
              </div>
            </div>
            <p className="text-sm text-white/50">
              Connecting Through Technology, Inspiring Innovation and Collaboration
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-heading font-bold text-gold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About" },
                { to: "/events", label: "Events" },
                { to: "/instructors", label: "Instructors" },
                { to: "/contact", label: "Contact" },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="block text-sm text-white/70 hover:text-gold transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-gold mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm text-white/70">
              <p>Sta. Cruz, Cogon, Balingasag, Misamis Oriental</p>
              <p>Phone: 09974994766</p>
              <p>Website: moist.ph</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/40">
          &copy; 2026 College of Information Technology — MOIST Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

Create placeholder stubs for remaining files (each just returns a `<div>` so the app compiles):

`frontend/src/pages/HomePage.tsx`:
```tsx
export default function HomePage() {
  return <div className="pt-16">HomePage — coming soon</div>;
}
```

`frontend/src/pages/AboutPage.tsx`:
```tsx
export default function AboutPage() {
  return <div className="pt-16">AboutPage — coming soon</div>;
}
```

`frontend/src/pages/EventsPage.tsx`:
```tsx
export default function EventsPage() {
  return <div className="pt-16">EventsPage — coming soon</div>;
}
```

`frontend/src/pages/EventDetailPage.tsx`:
```tsx
export default function EventDetailPage() {
  return <div className="pt-16">EventDetailPage — coming soon</div>;
}
```

`frontend/src/pages/InstructorsPage.tsx`:
```tsx
export default function InstructorsPage() {
  return <div className="pt-16">InstructorsPage — coming soon</div>;
}
```

`frontend/src/pages/ContactPage.tsx`:
```tsx
export default function ContactPage() {
  return <div className="pt-16">ContactPage — coming soon</div>;
}
```

- [ ] **Step 10: Delete default Vite files that are no longer needed**

```bash
rm -f frontend/src/App.css frontend/src/assets/react.svg frontend/public/vite.svg
```

- [ ] **Step 11: Verify frontend builds and runs**

```bash
cd /Users/a1234/Desktop/bsit/frontend
npm run build
```

Expected: Build succeeds with no errors

- [ ] **Step 12: Verify dev server with Go backend**

Start Go backend in background, then start frontend dev server:

```bash
cd /Users/a1234/Desktop/bsit
go run ./backend &
cd frontend && npm run dev
```

Expected: Frontend on `http://localhost:5173`, navbar and footer visible, clicking nav links routes between placeholder pages. API proxy works (`/api/events` returns data).

Kill both processes after testing.

- [ ] **Step 13: Commit**

```bash
cd /Users/a1234/Desktop/bsit
git add frontend/ .gitignore
git commit -m "feat: scaffold React frontend with Vite, Tailwind, Router, Navbar, Footer"
```

---

## Task 5: useCountdown Hook + CountdownTimer Component

**Files:**
- Create: `frontend/src/hooks/useCountdown.ts`
- Create: `frontend/src/components/CountdownTimer.tsx`
- Create: `frontend/src/components/SectionHeader.tsx`

- [ ] **Step 1: Implement useCountdown hook**

Create `frontend/src/hooks/useCountdown.ts`:

```typescript
import { useState, useEffect } from "react";
import type { CountdownStatus } from "../types";

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  status: CountdownStatus;
}

export function useCountdown(date: string, startTime: string, endTime: string): CountdownResult {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const startDate = new Date(`${date}T${startTime}:00`);
  const endDate = endTime ? new Date(`${date}T${endTime}:00`) : new Date(startDate.getTime() + 3600000);

  if (now >= startDate && now <= endDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, status: "happening" };
  }

  if (now > endDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, status: "completed" };
  }

  const diff = startDate.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, status: "upcoming" };
}
```

- [ ] **Step 2: Implement CountdownTimer component**

Create `frontend/src/components/CountdownTimer.tsx`:

```tsx
import { useCountdown } from "../hooks/useCountdown";

interface Props {
  date: string;
  startTime: string;
  endTime: string;
  compact?: boolean;
}

export default function CountdownTimer({ date, startTime, endTime, compact = false }: Props) {
  const { days, hours, minutes, seconds, status } = useCountdown(date, startTime, endTime);

  if (status === "completed") {
    return (
      <div className={`flex items-center gap-2 ${compact ? "text-sm" : "text-lg"} text-white/60`}>
        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span>Completed</span>
      </div>
    );
  }

  if (status === "happening") {
    return (
      <div className={`animate-gold-pulse inline-block px-4 py-2 rounded-full bg-gold/20 border border-gold ${compact ? "text-sm" : "text-lg"}`}>
        <span className="text-gold font-bold">Happening Now</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1 text-sm text-white/70">
        {days > 0 && <span>{days}d</span>}
        <span>{String(hours).padStart(2, "0")}h</span>
        <span>{String(minutes).padStart(2, "0")}m</span>
        <span>{String(seconds).padStart(2, "0")}s</span>
      </div>
    );
  }

  const units = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  return (
    <div className="flex gap-3">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center bg-navy-light/80 rounded-lg px-3 py-2 min-w-[60px]">
          <span className="text-2xl font-bold text-gold">{String(unit.value).padStart(2, "0")}</span>
          <span className="text-xs text-white/50 uppercase">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Implement SectionHeader component**

Create `frontend/src/components/SectionHeader.tsx`:

```tsx
interface Props {
  title: string;
  subtitle?: string;
  light?: boolean;
}

export default function SectionHeader({ title, subtitle, light = false }: Props) {
  return (
    <div className="text-center mb-12">
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="h-px w-12 bg-gold" />
        <h2 className={`font-heading text-3xl md:text-4xl font-bold ${light ? "text-navy" : "text-white"}`}>
          {title}
        </h2>
        <div className="h-px w-12 bg-gold" />
      </div>
      {subtitle && (
        <p className={`text-lg ${light ? "text-navy/60" : "text-white/60"}`}>{subtitle}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
cd /Users/a1234/Desktop/bsit/frontend
npm run build
```

Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
cd /Users/a1234/Desktop/bsit
git add frontend/src/hooks/ frontend/src/components/CountdownTimer.tsx frontend/src/components/SectionHeader.tsx
git commit -m "feat: add useCountdown hook, CountdownTimer, and SectionHeader components"
```

---

## Task 6: HeroSection + HomePage

**Files:**
- Create: `frontend/src/components/HeroSection.tsx`
- Modify: `frontend/src/pages/HomePage.tsx`

- [ ] **Step 1: Implement HeroSection with particles**

Create `frontend/src/components/HeroSection.tsx`:

```tsx
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function HeroSection() {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;

    // Create sparkle particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div");
      particle.className = "absolute rounded-full bg-gold/40 animate-sparkle";
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
      container.appendChild(particle);
    }

    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/bsit.png)" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-navy/85" />

      {/* Gold gradient edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-gold/5" />

      {/* Particles container */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-8 animate-float">
          <img
            src="/images/logo.jpg"
            alt="College of Information Technology"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full mx-auto border-4 border-gold/50 shadow-[0_0_30px_rgba(201,168,76,0.3)]"
          />
        </div>

        {/* Year */}
        <p className="text-gold font-heading text-2xl md:text-3xl italic mb-2">2026</p>

        {/* Institution */}
        <p className="text-white/70 text-sm md:text-base tracking-widest uppercase mb-4">
          Misamis Oriental Institute of Science and Technology Inc.
        </p>

        {/* Title */}
        <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Information Technology
          <br />
          <span className="text-gold">Days</span>
        </h1>

        {/* Theme */}
        <p className="font-heading italic text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Theme: &ldquo;Connecting Through Technology, Inspiring Innovation and Collaboration&rdquo;
        </p>

        {/* CTA */}
        <Link
          to="/events"
          className="inline-block px-8 py-4 bg-teal hover:bg-teal-dark text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,165,165,0.4)] text-lg"
        >
          View Events
        </Link>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Implement full HomePage**

Replace `frontend/src/pages/HomePage.tsx`:

```tsx
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import SectionHeader from "../components/SectionHeader";
import EventCard from "../components/EventCard";
import InstructorCard from "../components/InstructorCard";
import type { Event, Instructor, CollegeInfo } from "../types";

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

const objectives = [
  { icon: "🎯", text: "Pursue a successful career in the field of Information Technology." },
  { icon: "💬", text: "Demonstrate effective communication skills." },
  { icon: "⚖️", text: "Demonstrate professional and ethical responsibilities towards the environment and society." },
  { icon: "💡", text: "Implement computing solutions for real-world problems leading to new innovations." },
  { icon: "🤝", text: "Work effectively as individuals or as a member of a team." },
  { icon: "📚", text: "Engage in life-long learning to enhance career positions in IT industries." },
];

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [info, setInfo] = useState<CollegeInfo | null>(null);

  const aboutRef = useRef<HTMLElement>(null);
  const objectivesRef = useRef<HTMLElement>(null);
  const eventsRef = useRef<HTMLElement>(null);
  const instructorsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const aboutVisible = useInView(aboutRef);
  const objectivesVisible = useInView(objectivesRef);
  const eventsVisible = useInView(eventsRef);
  const instructorsVisible = useInView(instructorsRef);
  const contactVisible = useInView(contactRef);

  useEffect(() => {
    fetch("/api/events").then((r) => r.json()).then(setEvents).catch(() => {});
    fetch("/api/instructors").then((r) => r.json()).then(setInstructors).catch(() => {});
    fetch("/api/info").then((r) => r.json()).then(setInfo).catch(() => {});
  }, []);

  // Get upcoming events (sorted by date/time, max 4)
  const upcomingEvents = [...events]
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.startTime}:00`);
      const dateB = new Date(`${b.date}T${b.startTime}:00`);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 4);

  return (
    <div>
      <HeroSection />

      {/* About Preview */}
      <section ref={aboutRef} className={`py-20 bg-surface transition-all duration-700 ${aboutVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHeader title="About Us" subtitle="College of Information Technology" light />
          <p className="text-navy/70 text-lg leading-relaxed mb-8">
            {info?.vision}
          </p>
          <Link to="/about" className="inline-block px-6 py-3 border-2 border-teal text-teal hover:bg-teal hover:text-white font-semibold rounded-lg transition-all duration-300">
            Learn More
          </Link>
        </div>
      </section>

      {/* Program Objectives */}
      <section ref={objectivesRef} className={`py-20 bg-navy transition-all duration-700 ${objectivesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader title="Program Objectives" subtitle="What we strive to achieve" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((obj, i) => (
              <div
                key={i}
                className={`bg-navy-light rounded-xl p-6 border border-white/5 hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 ${objectivesVisible ? "animate-fade-in-up" : "opacity-0"} stagger-${i + 1}`}
              >
                <div className="text-3xl mb-4">{obj.icon}</div>
                <p className="text-white/80 text-sm leading-relaxed">{obj.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section ref={eventsRef} className={`py-20 bg-surface transition-all duration-700 ${eventsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader title="Upcoming Events" subtitle="IT Days 2026" light />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/events" className="inline-block px-6 py-3 bg-teal hover:bg-teal-dark text-white font-semibold rounded-lg transition-all duration-300">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Instructors Preview */}
      <section ref={instructorsRef} className={`py-20 bg-navy transition-all duration-700 ${instructorsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader title="Our Instructors" subtitle="Meet the faculty" />
          {instructors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {instructors.slice(0, 4).map((instructor) => (
                <InstructorCard key={instructor.id} instructor={instructor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-float">👨‍🏫</div>
              <p className="text-white/50 text-lg">Coming Soon</p>
              <p className="text-white/30 text-sm mt-2">Instructor profiles will be available shortly.</p>
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/instructors" className="inline-block px-6 py-3 border-2 border-gold text-gold hover:bg-gold hover:text-navy font-semibold rounded-lg transition-all duration-300">
              View All Instructors
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Snippet */}
      <section ref={contactRef} className={`py-20 bg-surface transition-all duration-700 ${contactVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <SectionHeader title="Get In Touch" light />
          <div className="flex flex-col sm:flex-row justify-center gap-8 mb-8 text-navy/70">
            <div className="flex items-center gap-2 justify-center">
              <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Sta. Cruz, Cogon, Balingasag, Misamis Oriental</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <svg className="w-5 h-5 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>09974994766</span>
            </div>
          </div>
          <Link to="/contact" className="inline-block px-6 py-3 bg-teal hover:bg-teal-dark text-white font-semibold rounded-lg transition-all duration-300">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Create EventCard component** (needed by HomePage)

Create `frontend/src/components/EventCard.tsx`:

```tsx
import { Link } from "react-router-dom";
import CountdownTimer from "./CountdownTimer";
import type { Event } from "../types";

const categoryColors: Record<string, string> = {
  academic: "bg-teal text-white",
  sports: "bg-gold text-navy",
  cultural: "bg-white/90 text-navy",
};

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  return (
    <Link
      to={`/events/${event.id}`}
      className="group block bg-navy rounded-xl overflow-hidden border border-white/5 hover:border-gold/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(201,168,76,0.15)]"
    >
      {/* Poster */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={`/images/${event.image}`}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[event.category] || "bg-white/80 text-navy"}`}>
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-5">
        <h3 className="font-heading text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors">
          {event.name}
        </h3>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/50 mb-4">
          <span>{new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          <span>{event.startTime}{event.endTime ? ` - ${event.endTime}` : ""}</span>
          <span>{event.venue}</span>
        </div>
        <CountdownTimer date={event.date} startTime={event.startTime} endTime={event.endTime} compact />
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: Create InstructorCard component** (needed by HomePage)

Create `frontend/src/components/InstructorCard.tsx`:

```tsx
import type { Instructor } from "../types";

interface Props {
  instructor: Instructor;
}

export default function InstructorCard({ instructor }: Props) {
  return (
    <div className="group text-center bg-navy-light rounded-xl p-6 border border-white/5 hover:border-gold/30 transition-all duration-300 hover:-translate-y-1">
      <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-3 border-gold/30 group-hover:border-gold transition-colors duration-300">
        <img
          src={`/images/${instructor.photo}`}
          alt={instructor.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <h3 className="font-heading font-bold text-white text-lg">{instructor.name}</h3>
      <p className="text-gold text-sm mt-1">{instructor.position}</p>
      <p className="text-white/50 text-sm mt-1">{instructor.specialization}</p>
    </div>
  );
}
```

- [ ] **Step 5: Verify build and check in browser**

```bash
cd /Users/a1234/Desktop/bsit/frontend
npm run build
```

Expected: Build succeeds. Start both servers, open `http://localhost:5173` — full hero with particles, about preview, objectives grid, event cards with countdowns, instructors "Coming Soon", contact snippet, all visible.

- [ ] **Step 6: Commit**

```bash
cd /Users/a1234/Desktop/bsit
git add frontend/src/
git commit -m "feat: implement HeroSection, HomePage, EventCard, InstructorCard"
```

---

## Task 7: AboutPage

**Files:**
- Modify: `frontend/src/pages/AboutPage.tsx`

- [ ] **Step 1: Implement AboutPage**

Replace `frontend/src/pages/AboutPage.tsx`:

```tsx
import { useEffect, useState, useRef } from "react";
import SectionHeader from "../components/SectionHeader";
import type { CollegeInfo } from "../types";

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

const objectiveIcons = ["🎯", "💬", "⚖️", "💡", "🤝", "📚"];

export default function AboutPage() {
  const [info, setInfo] = useState<CollegeInfo | null>(null);

  const visionRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const objectivesRef = useRef<HTMLElement>(null);

  const visionVisible = useInView(visionRef);
  const missionVisible = useInView(missionRef);
  const valuesVisible = useInView(valuesRef);
  const objectivesVisible = useInView(objectivesRef);

  useEffect(() => {
    fetch("/api/info").then((r) => r.json()).then(setInfo).catch(() => {});
  }, []);

  if (!info) {
    return <div className="pt-24 text-center text-navy/50">Loading...</div>;
  }

  return (
    <div>
      {/* Hero banner */}
      <section className="relative pt-24 pb-16 bg-navy">
        <div className="absolute inset-0 bg-gradient-to-b from-navy via-navy to-navy-light" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <img src="/images/logo.jpg" alt="CIT Logo" className="w-24 h-24 rounded-full mx-auto mb-6 border-3 border-gold/40" />
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">About Us</h1>
          <p className="text-white/50 text-lg">{info.name} — {info.institution}</p>
          <p className="text-gold text-sm mt-2">Established {info.established}</p>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 bg-surface">
        <div className="max-w-4xl mx-auto px-4">
          <div ref={visionRef} className={`bg-white rounded-2xl p-8 md:p-12 shadow-sm border-l-4 border-teal transition-all duration-700 ${visionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4 flex items-center gap-3">
              <span className="text-teal">◆</span> Vision
            </h2>
            <p className="text-navy/70 text-lg leading-relaxed">{info.vision}</p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-navy">
        <div className="max-w-4xl mx-auto px-4">
          <div ref={missionRef} className={`bg-navy-light rounded-2xl p-8 md:p-12 border border-gold/20 transition-all duration-700 ${missionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="text-gold">◆</span> Mission
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">{info.mission}</p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-surface">
        <div className="max-w-4xl mx-auto px-4">
          <div ref={valuesRef} className={`bg-white rounded-2xl p-8 md:p-12 shadow-sm border-l-4 border-gold transition-all duration-700 ${valuesVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4 flex items-center gap-3">
              <span className="text-gold">◆</span> Core Values
            </h2>
            <p className="text-navy/70 text-lg leading-relaxed">{info.coreValues}</p>
          </div>
        </div>
      </section>

      {/* Program Objectives */}
      <section ref={objectivesRef} className="py-20 bg-navy">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader title="Program Objectives" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {info.objectives.map((obj, i) => (
              <div
                key={i}
                className={`bg-navy-light rounded-xl p-6 border border-white/5 hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 ${objectivesVisible ? "animate-fade-in-up" : "opacity-0"} stagger-${i + 1}`}
              >
                <div className="text-3xl mb-4">{objectiveIcons[i]}</div>
                <p className="text-white/80 text-sm leading-relaxed">{obj}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verify build and check in browser**

```bash
cd /Users/a1234/Desktop/bsit/frontend
npm run build
```

Expected: Build succeeds. Navigate to `/about` — hero banner with logo, vision/mission/values cards with animations, objectives grid.

- [ ] **Step 3: Commit**

```bash
cd /Users/a1234/Desktop/bsit
git add frontend/src/pages/AboutPage.tsx
git commit -m "feat: implement AboutPage with vision, mission, values, objectives"
```

---

## Task 8: EventsPage + Timeline

**Files:**
- Create: `frontend/src/components/Timeline.tsx`
- Modify: `frontend/src/pages/EventsPage.tsx`

- [ ] **Step 1: Implement Timeline component**

Create `frontend/src/components/Timeline.tsx`:

```tsx
import { Link } from "react-router-dom";
import CountdownTimer from "./CountdownTimer";
import type { Event } from "../types";

const categoryColors: Record<string, string> = {
  academic: "bg-teal",
  sports: "bg-gold",
  cultural: "bg-white",
};

const categoryTextColors: Record<string, string> = {
  academic: "text-teal",
  sports: "text-gold",
  cultural: "text-white",
};

interface Props {
  events: Event[];
}

export default function Timeline({ events }: Props) {
  const sorted = [...events].sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gold/30 -translate-x-1/2" />

      <div className="space-y-12">
        {sorted.map((event, i) => {
          const isLeft = i % 2 === 0;
          return (
            <div key={event.id} className={`relative flex items-start gap-8 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                <div className={`w-4 h-4 rounded-full ${categoryColors[event.category]} border-2 border-navy shadow-[0_0_10px_rgba(201,168,76,0.3)]`} />
              </div>

              {/* Content card */}
              <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? "md:pr-8" : "md:pl-8"}`}>
                <Link
                  to={`/events/${event.id}`}
                  className="group block bg-navy-light rounded-xl overflow-hidden border border-white/5 hover:border-gold/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Poster thumbnail */}
                    <div className="sm:w-32 sm:h-32 flex-shrink-0">
                      <img
                        src={`/images/${event.image}`}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Details */}
                    <div className="p-4 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold ${categoryTextColors[event.category]}`}>
                          {event.category.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-white text-lg group-hover:text-gold transition-colors">
                        {event.name}
                      </h3>
                      <p className="text-white/50 text-sm mt-1">
                        {event.startTime}{event.endTime ? ` - ${event.endTime}` : ""} • {event.venue}
                      </p>
                      <div className="mt-2">
                        <CountdownTimer date={event.date} startTime={event.startTime} endTime={event.endTime} compact />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Implement EventsPage with tabs and filter**

Replace `frontend/src/pages/EventsPage.tsx`:

```tsx
import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import Timeline from "../components/Timeline";
import EventCard from "../components/EventCard";
import type { Event } from "../types";

type CategoryFilter = "all" | "academic" | "sports" | "cultural";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [activeDay, setActiveDay] = useState<"2026-04-17" | "2026-04-18">("2026-04-17");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [viewMode, setViewMode] = useState<"timeline" | "grid">("timeline");

  useEffect(() => {
    fetch("/api/events").then((r) => r.json()).then(setEvents).catch(() => {});
  }, []);

  const filteredEvents = events.filter((e) => {
    if (e.date !== activeDay) return false;
    if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
    return true;
  });

  const days = [
    { date: "2026-04-17" as const, label: "Day 1 — April 17" },
    { date: "2026-04-18" as const, label: "Day 2 — April 18" },
  ];

  const categories: { value: CategoryFilter; label: string; color: string }[] = [
    { value: "all", label: "All", color: "bg-white/10 text-white" },
    { value: "academic", label: "Academic", color: "bg-teal/20 text-teal" },
    { value: "sports", label: "Sports", color: "bg-gold/20 text-gold" },
    { value: "cultural", label: "Cultural", color: "bg-white/20 text-white" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-24 pb-12 bg-navy">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Events</h1>
          <p className="text-white/50 text-lg">Information Technology Days 2026</p>
        </div>
      </section>

      {/* Controls */}
      <section className="bg-navy border-b border-white/10 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            {/* Day tabs */}
            <div className="flex gap-2">
              {days.map((day) => (
                <button
                  key={day.date}
                  onClick={() => setActiveDay(day.date)}
                  className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
                    activeDay === day.date
                      ? "bg-gold text-navy"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {/* Category filter */}
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategoryFilter(cat.value)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      categoryFilter === cat.value
                        ? cat.color + " ring-1 ring-current"
                        : "bg-white/5 text-white/40 hover:bg-white/10"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* View toggle */}
              <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("timeline")}
                  className={`px-3 py-1 rounded text-xs ${viewMode === "timeline" ? "bg-white/10 text-white" : "text-white/40"}`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1 rounded text-xs ${viewMode === "grid" ? "bg-white/10 text-white" : "text-white/40"}`}
                >
                  Grid
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-16 bg-navy min-h-[50vh]">
        <div className="max-w-6xl mx-auto px-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/40 text-lg">No events match your filter.</p>
            </div>
          ) : viewMode === "timeline" ? (
            <Timeline events={filteredEvents} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Verify build and check in browser**

```bash
cd /Users/a1234/Desktop/bsit/frontend
npm run build
```

Expected: Build succeeds. Navigate to `/events` — day tabs switch between April 17 and 18, category filters work, timeline view shows events chronologically, grid view shows event cards, all countdowns are live.

- [ ] **Step 4: Commit**

```bash
cd /Users/a1234/Desktop/bsit
git add frontend/src/components/Timeline.tsx frontend/src/pages/EventsPage.tsx
git commit -m "feat: implement EventsPage with day tabs, timeline, category filter, grid view"
```

---

## Task 9: EventDetailPage

**Files:**
- Modify: `frontend/src/pages/EventDetailPage.tsx`

- [ ] **Step 1: Implement EventDetailPage**

Replace `frontend/src/pages/EventDetailPage.tsx`:

```tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CountdownTimer from "../components/CountdownTimer";
import type { Event } from "../types";

const categoryColors: Record<string, string> = {
  academic: "bg-teal text-white",
  sports: "bg-gold text-navy",
  cultural: "bg-white/90 text-navy",
};

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="pt-24 text-center text-navy/50">Loading...</div>;
  }

  if (!event) {
    return (
      <div className="pt-24 text-center">
        <h1 className="font-heading text-3xl font-bold text-navy mb-4">Event Not Found</h1>
        <Link to="/events" className="text-teal hover:underline">Back to Events</Link>
      </div>
    );
  }

  const formattedDate = new Date(event.date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div>
      {/* Hero with poster */}
      <section className="relative pt-20 bg-navy">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Link to="/events" className="inline-flex items-center gap-2 text-white/50 hover:text-gold transition-colors mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Poster */}
            <div className="rounded-2xl overflow-hidden border-2 border-gold/20 shadow-[0_0_30px_rgba(201,168,76,0.1)]">
              <img
                src={`/images/${event.image}`}
                alt={event.name}
                className="w-full h-auto"
              />
            </div>

            {/* Details */}
            <div>
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4 ${categoryColors[event.category]}`}>
                {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
              </span>

              <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">{event.name}</h1>
              <p className="text-white/70 text-lg mb-8">{event.description}</p>

              {/* Meta */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-white/60">
                  <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{event.startTime}{event.endTime ? ` - ${event.endTime}` : ""}</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.venue}</span>
                </div>
              </div>

              {/* Countdown */}
              <div className="mb-8">
                <p className="text-white/40 text-sm uppercase tracking-wider mb-3">Event Status</p>
                <CountdownTimer date={event.date} startTime={event.startTime} endTime={event.endTime} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mechanics */}
      {event.mechanics.length > 0 && (
        <section className="py-16 bg-navy-light">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="font-heading text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="text-gold">◆</span> Mechanics & Rules
            </h2>
            <div className="space-y-4">
              {event.mechanics.map((rule, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                    <span className="text-gold font-bold text-sm">{i + 1}</span>
                  </div>
                  <p className="text-white/70 leading-relaxed pt-1">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify build and check in browser**

```bash
cd /Users/a1234/Desktop/bsit/frontend
npm run build
```

Expected: Build succeeds. Click any event card from Events page → detail page shows full poster, details, countdown, mechanics with numbered rules.

- [ ] **Step 3: Commit**

```bash
cd /Users/a1234/Desktop/bsit
git add frontend/src/pages/EventDetailPage.tsx
git commit -m "feat: implement EventDetailPage with poster, countdown, mechanics"
```

---

## Task 10: InstructorsPage

**Files:**
- Modify: `frontend/src/pages/InstructorsPage.tsx`

- [ ] **Step 1: Implement InstructorsPage**

Replace `frontend/src/pages/InstructorsPage.tsx`:

```tsx
import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import InstructorCard from "../components/InstructorCard";
import type { Instructor } from "../types";

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/instructors")
      .then((r) => r.json())
      .then(setInstructors)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-24 pb-12 bg-navy">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Our Instructors</h1>
          <p className="text-white/50 text-lg">Meet the faculty of the College of Information Technology</p>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="py-16 bg-navy min-h-[50vh]">
        <div className="max-w-6xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-white/40 text-lg">Loading...</p>
            </div>
          ) : instructors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {instructors.map((instructor) => (
                <InstructorCard key={instructor.id} instructor={instructor} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-8xl mb-6 animate-float">👨‍🏫</div>
              <h2 className="font-heading text-2xl font-bold text-white mb-3">Coming Soon</h2>
              <p className="text-white/40 text-lg max-w-md mx-auto">
                Instructor profiles are being prepared. Check back soon to meet our dedicated faculty members.
              </p>
              <div className="mt-8 p-6 bg-navy-light rounded-xl border border-white/5 max-w-lg mx-auto text-left">
                <p className="text-white/30 text-sm">
                  <span className="text-gold">For administrators:</span> Add instructor data to{" "}
                  <code className="bg-white/5 px-2 py-0.5 rounded text-xs">backend/data/instructors.json</code>{" "}
                  and drop photos into{" "}
                  <code className="bg-white/5 px-2 py-0.5 rounded text-xs">backend/static/images/</code>.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verify build and check in browser**

```bash
cd /Users/a1234/Desktop/bsit/frontend
npm run build
```

Expected: Build succeeds. Navigate to `/instructors` — shows "Coming Soon" with animated icon and instructions for adding data.

- [ ] **Step 3: Commit**

```bash
cd /Users/a1234/Desktop/bsit
git add frontend/src/pages/InstructorsPage.tsx
git commit -m "feat: implement InstructorsPage with dynamic grid and coming-soon state"
```

---

## Task 11: ContactPage + ContactForm

**Files:**
- Create: `frontend/src/components/ContactForm.tsx`
- Modify: `frontend/src/pages/ContactPage.tsx`

- [ ] **Step 1: Implement ContactForm component**

Create `frontend/src/components/ContactForm.tsx`:

```tsx
import { useState } from "react";
import type { ContactFormData } from "../types";

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});

  function validate(): boolean {
    const newErrors: Partial<ContactFormData> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!form.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send");
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }

  function handleChange(field: keyof ContactFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-navy/70 mb-1">Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border ${errors.name ? "border-red-400" : "border-navy/10"} bg-white focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition-colors`}
          placeholder="Your name"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-navy/70 mb-1">Email *</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-400" : "border-navy/10"} bg-white focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition-colors`}
          placeholder="your.email@example.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-navy/70 mb-1">Subject</label>
        <input
          type="text"
          value={form.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-navy/10 bg-white focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition-colors"
          placeholder="What is this about?"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-navy/70 mb-1">Message *</label>
        <textarea
          value={form.message}
          onChange={(e) => handleChange("message", e.target.value)}
          rows={5}
          className={`w-full px-4 py-3 rounded-lg border ${errors.message ? "border-red-400" : "border-navy/10"} bg-white focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition-colors resize-none`}
          placeholder="Your message..."
        />
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full py-3 px-6 bg-teal hover:bg-teal-dark text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>

      {/* Toast */}
      {status === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Message sent successfully! We'll get back to you soon.
        </div>
      )}
      {status === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          Failed to send message. Please try again.
        </div>
      )}
    </form>
  );
}
```

- [ ] **Step 2: Implement ContactPage**

Replace `frontend/src/pages/ContactPage.tsx`:

```tsx
import ContactForm from "../components/ContactForm";

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative pt-24 pb-12 bg-navy">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-white/50 text-lg">Get in touch with the College of Information Technology</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-surface">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-navy mb-6">Get In Touch</h2>
              <p className="text-navy/60 mb-8">
                Have questions about our programs, events, or the College of Information Technology?
                We'd love to hear from you.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Address</h3>
                    <p className="text-navy/60">Sta. Cruz, Cogon, Balingasag, Misamis Oriental</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Phone</h3>
                    <p className="text-navy/60">09974994766</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy mb-1">Website</h3>
                    <p className="text-navy/60">moist.ph</p>
                  </div>
                </div>
              </div>

              {/* Logo */}
              <div className="mt-12 flex items-center gap-4">
                <img src="/images/logo.jpg" alt="CIT Logo" className="w-16 h-16 rounded-full border-2 border-gold/30" />
                <div>
                  <p className="font-heading font-bold text-navy">College of Information Technology</p>
                  <p className="text-navy/50 text-sm">MOIST Inc. — Established 2014</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-navy/5">
              <h2 className="font-heading text-2xl font-bold text-navy mb-6">Send a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Verify build and check in browser**

```bash
cd /Users/a1234/Desktop/bsit/frontend
npm run build
```

Expected: Build succeeds. Navigate to `/contact` — contact info on left, form on right. Test form validation (submit empty → shows errors). Test successful submission (fill all fields → "Message sent successfully").

- [ ] **Step 4: Commit**

```bash
cd /Users/a1234/Desktop/bsit
git add frontend/src/components/ContactForm.tsx frontend/src/pages/ContactPage.tsx
git commit -m "feat: implement ContactPage with contact form and validation"
```

---

## Task 12: Scroll to Top on Route Change + Final Polish

**Files:**
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Add scroll-to-top on route change**

Replace `frontend/src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import InstructorsPage from "./pages/InstructorsPage";
import ContactPage from "./pages/ContactPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/instructors" element={<InstructorsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/a1234/Desktop/bsit/frontend
npm run build
```

Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
cd /Users/a1234/Desktop/bsit
git add frontend/src/App.tsx
git commit -m "feat: add scroll-to-top on route change"
```

---

## Task 13: Production Build + End-to-End Verification

**Files:**
- No new files — verification only

- [ ] **Step 1: Build frontend for production**

```bash
cd /Users/a1234/Desktop/bsit/frontend
npm run build
```

Expected: `frontend/dist/` created with built assets

- [ ] **Step 2: Copy dist to Go static directory**

```bash
cp -r /Users/a1234/Desktop/bsit/frontend/dist /Users/a1234/Desktop/bsit/backend/static/
```

- [ ] **Step 3: Update main.go to serve React app in production**

Add SPA fallback to `backend/main.go` — replace the file:

```go
package main

import (
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"moist-cit-website/backend/handlers"
)

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
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

	// Serve React SPA — static assets from dist, fallback to index.html
	distPath := "./backend/static/dist"
	r.NoRoute(func(c *gin.Context) {
		path := filepath.Join(distPath, c.Request.URL.Path)
		if _, err := os.Stat(path); err == nil {
			c.File(path)
			return
		}
		c.File(filepath.Join(distPath, "index.html"))
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}
```

- [ ] **Step 4: Run all Go tests**

```bash
cd /Users/a1234/Desktop/bsit
go test ./backend/handlers/ -v
```

Expected: All 6 tests PASS

- [ ] **Step 5: Start production server and verify all pages**

```bash
cd /Users/a1234/Desktop/bsit
go run ./backend
```

Open `http://localhost:8080` in browser and verify:

1. **Home:** Hero with particles, logo, title, theme. About preview. Objectives grid. Event cards with live countdowns. Instructors "Coming Soon". Contact snippet. All scroll animations work.
2. **About:** Vision, mission, values cards with animations. Objectives grid.
3. **Events:** Day tabs switch content. Category filters work. Timeline view shows chronological events. Grid view shows event cards. Countdowns are live.
4. **Event Detail:** Click any event → poster, details, countdown, mechanics with numbered rules. Back button works.
5. **Instructors:** "Coming Soon" with animated icon and admin instructions.
6. **Contact:** Contact info displayed. Form validates (try empty submit). Successful submission shows success toast.
7. **Responsive:** Resize browser to mobile width — hamburger menu appears, layout adapts, all content readable.
8. **Navigation:** All nav links work. Footer links work. Scroll to top on route change.

- [ ] **Step 6: Commit**

```bash
cd /Users/a1234/Desktop/bsit
git add backend/main.go backend/static/dist/
git commit -m "feat: add production SPA serving and built frontend assets"
```

- [ ] **Step 7: Create .gitignore**

Create `.gitignore`:

```
# Dependencies
frontend/node_modules/

# Build output
frontend/dist/

# Go
backend/static/dist/

# IDE
.vscode/
.idea/

# OS
.DS_Store
```

- [ ] **Step 8: Final commit**

```bash
cd /Users/a1234/Desktop/bsit
git add .gitignore
git commit -m "chore: add .gitignore"
```
