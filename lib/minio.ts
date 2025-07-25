import { Client } from 'minio';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || '',
  secretKey: process.env.MINIO_SECRET_KEY || '',
});

export default minioClient;
export { minioClient };

// Bucket names
export const BUCKETS = {
  IMAGES: 'vanarsena-images',
  VIDEOS: 'vanarsena-videos',
  DOCUMENTS: 'vanarsena-documents',
} as const;

// Initialize buckets
export async function initializeBuckets() {
  for (const bucketName of Object.values(BUCKETS)) {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      await minioClient.makeBucket(bucketName);
      
      // Set bucket policy to allow public read access
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${bucketName}/*`],
          },
        ],
      };
      
      await minioClient.setBucketPolicy(bucketName, JSON.stringify(policy));
    }
  }
}

// Upload file to MinIO
export async function uploadFile(
  file: Buffer,
  fileName: string,
  bucketName: string,
  contentType: string
): Promise<string> {
  const objectName = `${Date.now()}-${fileName}`;
  
  await minioClient.putObject(bucketName, objectName, file, file.length, {
    'Content-Type': contentType,
  });
  
  // Return the public URL
  const url = `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT || '9000'}/${bucketName}/${objectName}`;
  return process.env.MINIO_USE_SSL === 'true' ? `https://${url}` : `http://${url}`;
}

// Delete file from MinIO
export async function deleteFile(bucketName: string, objectName: string) {
  await minioClient.removeObject(bucketName, objectName);
}

// Get file URL
export function getFileUrl(bucketName: string, objectName: string): string {
  const baseUrl = process.env.MINIO_USE_SSL === 'true' 
    ? `https://${process.env.MINIO_ENDPOINT}` 
    : `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT || '9000'}`;
  
  return `${baseUrl}/${bucketName}/${objectName}`;
}

// Helper function to get bucket name based on file type
export function getBucketForFileType(fileType: string): string {
  if (fileType.startsWith('image/')) {
    return BUCKETS.IMAGES;
  } else if (fileType.startsWith('video/')) {
    return BUCKETS.VIDEOS;
  } else {
    return BUCKETS.DOCUMENTS;
  }
}
