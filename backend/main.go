package main

import (
	"embed"
	"io/fs"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"moist-cit-website/backend/handlers"
)

//go:embed data
var embeddedDataFS embed.FS

//go:embed static/images
var embeddedImagesFS embed.FS

func extractDataToTempDir() string {
	tmpDir, err := os.MkdirTemp("", "bsit-data-")
	if err != nil {
		panic(err)
	}
	entries, err := fs.ReadDir(embeddedDataFS, "data")
	if err != nil {
		panic(err)
	}
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		content, err := fs.ReadFile(embeddedDataFS, "data/"+entry.Name())
		if err != nil {
			panic(err)
		}
		if err := os.WriteFile(filepath.Join(tmpDir, entry.Name()), content, 0644); err != nil {
			panic(err)
		}
	}
	return tmpDir
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	allowed := os.Getenv("ALLOWED_ORIGIN")
	if allowed == "" {
		allowed = "http://localhost:5173"
	}

	handlers.DataDir = extractDataToTempDir()

	imagesFS, err := fs.Sub(embeddedImagesFS, "static/images")
	if err != nil {
		panic(err)
	}

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{allowed},
		AllowMethods:     []string{"GET", "POST"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))

	r.StaticFS("/images", http.FS(imagesFS))

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
