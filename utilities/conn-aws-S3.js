require('dotenv').config();
const {S3Client, PutObjectCommand, DeleteObjectCommand} = require("@aws-sdk/client-s3")
const myBucket = process.env.S3_BUCKET;

const s3 = new S3Client({
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY_ID,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
	},
	region: process.env.S3_REGION
});

async function uploadToS3(buffer, imageFilename, fileMimeType, uploadFolder) {
	const params = {
		Bucket: myBucket,
		Key: `project-note/${uploadFolder}/${imageFilename}`,
		Body: buffer,
		ContentType: fileMimeType
	};
	const command = new PutObjectCommand(params);

	let response = await s3.send(command);
	let result = {};

	result["ok"] = (response["$metadata"]["httpStatusCode"] == 200) ? true : false;
	return result;
}

async function deleteFileOnS3(imageFilename) {
	const params = {
		Bucket: myBucket,
		Key: `project-note/user_img/${imageFilename}`
	};
	const command = new DeleteObjectCommand(params);

	let response = await s3.send(command);
	let result = {};

	result["ok"] = (response["$metadata"]["httpStatusCode"] == 200) ? true : false;
	return result;
}

module.exports = {
	uploadToImageStorage: uploadToS3,
	deleteImageOnStorage: deleteFileOnS3
}