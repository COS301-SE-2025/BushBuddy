import express from 'express';
import { discoveryController } from './discoveryController.js';
import multer from 'multer';
import { setupSwaggerDiscovery } from './swagger.js';

const discoveryApp = express();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @openapi
 * /discovery/bestiary:
 *   get:
 *     summary: Get all animals in the bestiary
 *     tags:
 *       - Discovery
 *     responses:
 *       200:
 *         description: Successfully retrieved all animals
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Animals retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "1234"
 *                       name:
 *                         type: string
 *                         example: "African Elephant"
 *                       description:
 *                         type: string
 *                         example: "The African bush elephant is the largest living terrestrial animal"
 *                       imageUrl:
 *                         type: string
 *                         example: "https://example.com/elephant.jpg"
 *       500:
 *         description: Failed to retrieve animals due to server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve animals"
 */
discoveryApp.get('/bestiary', express.json(), discoveryController.getAllAnimals);

/**
 * @openapi
 * /discovery/bestiary:
 *   post:
 *     summary: Add a new animal to the bestiary
 *     tags:
 *       - Discovery
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - name
 *               - description
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file of the animal
 *               name:
 *                 type: string
 *                 example: "African Elephant"
 *               description:
 *                 type: string
 *                 example: "The African bush elephant is the largest living terrestrial animal"
 *     responses:
 *       201:
 *         description: Animal successfully added to bestiary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Animal added successfully"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 *       401:
 *         description: Unauthorized - Not logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Failed to add animal due to server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to add animal"
 */
discoveryApp.post('/bestiary', upload.single('file'), discoveryController.insertNewAnimal);

/**
 * @openapi
 * /discovery/sightings:
 *   get:
 *     summary: Get all animal sightings for map display
 *     deprecated: true
 *     tags:
 *       - Discovery
 *     responses:
 *       200:
 *         description: Successfully retrieved all sightings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 sightings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "5678"
 *                       animalId:
 *                         type: string
 *                         example: "1234"
 *                       latitude:
 *                         type: number
 *                         example: -23.45678
 *                       longitude:
 *                         type: number
 *                         example: 25.67890
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-08-08T12:00:00Z"
 *       500:
 *         description: Failed to retrieve sightings due to server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve sightings"
 */
discoveryApp.get('/sightings', express.json(), discoveryController.getMapSightings);

setupSwaggerDiscovery(discoveryApp);

export default discoveryApp;
