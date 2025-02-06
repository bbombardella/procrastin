import { PutObjectCommand, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3'
import { env } from '../utils/environment'
import path from 'node:path'
import mime from 'mime-types'
import { randomUUID } from 'node:crypto'

export const s3 = new S3Client({
    region: 'eu-west-3', // MinIO ignore cette valeur, mais elle est requise
    endpoint: env.S3_ENDPOINT, 
    credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY
    },
    forcePathStyle: true // Obligatoire pour MinIO
})

export const uploadFileToS3 = async (fileBuffer: Buffer, key: string) => {
    const extension = path.extname(key)
    const contentType = mime.lookup(extension) || 'application/octet-stream'
    const uniqueFilename = `${randomUUID()}${extension}`

    try {
        const uploadParams: PutObjectCommandInput = {
            Bucket: env.S3_BUCKET_NAME,
            Key: uniqueFilename,
            Body: fileBuffer,
            ContentType: contentType,
            ACL: 'public-read'
        }

        await s3.send(new PutObjectCommand(uploadParams))

        // minio url
        const fileUrl = `${env.S3_ENDPOINT}/${env.S3_BUCKET_NAME}/${uniqueFilename}`

        return fileUrl
    } catch (err) {
        console.error(err)
        return null
    }
}