const token = require('../utilities/token');
const multer = require('multer');
const sharp = require('sharp');
const imageStorage = multer.memoryStorage();
const upload = multer({storage: imageStorage});
const operateStorage = require('../utilities/conn-aws-S3');
const memberModel = require('../models/memberModel')

const updateImage = async (req, res) => {
	let userToken;
	let memberInfo;
	let existFilename = null;
	let newFilename;
	let result;

	try {
		userToken = req.headers.authorization.replace('Bearer ', '');
		memberInfo = token.decode(userToken);
		existFilename = memberInfo.file_name;
	}
	catch(err) {
		res.status(403).send({data: {"message" : "User not log in"}});
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
			result = await operateStorage.uploadToImageStorage(imageResize, newFilename, fileMimeType);

			if(result.ok) {
				result = await memberModel.updateUserImage(memberInfo.id, newFilename);
				if(result.data.message == 'ok') {
					if(existFilename != null) {
						operateStorage.deleteImageOnStorage(existFilename);
					}

					let payload = {
						'id': memberInfo.id,
						'name': memberInfo.name,
						'email': memberInfo.email,
						'file_name': newFilename
					};
					userToken = await token.encode(payload);
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

module.exports = {
	updateImage,
	upload
}