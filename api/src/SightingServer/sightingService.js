import { sightingRepository } from './sightingRepository.js';
import * as ort from 'onnxruntime-node';
import Jimp from 'jimp';
import path from 'path';
import process from 'process';

// Path to the ONNX model file has been corrected to use an absolute path,
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
 * NOTE: The input size has been updated to match the model's expected size from your output.
 * @param {Buffer} imageBuffer - The image data as a Buffer.
 * @returns {Float32Array} - The preprocessed image as a flat Float32Array.
 */
async function preprocessImage(imageBuffer) {
    const INPUT_SIZE = 640; // The YOLO model expects a 640x640 input
    
    // Read the image using Jimp
    const image = await Jimp.read(imageBuffer);

    // Resize the image to 640x640 and convert to RGB
    image.resize(INPUT_SIZE, INPUT_SIZE).rgba(false);

    const { data, width, height } = image.bitmap;
    const red = new Float32Array(width * height);
    const green = new Float32Array(width * height);
    const blue = new Float32Array(width * height);

    // Normalize pixel values and separate into R, G, B channels
    // The model expects a tensor in the format [batch_size, channels, height, width]
    for (let i = 0, j = 0; i < data.length; i += 4, j++) {
        red[j] = data[i] / 255.0;
        green[j] = data[i + 1] / 255.0;
        blue[j] = data[i + 2] / 255.0;
    }

    // Combine channels into a single flat array
    const inputData = [...red, ...green, ...blue];

    // Create the final Float32Array and return
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

        // Define the tensor input to match the model's expected input shape and type
        const inputTensor = new ort.Tensor('float32', preprocessedData, [1, 3, 640, 640]);
        const feeds = { 'images': inputTensor }; // The key 'images' must match the model's input name.
        // NOTE: Your model's input name is likely 'images', not 'input'.

        // Run the model
        const results = await session.run(feeds);

        // This is the key part that has been updated based on your model's output structure.
        // YOLO models typically output a tensor with shape [1, number_of_classes + 4, number_of_detections].
        // The output name is usually 'output'.
        const outputTensor = results['output0']; // NOTE: The output name might be 'output' or 'output0' depending on the model version.
        const outputData = outputTensor.data;

        const identifications = [];
        const confidenceThreshold = 0.5; // You can adjust this value as needed.
        
        // This array has been updated with your actual class labels.
        // The order of these names must correspond to your model's class IDs.
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

        // YOLO model output processing logic
        const numDetections = outputTensor.dims[2];
        const numClasses = outputTensor.dims[1] - 4; // Bounding box coordinates (x, y, w, h) are 4 columns.

        for (let i = 0; i < numDetections; i++) {
            const rowOffset = i;
            let maxConfidence = 0;
            let classId = -1;

            // Find the class with the highest confidence score for this detection
            for (let j = 0; j < numClasses; j++) {
                const confidence = outputData[rowOffset + (j + 4) * numDetections];
                if (confidence > maxConfidence) {
                    maxConfidence = confidence;
                    classId = j;
                }
            }
            
            // Check if the highest confidence is above the threshold
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

async function createSighting(user_id, file, geolocation) {
    // === AI integration starts here ===
    const identifications = await runModelInference(file);
    // === AI integration ends here ===

    try {
        // in future check whether file is image or audio
        const image_url = await sightingRepository.uploadSightingFile(file);
        const sightings = [];

        if (identifications.length === 0) {
            // Handle case where no animals were identified
            console.warn("No animals identified in the image.");
            // You might want to save a sighting with a 'Unknown' or 'No detection' label.
            // For now, it will simply not save any sightings.
            return { animals: [], image: await sightingRepository.fetchSightingImage(image_url) };
        }

        for (const identification of identifications) {
            sightings.push(
                await sightingRepository.saveNewSighting(user_id, identification, image_url, 'image', geolocation)
            );
        }

        const image = await sightingRepository.fetchSightingImage(image_url);
        return { animals: sightings, image: image };
    } catch (error) {
        if (error.message !== 'Error uploading file' && error.message !== 'Error adding sighting to DB') console.error(error);
        throw new Error('Failed to create new sighting');
    }
}

/**
 * Retrieves all sightings for a given user from the database.
 * @param {string} user_id - The ID of the user.
 * @returns {Promise<Array>} - A promise that resolves to an array of sightings.
 */
async function getSightingHistoryByUserId(user_id) {
    try {
        const history = await sightingRepository.getSightingHistoryByUserId(user_id);
        return history;
    } catch (error) {
        console.error("Error fetching sighting history:", error);
        throw new Error('Failed to retrieve sighting history');
    }
}

export const sightingService = {
    createSighting,
    getSightingHistoryByUserId,
};
