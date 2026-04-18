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
