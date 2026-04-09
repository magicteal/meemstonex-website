const { S3Client, PutObjectAclCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function run() {
  try {
    const cmd = new PutObjectAclCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: 'meemstonex-uploads/4d489555-5a0d-454e-818b-9b5bef7f8205.webp',
      ACL: 'public-read'
    });
    await s3Client.send(cmd);
    console.log("Success");
  } catch (e) {
    console.error("Error", e);
  }
}
run();
