const token = require('../utilities/token');
const multer = require('multer');
const sharp = require('sharp');
const imageStorage = multer.memoryStorage();
const upload = multer({storage: imageStorage});

const updateImage = async (req, res) => {
	let memberInfo;
	let existFilename = null;

	try {
		let userToken = req.headers.authorization.replace('Bearer ', '');
		memberInfo = token.decode(userToken);
		existFilename = memberInfo.file_name;
	}
	catch(err) {
		res.status(403).send({data: {"message" : "User not log in"}});
	}

	if(req.file) {
		const fileMimeType = req.file.mimetype;

		if(fileMimeType === 'image/jpeg' || fileMimeType === 'image/png') {
			// resize
			let imageResize = req.file.buffer;
			const image = sharp(imageResize);
			const imageMetaData = await image.metadata();

			if(imageMetaData.height > 150) {
				imageResize = await image.resize({height: 200, fit: 'contain'}).toBuffer();
			}

			if(existFilename == null) {
				// Add
				existFilename = memberInfo.id + '.' + imageMetaData.format;

			}
			else {
				// Update
			}

			// debug temp
			res.status(200).send({data: {"message" : "Well received"}});
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