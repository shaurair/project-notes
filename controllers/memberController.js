const token = require('../utilities/token');
const multer = require('multer');
const imageStorage = multer.memoryStorage();
const upload = multer({storage: imageStorage});

const updateImage = (req, res) => {
	// debug temp
	console.log(req.file)
	let existFilename = null;

	try {
		let userToken = req.headers.authorization.replace('Bearer ', '');
		existFilename = token.decode(userToken).file_name;
	}
	catch(err) {
		res.status(403).send({data: {"message" : "User not log in"}});
	}

	if(req.file) {
		// resize

		if(existFilename == null) {
			// Add
		}
		else {
			// Update
		}

		// debug temp
		res.status(200).send({data: {"message" : "Well received"}});
	}
	else {
		res.status(400).send({data: {"message" : "None file request"}});
	}
}

module.exports = {
	updateImage,
	upload
}