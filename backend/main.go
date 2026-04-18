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
