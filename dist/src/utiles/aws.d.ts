/// <reference types="node" />
import * as AWS from 'aws-sdk';
export declare const s3Option: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
};
export declare const getS3Data: (filePath: string) => Promise<string>;
export declare const uploadToS3: (file: Buffer, name: string, mimetype: string) => Promise<AWS.S3.ManagedUpload.SendData>;
export declare const deleteS3Data: (filePaths: string[]) => Promise<import("@aws-sdk/client-s3").DeleteObjectsCommandOutput>;
