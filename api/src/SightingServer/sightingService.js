// The import has been updated to correctly access the default db object.
import db from '../db/index.js';
// Updated to use a named import for sightingRepository
import { sightingRepository } from './sightingRepository.js';
import * as ort from 'onnxruntime-node';
import Jimp from 'jimp';
import path from 'path';
import process from 'process';

// built from the current working directory, to avoid path resolution errors.
const rootDir = process.cwd();
const modelPath = path.join(rootDir, 'weights', 'my_model.onnx');

// Load the ONNX model asynchronously when the service is initialized.
const sessionPromise = (async () => {
    try {
        console.log("Loading ONNX model from:", modelPath);
        return await ort.InferenceSession.create(modelPath);
    } catch (error) {
        console.error("Failed to load ONNX model:", error);
        throw new Error("Could not load AI model.");
    }
})();

/**
 * Preprocesses an image buffer for model inference.
 * The model expects a tensor with shape [1, 3, 640, 640] and pixel values normalized.
 * @param {Buffer} imageBuffer - The image data as a Buffer.
 * @returns {Float32Array} - The preprocessed image as a flat Float32Array.
 */
async function preprocessImage(imageBuffer) {
    const INPUT_SIZE = 640; // The YOLO model expects a 640x640 input
    
    const image = await Jimp.read(imageBuffer);
    image.resize(INPUT_SIZE, INPUT_SIZE).rgba(false);

    const { data, width, height } = image.bitmap;
    const red = new Float32Array(width * height);
    const green = new Float32Array(width * height);
    const blue = new Float32Array(width * height);

    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
        red[j] = data[i] / 255.0;
        green[j] = data[i + 1] / 255.0;
        blue[j] = data[i + 2] / 255.0;
    }

    const inputData = [...red, ...green, ...blue];

    return new Float32Array(inputData);
}

/**
 * Runs the AI model on a given image file.
 * @param {Buffer} file - The image data as a Buffer.
 * @returns {Array<Object>} - An array of identified animals and their confidence scores.
 */
async function runModelInference(file) {
    try {
        const session = await sessionPromise;
        const preprocessedData = await preprocessImage(file);

        const inputTensor = new ort.Tensor('float32', preprocessedData, [1, 3, 640, 640]);
        const feeds = { 'images': inputTensor };
        const results = await session.run(feeds);

        const outputTensor = results['output0'];
        const outputData = outputTensor.data;

        const identifications = [];
        const confidenceThreshold = 0.5;
        
        const animalClasses = [
            'Aardvark',
            'Blue Wildebeest',
            'Bontebok',
            'Buffalo',
            'Bushbuck',
            'Bushpig',
            'Caracal',
            'Chacma Baboon',
            'Cheetah',
            'Common Warthog',
            'Duiker',
            'Eland',
            'Elephant',
            'Gemsbok',
            'Giraffe',
            'Hippo',
            'Honey Badger',
            'Hyenah',
            'Impala',
            'Kudu',
            'Leopard',
            'Lion',
            'Meerkat',
            'Nyala',
            'Pangolin',
            'Red Hartebeest',
            'Rhino',
            'Rock Hyrax',
            'SableAntelope',
            'Serval',
            'Steenbok',
            'Vevet Monkey',
            'Waterbuck',
            'Wild Dog',
            'Wilddog',
            'Zebra',
            'springbok'
        ];

        const numDetections = outputTensor.dims[2];
        const numClasses = outputTensor.dims[1] - 4;

        for (let i = 0; i < numDetections; i++) {
            const rowOffset = i;
            let maxConfidence = 0;
            let classId = -1;

            for (let j = 0; j < numClasses; j++) {
                const confidence = outputData[rowOffset + (j + 4) * numDetections];
                if (confidence > maxConfidence) {
                    maxConfidence = confidence;
                    classId = j;
                }
            }
            
            if (maxConfidence > confidenceThreshold && classId !== -1) {
                identifications.push({
                    animal: animalClasses[classId],
                    confidence: Math.round(maxConfidence * 100)
                });
            }
        }
        
        return identifications;
    } catch (error) {
        console.error("Error during model inference:", error);
        return [];
    }
}

/**
 * Finds an animal ID by its name in the database using the shared db object.
 * @param {string} animalName The name of the animal to find.
 * @returns {Promise<number|null>} The animal's ID or null if not found.
 */
async function findAnimalIdByName(animalName) {
    try {
        // Updated the query to handle the case where the model returns "Zebra"
        // but the database stores "Plains Zebra". This ensures a match is found.
        const res = await db.query(
            'SELECT id FROM animals WHERE name = $1 OR name = $2', 
            [animalName, 'Plains Zebra']
        );
        if (res.rows.length > 0) {
            return res.rows[0].id;
        }
        return null;
    } catch (error) {
        console.error('Error finding animal ID:', error);
        return null;
    }
}

async function createSighting(user_id, file, geolocation) {
    const identifications = await runModelInference(file);

    try {
        const image_url = await sightingRepository.uploadSightingFile(file);
        const sightings = [];

        if (identifications.length === 0) {
            console.warn("No animals identified in the image.");
            return { animals: [], image: await sightingRepository.fetchSightingImage(image_url) };
        }

        for (const identification of identifications) {
            const animalId = await findAnimalIdByName(identification.animal);

            if (animalId) {
                // Call saveNewSighting with separate arguments
                const sightingResult = await sightingRepository.saveNewSighting(
                    user_id, 
                    { animal_id: animalId, confidence: identification.confidence, confirmed: false, prot: false },
                    image_url,
                    'image',
                    { latitude: geolocation.latitude, longitude: geolocation.longitude }
                );
                 sightings.push(
                    sightingResult
                );
            } else {
                console.warn(`Animal '${identification.animal}' not found in the database. Sighting not saved.`);
            }
        }

        const image = await sightingRepository.fetchSightingImage(image_url);
        return { animals: sightings, image: image };
    } catch (error) {
        if (error.message !== 'Error uploading file' && error.message !== 'Error adding sighting to DB') console.error(error);
        throw new Error('Failed to create new sighting');
    }
}

export const sightingService = {
    createSighting,
};