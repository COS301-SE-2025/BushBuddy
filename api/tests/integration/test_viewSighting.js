import express from 'express';
import fetch from 'node-fetch';
import { pathToFileURL, fileURLToPath } from 'url';
import path from 'path';

// Get the directory name of the current module.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve the path to the sightingRoutes module
const sightingRoutesPath = path.join(__dirname, '..', '..', 'src', 'SightingServer', 'sightingRoutes.js');
const sightingRoutesURL = pathToFileURL(sightingRoutesPath).href;
const sightingRoutesModule = await import(sightingRoutesURL);
const sightingRoutes = sightingRoutesModule.default;

const app = express();
const port = 4000;
let server;

// This is the sighting ID we will test with.
// It comes from your createSighting test output.
const testSightingId = 318;
const baseUrl = `http://localhost:${port}/api`;

async function testViewSightingController() {
    console.log("Starting test for viewSighting controller...");
    
    // Set up a temporary Express server for the test
    app.use(express.json());
    app.use('/api', sightingRoutes);

    try {
        await new Promise((resolve) => {
            server = app.listen(port, () => {
                console.log(`Test server listening on port ${port}`);
                resolve();
            });
        });

        // GET request to the viewSighting endpoint
        console.log(`Fetching sighting with ID: ${testSightingId}`);
        const response = await fetch(`${baseUrl}/sightings/${testSightingId}`);

        // Check if the response was successful
        if (response.ok) {
            const data = await response.json();
            console.log("\nTest successful! Here is the result:");
            console.log(JSON.stringify(data, null, 2));

            // Add more assertions here to verify the data.
            if (data.success && data.data.id == testSightingId) {
                console.log("Response data matches the requested ID. Test passed!");
            } else {
                console.error("Response data is unexpected. Test failed.");
            }
        } else {
            console.error(`\nTest failed! Server responded with status: ${response.status}`);
            const errorText = await response.text();
            console.error('Error details:', errorText);
        }
    } catch (error) {
        console.error("\nAn error occurred during the test:");
        console.error(error);
    } finally {
        if (server) {
            server.close(() => {
                console.log("Test server shut down.");
            });
        }
    }
}

// Execute the test function
testViewSightingController();


/*node src/server.js */
/*PS C:\2025\CapstoneCoding\AI-Powered-African-Wildlife-Detection\api> Invoke-WebRequest -Method Get "http://localhost:4003/318"

                                                                                                                                                       
StatusCode        : 200                                                                                                                                
StatusDescription : OK                                                                                                                                 
Content           : {"success":true,"message":"Sighting retrieved successfully","data":{"id":318,"user_id":null,"animal_id":14,"confidence":"73.00","c 
                    onfirmed":false,"protected":false,"method":"image","real_time":false,"...
RawContent        : HTTP/1.1 200 OK
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Content-Length: 321
                    Content-Type: application/json; charset=utf-8
                    Date: Tue, 12 Aug 2025 21:36:22 GMT
                    ETag: W/"141-MJ4EGdlwelI+ukEx2F...
Forms             : {}
Headers           : {[Connection, keep-alive], [Keep-Alive, timeout=5], [Content-Length, 321], [Content-Type, application/json; charset=utf-8]...}     
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : mshtml.HTMLDocumentClass
RawContentLength  : 321



PS C:\2025\CapstoneCoding\AI-Powered-African-Wildlife-Detection\api> */