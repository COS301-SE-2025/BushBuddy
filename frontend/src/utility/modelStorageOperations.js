import * as ort from "onnxruntime-web";

const MODEL_KEY = "local-model";
const MODEL_URL = process.env.PUBLIC_URL +  "/models/model_v0.2.onnx";


export async function downloadModel() {
    const storedModel = await getStoredModel();

    // Checks if a model is downloaded
    if(storedModel){
        console.log("Model already installed. Download Skipped");
        return;
    }

    // Proceed to download if no model found 
    console.log("Downloading Detection Model...");
    const response = await fetch(MODEL_URL);
    if(!response.ok) throw new Error("Failed To Fetch Model");

    // arrayBuffer used because .onnx files are binary
    const arrayBuffer = await response.arrayBuffer();

    await storeModel(arrayBuffer);
    console.log("Model downloaded locally and stored");
}

export async function loadModel() {
    const storedModel = await getStoredModel();
    if(!storedModel) throw new Error("No model found in storage");

    console.log("Loading model from storage");
    const session = await ort.InferenceSession.create(storedModel, {
        executionProviders: ["wasm"],
    });

    console.log("Model loaded into memory");
    return session;
}

// Model will be stored in IndexedDB. Current Option. Maybe add Cache API Option later for possible faster load times
async function storeModel(arrayBuffer){
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("ModelStorage", 1);
        request.onupgradeneeded = () => {
            request.result.createObjectStore("models");
        };
        request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction("models", "readwrite");
            tx.objectStore("models").put(arrayBuffer, MODEL_KEY);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        };
        request.onerror = () => reject(request.error);
    });
}

async function getStoredModel() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("ModelStorage", 1);
        request.onupgradeneeded = () => {
            request.result.createObjectStore("models");
        };
        request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction("models", "readonly");
            const getRequest = tx.objectStore("models").get(MODEL_KEY);
            getRequest.onsuccess = () => resolve(getRequest.result);
            getRequest.onerror = () => reject(getRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

