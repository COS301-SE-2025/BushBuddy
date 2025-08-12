import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

// Get the directory name of the current module.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The test script is in `api/tests/integration`, and the service is in `api/src/SightingServer`.
const sightingServicePath = path.join(__dirname, '..', '..', 'src', 'SightingServer', 'sightingService.js');
const dbModulePath = path.join(__dirname, '..', '..', 'src', 'db', 'index.js');

// Convert the absolute paths to a proper file:// URLs
const sightingServiceURL = pathToFileURL(sightingServicePath).href;
const dbModuleURL = pathToFileURL(dbModulePath).href;

const { sightingService } = await import(sightingServiceURL);

// Dynamically import the database module. I am assuming it exports an already-instantiated object.
const { default: db } = await import(dbModuleURL);

const testUserId = 'test-user-123';

/**
 * Sets up the database for the test by inserting a new user.
 */
async function setup() {
    console.log("Setting up test database...");
    const insertText = 'INSERT INTO users(id, username, password_hash) VALUES($1, $2, $3) ON CONFLICT (id) DO NOTHING';
    const insertValues = [testUserId, 'Test User', 'test-password-hash'];
    
    // Explicitly run the insert query and log the result
    try {
        await db.query(insertText, insertValues);
        console.log(`INSERT query for test user '${testUserId}' completed.`);
    } catch (error) {
        console.error(`Error during user insertion:`, error);
        throw error;
    }
}

/**
 * Cleans up the database after the test by deleting the test user.
 */
async function teardown() {
    console.log("Cleaning up test database...");
    const deleteText = 'DELETE FROM users WHERE id = $1';
    const deleteValues = [testUserId];
    
    try {
        await db.query(deleteText, deleteValues);
        console.log(`Test user '${testUserId}' deleted.`);
    } catch (error) {
        console.error(`Error during user deletion:`, error);
    }
}

async function testSightingService() {
    console.log("Starting test for sighting service...");
    
    try {
        await setup(); // Run setup before the test starts.
        
        // The zebra image test
        const imagePath = path.join(__dirname, '..', '..', 'data', 'images', '14cd38f3-145723359.jpg');
    
        if (!fs.existsSync(imagePath)) {
            console.error(`Error: Test image not found at ${imagePath}`);
            return;
        }
    
        const imageBuffer = fs.readFileSync(imagePath);
        const testGeolocation = {
            latitude: -25.7479,
            longitude: 28.2293
        };
    
        console.log("Calling createSighting with a test image...");
        const result = await sightingService.createSighting(testUserId, imageBuffer, testGeolocation);
    
        console.log("\nTest successful! Here is the result:");
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("\nTest failed!");
        console.error(error);
    } finally {
        await teardown(); // Always run teardown to clean up the database.
    }
}

testSightingService();