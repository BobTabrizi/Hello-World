const AWS = require("aws-sdk");

export default async function handler(req, res) {
  const countryID = req.query.id;
  const myBucket = process.env.AWS_BUCKET_NAME;
  const myKey = `${countryID}.png`;
  const signedUrlExpireSeconds = 60 * 3;
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    signatureVersion: "v4",
    region: "us-west-1",
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });

  const signedUrl = s3.getSignedUrl("getObject", {
    Bucket: myBucket,
    Key: myKey,
    Expires: signedUrlExpireSeconds,
  });
  res.json(signedUrl);
}
