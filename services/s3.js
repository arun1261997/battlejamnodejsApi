import dotenv from 'dotenv';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import cryptoRandomString from 'crypto-random-string';

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

export const getS3Url = (key) => {
  if (!key) return '';
  return `${process.env.AWS_BUCKET_URL}/${key}`;
};

export const getS3KeyFromUrl = (url) => {
  if (!url) return '';
  return url.replace(`${process.env.AWS_BUCKET_URL}/`, '');
};

export const uploadFile = async (buffer, contentType) => {
  const key = cryptoRandomString({
    type: 'hex',
    length: 25,
  });

  await s3.send(
    new PutObjectCommand({
      Body: buffer,
      Bucket: process.env.AWS_BUCKET_NAME,
      ACL: 'public-read',
      Key: key,
      ContentType: contentType,
    })
  );

  return {
    key,
    url: getS3Url(key),
  };
};

export default s3;
