package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os/exec"
	"strings"
)

type Note struct {
	ID      int    `json:"id"`
	Content string `json:"content"`
}

func main() {
	http.HandleFunc("/notes", handleNotes)
    http.HandleFunc("/notes/", handleNotes)
	log.Println("Server starting on port 8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func handleNotes(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	switch r.Method {
	case "GET":
		handleGetNotes(w, r) // Hanterar GET-förfrågan
	case "POST":
		handlePostNotes(w, r) // Hanterar POST-förfrågan
	case "PUT":
		handleUpdateNotes(w, r) // Hanterar PUT-förfrågan
	case "DELETE":
		handleDeleteNotes(w, r) // Hanterar DELETE-förfrågan
	default:
		http.Error(w, "Unsupported HTTP Method", http.StatusMethodNotAllowed)
	}
}

func handleGetNotes(w http.ResponseWriter, r *http.Request) {
	output, err := executePHP("read")
	if err != nil {
		log.Printf("Failed to execute PHP script: %v", err)
		http.Error(w, "Failed to fetch notes", http.StatusInternalServerError)
		return
	}

	log.Printf("Output from PHP script: %s", output)
	w.Header().Set("Content-Type", "application/json")
	w.Write(output)
}

func handlePostNotes(w http.ResponseWriter, r *http.Request) {
	var note Note
	err := json.NewDecoder(r.Body).Decode(&note)
	if err != nil {
		http.Error(w, "Error parsing JSON request body", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	if note.Content == "" {
		http.Error(w, "Content cannot be empty", http.StatusBadRequest)
		return
	}

	noteJSON, err := json.Marshal(note)
	if err != nil {
		http.Error(w, "Error marshalling note to JSON", http.StatusInternalServerError)
		return
	}

	output, err := executePHP("create", string(noteJSON))
	if err != nil {
		log.Printf("Failed to execute PHP script: %v", err)
		http.Error(w, "Failed to save note", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	w.Write(output)
}

func handleUpdateNotes(w http.ResponseWriter, r *http.Request) {
	// PSEUDOKOD:
	// 1. Hämta och validera den uppdaterade notdata
	// 2. Kolla om noten existerar
	// 3. Om existerar, uppdatera noten med den nya datan
	// 4. Om inte existerar, returnera HTTP 404
	// 5. Om uppdateringen lyckas, returnera HTTP 200 och den uppdaterade noten
	executePHP("put")
}

func handleDeleteNotes(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/notes/")
	if id == "" {
		http.Error(w, "Missing note ID", http.StatusBadRequest)
		return
	}

	output, err := executePHP("delete", id)
	if err != nil {
		log.Printf("Failed to execute PHP script: %v", err)
		http.Error(w, "Failed to delete note", http.StatusInternalServerError)
		return
	}

    if strings.Contains(string(output), "Note not found") {
        http.Error(w, "Note not found", http.StatusNotFound)
        return
    }

	if strings.Contains(string(output), "Record deleted successfully") {
		w.WriteHeader(http.StatusNoContent)
	} else {
		http.Error(w, "Note not found", http.StatusNotFound)
	}
}

func executePHP(operation string, args ...string) ([]byte, error) {
	cmd := exec.Command("php", append([]string{"./php/database.php", operation}, args...)...)
	output, err := cmd.CombinedOutput()
	log.Printf("output från PHP-skriptet: %s", output)
	return output, err
}
