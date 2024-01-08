import {
  S3Client,
  // This command supersedes the ListObjectsCommand and is the recommended way to list objects.
  ListObjectsV2Command,
  _Object,
  GetObjectCommand,
} from '@aws-sdk/client-s3';

const client = new S3Client({
  region: 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY ?? '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET ?? '',
  },
});

export const getObjects = async (bucketName: string) => {
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    // The default and maximum number of keys returned is 1000. This limits it to
    // one for demonstration purposes.
    MaxKeys: 1,
  });

  try {
    let isTruncated = true;

    let contents: Array<_Object> = [];

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } = await client.send(command);
      contents?.push(Contents ? Contents[0] : {});
      isTruncated = IsTruncated as boolean;
      command.input.ContinuationToken = NextContinuationToken;
    }
    return contents;
  } catch (err) {
    console.error(err);
  }
};

export const getObjectByFilename = async (bucketName: string, filename: string) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: filename,
  });
  try {
    const response = await client.send(command);
    return response;
  } catch (err) {
    console.error(err);
  }
};
