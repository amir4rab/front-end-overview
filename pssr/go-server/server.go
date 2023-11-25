// -------------------------------------------------------------------------- //
//                                                                            //
//     Please keep in mind I am quite new to "Go" and this source code,       //
//     will most likely include many errors,                                  //
//     Therefore "DO NOT RUN IT IN PRODUCTION".                               //
//     There are NO granites and the software is repassed "AS IS".            //
//                                                                            //
// -------------------------------------------------------------------------- //

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"
)

// Data structure to be used in the template
type PageData struct {
	Stylesheets  []string
	Scripts  []string
	InlineScripts []template.HTML
}

type Resources struct {
	Stylesheets  []string
	Scripts  []string
}


const port = ":3091";

// Returns error incase of any error in api route
func serverError(w http.ResponseWriter) {
	w.Header().Add("status", "500")
	fmt.Fprint(w, "error 500")
}

// Renders the current date
func getRenderDate() string {
	currentDate := time.Now()

	formattedDate := fmt.Sprint(currentDate.UTC().Hour()) + ":" + fmt.Sprint(currentDate.UTC().Minute()) + ":" + fmt.Sprint(currentDate.UTC().Second()) + ":00"
	
	return formattedDate
}

// Generates a inline script containing the needed data
func generateInlineScript(body []byte) string {
	output := `<script>var embeddedCitiesData = ` + string(body) + `; var embeddedRenderedTime = { renderTime: "` + getRenderDate() + `" }; </script>`
	return output
}

// Returns the list of resources inside 'recourse' directory
func getResources(dir string) Resources {
	fileEntries, err := os.ReadDir(dir)
	stylesheets := []string{}
	scripts := []string{}
	
	if err != nil {
		return Resources { Stylesheets: stylesheets, Scripts: scripts }
	}

	for _, fileEntry := range fileEntries {
		if strings.HasSuffix(fileEntry.Name(), ".js") {
			scripts = append(scripts, "/assets/" + fileEntry.Name())
		} else if strings.HasSuffix(fileEntry.Name(), ".css") {
			stylesheets = append(stylesheets, "/assets/" + fileEntry.Name())
		}
	}

	return Resources { Stylesheets: stylesheets, Scripts: scripts }
}

func main() {
	// Reading the html file
	htmlBytes, readErr := os.ReadFile("./templates/index.html")
	if readErr != nil {
		log.Fatalln(readErr)
	}

	// Reading resources
	resources := getResources("./assets/")

	// Parsing the HTML template
	indexTemplate, templateErr := template.New("example").Parse(string(htmlBytes))
	if templateErr != nil {
		log.Fatalln(templateErr)
	}

	// Generating Index page
	http.HandleFunc("/", func (w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Access-Control-Allow-Origin", "*")
		var htmlPage bytes.Buffer

		// Fetching cities data
		response, getErr := http.Get("http://localhost:3090")
		if getErr != nil {
			fmt.Println("Error making GET request:", getErr)
			serverError(w)
			return
		}

		// Parsing fetched body
		body, bodyError := io.ReadAll(response.Body);
		if bodyError != nil {
			serverError(w)
			return
		}
		
		// Checking if the json api response is valid
		if !json.Valid(body) {
			fmt.Println("Invalid JSON was received from the API")
			serverError(w)
			return
		}

		// Building the data object
		data := PageData{
			Stylesheets: resources.Stylesheets,
			Scripts: resources.Scripts,
			InlineScripts: []template.HTML{template.HTML(generateInlineScript(body))},
		}

		// Executing the Template
		err := indexTemplate.Execute(&htmlPage, data)
		if (err != nil) {
			serverError(w)
			return
		}
		
		w.Header().Add("status", "200")
		fmt.Fprint(w, htmlPage.String())
	})

	// Serving Static Files
	fileServer := http.FileServer(http.Dir("./assets/"))
	http.Handle("/assets/", http.StripPrefix("/assets/", fileServer))

	// Logging after the server started working
	log.Println("Starting Go server on http://localhost" + port)

	httpServerError := http.ListenAndServe(port, nil)
	if httpServerError != nil {
		log.Fatalln(httpServerError)
	}
}