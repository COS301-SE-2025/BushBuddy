import * as tf from "@tensorflow/tfjs";

const MODEL_KEY = "local-model";
const MODEL_URL = process.env.PUBLIC_URL +  "/model/model.json";


export async function downloadModel() {
    const stored = await tf.io.listModels();

    // Checks if a model is downloaded
    if(stored[`indexeddb://${MODEL_KEY}`]){
        console.log("Model already installed. Download Skipped");
        return;
    }

    // Proceed to download if no model found 
    console.log("Downloading Detection Model...");
    const model = await tf.loadGraphModel(MODEL_URL);
    await model.save(`indexeddb://${MODEL_KEY}`);
    console.log("Model downloaded locally and stored");
}

export async function loadModel() {
    const stored = await tf.io.listModels();
    if(!stored[`indexeddb://${MODEL_KEY}`]) {
        throw new Error("No model found in storage. Download First");
    }

    console.log("Loading model from IndexedDB...");
    const model = await tf.loadGraphModel(`indexeddb://${MODEL_KEY}`);
    console.log("Model loaded into memory");
    return model;
}
