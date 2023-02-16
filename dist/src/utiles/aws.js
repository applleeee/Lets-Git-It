"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteS3Data = exports.uploadToS3 = exports.getS3Data = exports.s3Option = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const AWS = require("aws-sdk");
exports.s3Option = {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACEESS_KEY,
    region: 'ap-northeast-2',
};
const getS3Data = async (filePath) => {
    const s3Client = new client_s3_1.S3Client(exports.s3Option);
    try {
        const streamToString = (stream) => {
            return new Promise((resolve, reject) => {
                const chunks = [];
                stream.on('data', (chunk) => chunks.push(chunk));
                stream.on('error', reject);
                stream.on('end', () => resolve(Buffer.concat(chunks)));
            });
        };
        const bucketParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: filePath,
        };
        const data = await s3Client.send(new client_s3_1.GetObjectCommand(bucketParams));
        const bodyContents = await streamToString(data.Body);
        return bodyContents.toString();
    }
    catch (err) {
        console.log(err);
        throw new Error(err);
    }
};
exports.getS3Data = getS3Data;
const uploadToS3 = async (file, name, mimetype) => {
    try {
        const s3 = new AWS.S3(exports.s3Option);
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: name,
            Body: file,
            ContentType: mimetype,
        };
        return await s3.upload(params).promise();
    }
    catch (err) {
        console.log(err);
        throw new Error(err);
    }
};
exports.uploadToS3 = uploadToS3;
const deleteS3Data = async (filePaths) => {
    try {
        const s3Client = new client_s3_1.S3Client(exports.s3Option);
        const bucketParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Delete: {
                Objects: filePaths.map((filePath) => ({ Key: filePath })),
                Quiet: false,
            },
        };
        return await s3Client.send(new client_s3_1.DeleteObjectsCommand(bucketParams));
    }
    catch (err) {
        console.log(err);
        throw new Error(err);
    }
};
exports.deleteS3Data = deleteS3Data;
//# sourceMappingURL=aws.js.map