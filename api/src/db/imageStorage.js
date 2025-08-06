import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import dotenv from 'dotenv';
dotenv.config();

class ImageStorage {
    constructor () {
        this.connection = new S3Client({
            region: "auto",
            endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
            }
        });

        this.bucket = process.env.R2_BUCKET_NAME;
    }

    async storeImage(buffer, contentType){
        const key = nanoid(12);
        const uploadParams = {
            Bucket: this.bucket,
            Key: key,
            Body: buffer,
            ContentType: contentType
        }

        try {
            await this.connection.send(new PutObjectCommand(uploadParams));
            return key;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async fetchImage(key) {
        const fetchParams = {
            Bucket: this.bucket,
            Key: key,
            ResponseCacheControl: "public, max-age=604800"
        }

        try {
            const url = getSignedUrl(this.connection, new GetObjectCommand(fetchParams), {expiresIn: 60*60*24});
            return url;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

const s3 = new ImageStorage();

export default s3;

console.log(await s3.fetchImage('Duiker.webp'))