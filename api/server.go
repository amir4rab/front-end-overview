package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
)

const port = ":3090";

func main() {
	jsonBytes, readErr := os.ReadFile("./src/cities.json")
	if readErr != nil {
		log.Fatalln(readErr)
	}

	var jsonBytesCompressed = bytes.NewBuffer([]byte(""))
	compressionError := json.Compact(jsonBytesCompressed, jsonBytes)
	if compressionError != nil {
		log.Fatalln(compressionError)
	}

	jsonStringCompressed := jsonBytesCompressed.String()

	http.HandleFunc("/", func (w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Access-Control-Allow-Origin", "*")
		w.Header().Add("status", "200")
		fmt.Fprint(w, jsonStringCompressed)
	})

	log.Println("Starting Go server on http://localhost" + port)

	httpServerError := http.ListenAndServe(port, nil)
	if httpServerError != nil {
		log.Fatalln(httpServerError)
	}
}