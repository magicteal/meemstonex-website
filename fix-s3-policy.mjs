import { S3Client, PutBucketPolicyCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function run() {
  const bucketName = process.env.AWS_S3_BUCKET;
  
  const readOnlyAnonUserPolicy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicReadGetObject",
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${bucketName}/*`]
      }
    ]
  };

  try {
    const cmd = new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify(readOnlyAnonUserPolicy)
    });
    await s3Client.send(cmd);
    console.log("Success attaching public read bucket policy");
  } catch (e) {
    if (e.name === 'AccessDenied') {
      console.error("Access denied. The IAM user might not have permissions to PutBucketPolicy, or 'Block Public Access' is enabled on the bucket.");
    }
    console.error("Error", e);
  }
}
run();
