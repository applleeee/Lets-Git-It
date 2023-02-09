import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as AWS from 'aws-sdk';
import { Readable } from 'stream';

export const s3Option = {
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACEESS_KEY,
  region: 'ap-northeast-2',
};

// filePath ex) 'post/test.html' 폴더/파일명
export const getS3Data = async (filePath: string) => {
  const s3Client = new S3Client(s3Option);

  try {
    const streamToString = (stream: Readable) => {
      return new Promise<Buffer>((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
      });
    };

    const bucketParams = {
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: filePath,
    };

    const data = await s3Client.send(new GetObjectCommand(bucketParams));
    const bodyContents = await streamToString(data.Body as Readable);

    return bodyContents.toString();
  } catch (err) {
    console.log('Error :', err);
  }
};

export const uploadToS3 = async (file: Buffer, name: string) => {
  try {
    const s3 = new AWS.S3(s3Option);

    const params = {
      Bucket: process.env.S3_BUCKET_NAME as string,
      Key: name,
      Body: file,
    };

    return await s3.upload(params).promise();
  } catch (err) {
    console.log('Error :', err);
  }
};