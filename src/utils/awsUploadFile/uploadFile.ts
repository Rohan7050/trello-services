import { AWS_ACCESS_KEY_ID, AWS_BUCKET, AWS_REGION, AWS_SECRET_ACCESS_KEY } from '../../config';
import { makeRandomStr } from '../rendomGenerator/randomIdGen';
const AWS = require('aws-sdk');

const s3Client = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

export async function uploadOnAws(file: any, name: string, useBuffer = true, path = 'unknown') {
  console.log('UploadFileOnAws');
  // name = name + '_' + makeRandomStr(10, 'random');
  console.log('path', path);
  name = name.split('.').join(`${makeRandomStr(10, 'random')}.`);
  
  return new Promise((resolve, reject) => {
    const uploadParams = {
      Bucket: AWS_BUCKET + '/' + path,
      Key: name,
      Body: useBuffer ? file.buffer : file,
      ContentType: useBuffer ? file.mimetype : 'application/pdf',
    };
    console.log('uploadParams', uploadParams.ContentType)
    s3Client.upload(uploadParams, (err: any, data: any) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      console.log(data);
      return resolve(data.Location);
    });
  });
}

export async function getFile(key: string, res: any) {
  const option = {
    Bucket: AWS_BUCKET,
    Key: key,
  };
  const fileStream = s3Client.getObject(option).createReadStream();
  return {
    data: fileStream.pipe(res),
  };
}

export async function getURL(key: string) {
  if (key === '') {
    return '';
  }
  const option = {
    Bucket: AWS_BUCKET,
    Key: key,
    Expires: 3600 * 2,
  };
  return s3Client.getSignedUrl('getObject', option);
}

export const getS3 = async (file: any, name: string, path = 'unknown', useBuffer = true) => {
  console.log('path', path);
  const link = await uploadOnAws(file, name.replace(/[^a-zA-Z0-9.]/g, '-'), useBuffer, path);
  if (typeof link === 'string') {
    return link;
  }
  return 'error';
};

export async function getSize() {
  const s3 = new AWS.S3();

  const responce = await s3.listObjectsV2({
    Bucket: 'asmadiya-portal-s3bucket',
  });

  console.log(responce);
}

export async function deleteFiles(filePath: string) {
    try {
      console.log('filePath', filePath)
      const params = {
        Bucket: AWS_BUCKET,
        Key: filePath
      }
      const data = await s3Client.deleteObject(params).promise();
      console.log('Successfully deleted the file:', filePath)
    } catch (error) {
      return error;
    }
  return true;
}