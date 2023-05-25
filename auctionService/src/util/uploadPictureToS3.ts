import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AUCTIONS_BUCKET_NAME } from "../constants/Environments";


const client = new S3Client({});

export async function uploadPictureToS3(
    key: string,
    body: Buffer
): Promise<string> {
  
  const command = new PutObjectCommand({
    Bucket: AUCTIONS_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg'
  });

  
    const response = await client.send(command);

    const location = `https://${AUCTIONS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
    return location;

}