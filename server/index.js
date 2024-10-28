const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Set up AWS credentials and region configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'ap-southeast-1' // Change to your region
});


// Set up S3 and Rekognition
const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();

// Set up Express
const app = express();
const port = 9090;
app.use(cors());

// Set up multer for image upload
const upload = multer({ dest: 'uploads/' });

// Upload images to S3
const uploadToS3 = async (file) => {
  const fileContent = fs.readFileSync(file.path);
  const params = {
    Bucket: process.env.AWS_BUCKET, // Replace with your bucket name
    Key: `images/${file.originalname}`, // File name in S3
    Body: fileContent,
    ContentType: file.mimetype,
  };

  // Upload the file to S3
  return s3.upload(params).promise();
};

// Compare faces using AWS Rekognition
const compareFaces = async (sourceImageKey, targetImageKey) => {
  const params = {
    SourceImage: {
      S3Object: {
        Bucket: process.env.AWS_BUCKET,
        Name: sourceImageKey,
      },
    },
    TargetImage: {
      S3Object: {
        Bucket: process.env.AWS_BUCKET,
        Name: targetImageKey,
      },
    },
    SimilarityThreshold: 80,
  };

  return rekognition.compareFaces(params).promise();
};


// KYC Submission endpoint
app.post('/submit-kyc', upload.fields([{ name: 'passportImage' }, { name: 'faceWithPassportImage' }]), async (req, res) => {
  try {
    const { firstName, lastName, email, dob } = req.body;

    // Validate data
    if (!firstName || !lastName || !email || !dob) {
      return res.status(400).send('Missing required fields');
    }

    const passportImageFile = req.files.passportImage[0];
    const faceWithPassportImageFile = req.files.faceWithPassportImage[0];

    // Upload images to S3
    const passportUploadResult = await uploadToS3(passportImageFile);
    console.log("passportUploadResult: ", passportUploadResult)
    const faceUploadResult = await uploadToS3(faceWithPassportImageFile);
    console.log("faceUploadResult: ", faceUploadResult)

    // Perform face comparison
    const comparisonResult = await compareFaces(passportUploadResult.Key, faceUploadResult.Key);

    // Return the similarity score and face details
    console.log("\ncomparisonResult: ", comparisonResult)
    if (comparisonResult.FaceMatches.length > 0) {
      const match = comparisonResult.FaceMatches[0];
      res.json({
        similarity: match.Similarity,
        faceDetails: match,
        status: "match"
      });
    } else {
      const match = comparisonResult.UnmatchedFaces[0];
      console.log("Unmatch: ", match)
      res.json({
        similarity: match.Confidence,
        faceDetails: match,
        status: "unmatch"
      });
    }
  } catch (error) {
    console.error('Error during KYC submission:', error);
    res.status(500).send('KYC submission failed');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
