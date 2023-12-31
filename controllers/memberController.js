const token 			= require('../models/token');
const multer 			= require('multer');
const sharp 			= require('sharp');
const imageStorage 		= multer.memoryStorage();
const upload 			= multer({storage: imageStorage});
const operateStorage 	= require('../models/conn-aws-S3');
const memberModel 		= require('../models/memberModel');
const authModel 			= require('../models/authModel');

const updateImage = async (req, res) => {
	let userToken;
	let memberInfo;
	let newFilename;
	let result;

	try {
		userToken = req.headers.authorization.replace('Bearer ', '');
		memberInfo = token.decode(userToken);
	}
	catch(err) {
		res.status(403).send({data: {"message" : "User not log in"}});
		return;
	}

	if(req.file) {
		const fileMimeType = req.file.mimetype;

		if(fileMimeType === 'image/jpeg' || fileMimeType === 'image/png') {
			let imageResize = req.file.buffer;
			const image = sharp(imageResize);
			const imageMetaData = await image.metadata();

			if(imageMetaData.height > 150) {
				imageResize = await image.resize({height: 200, fit: 'contain'}).toBuffer();
			}

			newFilename = `${Date.now()}-${memberInfo.id}.${imageMetaData.format}`;
			result = await operateStorage.uploadToS3(imageResize, newFilename, fileMimeType, 'user_img');

			if(result.ok) {
				result = await memberModel.updateUserImage(memberInfo.id, newFilename);
				if(result.data.message == 'ok') {
					res.status(200).send({data: {"ok" : true, 'token' : userToken}});
				}
				else {
					res.status(500).send({data: {"message" : "Save image file to database failed"}});
				}
			}
			else {
				res.status(500).send({data: {"message" : "Upload image file failed"}});
			}
		}
		else {
			res.status(400).json({"message": "Upload file is not valid(only .png / .jpeg is allowed)"});
		}
	}
	else {
		res.status(400).send({data: {"message" : "None file request"}});
	}
}

const updateName = async (req, res) => {
	let userToken;
	let memberInfo;
	let newName = req.body.name;
	let result;

	try {
		userToken = req.headers.authorization.replace('Bearer ', '');
		memberInfo = token.decode(userToken);
	}
	catch(err) {
		res.status(403).send({data: {"message" : "User not log in"}});
		return;
	}

	result = await authModel.checkExistName(newName);
	if(result.data.message != 'ok') {
		res.status(result.statusCode).send(result);
		return;
	}

	result = await memberModel.updateUserName(memberInfo.id, newName);
	if(result.data.message == 'ok') {
		let payload = {
			'id': memberInfo.id,
			'name': newName,
			'email': memberInfo.email,
			'file_name': memberInfo.file_name
		};
		userToken = await token.encode(payload);
		res.status(200).send({data: {"ok" : true, 'token' : userToken}});
	}
	else {
		res.status(500).send({data: {"message" : "Save image file to database failed"}});
	}
}

module.exports = {
	updateImage,
	upload,
	updateName
}