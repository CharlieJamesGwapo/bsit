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
