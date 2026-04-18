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
