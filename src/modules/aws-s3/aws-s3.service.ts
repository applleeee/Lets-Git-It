import {
  DeleteObjectsCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import * as AWS from 'aws-sdk';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Readable } from 'stream';

@Injectable()
export class AwsS3Service {
  private s3Option = {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2',
  };

  async getS3Data(filePath: string) {
    const s3Client = new S3Client(this.s3Option);

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
    } catch (error) {
      throw new HttpException(
        'CANNOT_GET_POST_FROM_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadToS3(file: Buffer, name: string, mimetype: string) {
    const s3 = new AWS.S3(this.s3Option);

    try {
      const bucketParams = {
        Bucket: process.env.S3_BUCKET_NAME as string,
        Key: name,
        Body: file,
        ContentType: mimetype,
      };

      return await s3.upload(bucketParams).promise();
    } catch (error) {
      throw new HttpException(
        'CANNOT_UPLOAD_TO_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteS3Data(filePaths: string[]) {
    const s3Client = new S3Client(this.s3Option);

    try {
      const bucketParams = {
        Bucket: process.env.S3_BUCKET_NAME as string,
        Delete: {
          Objects: filePaths.map((filePath) => ({ Key: filePath })),
          Quiet: false,
        },
      };

      return await s3Client.send(new DeleteObjectsCommand(bucketParams));
    } catch (error) {
      throw new HttpException(
        'CANNOT_DELETE_DATA_IN_S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
