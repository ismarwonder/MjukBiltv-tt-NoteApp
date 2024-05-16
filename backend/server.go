package main

import (
    "log"
    "net/http"
)

func main() {
    http.HandleFunc("/notes", handleNotes)
    log.Println("Server starting on port 8080...")
    log.Fatal(http.ListenAndServe(":8080", nil))
}

func handleNotes(w http.ResponseWriter, r *http.Request) {
    // Hantering av olika metoder kommer här
}
