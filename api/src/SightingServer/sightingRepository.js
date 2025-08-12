import db from '../db/index.js';
import { nanoid } from 'nanoid';
import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

/**
 * Saves a new sighting to the database.
 * @param {string} user_id - The ID of the user.
 * @param {object} identification - The animal identification details.
 * @param {string} image_url - The URL of the sighting image.
 * @param {string} method - The method of sighting ('image' or 'audio').
 * @param {object} geolocation - The longitude and latitude of the sighting.
 * @returns {Promise<object>} The newly created sighting object.
 */
async function saveNewSighting(user_id, identification, image_url, method, geolocation) {
    const queryText = `
        INSERT INTO sightings(user_id, animal_id, confidence, confirmed, protected, method, image_url, geolocation_long, geolocation_lat)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
    `;
    const queryValues = [
        user_id,
        // In a real application, you'd map the animal name to a real animal_id from a lookup table.
        // For now, we'll use a placeholder.
        14, // Placeholder for 'Zebra' from your training data
        identification.confidence,
        false, // confirmed
        false, // protected
        method,
        image_url,
        geolocation.longitude,
        geolocation.latitude,
    ];

    try {
        const res = await db.query(queryText, queryValues);
        if (res.rows.length > 0) {
            return res.rows[0];
        }
    } catch (error) {
        console.error('Error adding sighting to DB:', error);
        throw new Error('Error adding sighting to DB');
    }
}

/**
 * Retrieves a single sighting by its ID from the database.
 * @param {string} sightingId - The ID of the sighting.
 * @returns {Promise<object|null>} The sighting object or null if not found.
 */
async function getSightingById(sightingId) {
    const queryText = 'SELECT * FROM sightings WHERE id = $1;';
    const queryValues = [sightingId];

    try {
        const res = await db.query(queryText, queryValues);
        if (res.rows.length > 0) {
            return res.rows[0];
        }
        return null;
    } catch (error) {
        console.error('Error fetching sighting by ID:', error);
        throw new Error('Error fetching sighting by ID');
    }
}

/**
 * Uploads an image file to S3 and returns the key.
 * @param {Buffer} file - The image data as a Buffer.
 * @returns {Promise<string>} The key of the uploaded object in S3.
 */
async function uploadSightingFile(file) {
    const fileKey = nanoid();
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
        Body: file,
        ContentType: 'image/jpeg',
    };

    try {
        await s3.send(new PutObjectCommand(uploadParams));
        return fileKey;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('Error uploading file');
    }
}

/**
 * Fetches the signed URL for a sighting image from S3.
 * @param {string} image_url - The S3 key of the image.
 * @returns {Promise<string>} The signed URL.
 */
async function fetchSightingImage(image_url) {
    const getParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: image_url,
    };

    try {
        const command = new GetObjectCommand(getParams);
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return signedUrl;
    } catch (error) {
        console.error('Error fetching file:', error);
        throw new Error('Error fetching file');
    }
}

/**
 * Retrieves all sighting history for a specific user from the database.
 * @param {string} user_id - The ID of the user.
 * @returns {Promise<Array>} A promise that resolves to an array of sightings.
 */
async function getSightingHistoryByUserId(user_id) {
    const queryText = 'SELECT * FROM sightings WHERE user_id = $1 ORDER BY created_at DESC;';
    const queryValues = [user_id];

    try {
        const res = await db.query(queryText, queryValues);
        return res.rows;
    } catch (error) {
        console.error('Error fetching sighting history by user ID:', error);
        throw new Error('Error fetching sighting history by user ID');
    }
}

export const sightingRepository = {
    saveNewSighting,
    uploadSightingFile,
    fetchSightingImage,
    getSightingById,
    getSightingHistoryByUserId,
};
