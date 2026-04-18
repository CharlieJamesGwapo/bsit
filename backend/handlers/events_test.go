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
