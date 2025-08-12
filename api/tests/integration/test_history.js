import fs from 'fs';
import path from 'path';
import process from 'process';
import { pathToFileURL } from 'url';

// Get the absolute path to the project's root directory.
const rootDir = process.cwd();

const sightingServicePath = path.join(rootDir, 'src', 'SightingServer', 'sightingService.js');
const { sightingService } = await import(pathToFileURL(sightingServicePath));

async function testSightingHistoryService() {
    console.log("Starting test for sighting history service...");

    // This user ID should match a user that has sightings in our database.
    // If we don't have a user with sightings, we can use the createSighting
    // function first to add some data.
    const testUserId = 'test-user-123';

    try {
        console.log(`Calling getSightingHistoryByUserId for user: ${testUserId}`);
        const history = await sightingService.getSightingHistoryByUserId(testUserId);

        if (history && history.length > 0) {
            console.log("\nTest successful! Sighting history retrieved:");
            console.log(JSON.stringify(history, null, 2));
        } else {
            console.warn("\nTest successful, but no sightings were found for this user.");
        }
    } catch (error) {
        console.error("\nTest failed!");
        console.error(error);
    }
}

// Run the test function
testSightingHistoryService();
