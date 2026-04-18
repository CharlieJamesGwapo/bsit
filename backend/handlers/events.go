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
