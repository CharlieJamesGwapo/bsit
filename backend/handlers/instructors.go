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
