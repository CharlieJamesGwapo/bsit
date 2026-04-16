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
