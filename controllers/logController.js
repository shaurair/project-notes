const logModel = require('../models/logModel');
const token = require('../utilities/token');

const checkSignInData = async (req, res) => {
	let email = req.body.email;
	let password = req.body.password;
	let result = await logModel.checkUserSignIn(email, password);

	if(result.statusCode == 200) {
		let payload = {
			'id': result.data.id,
			'name': result.data.name,
			'email': email
		};

		let userToken = await token.encode(payload);
		res.status(result.statusCode).send({'token': userToken});
	}
	else {
		res.status(result.statusCode).send(result.data);
	}
}

module.exports = {
	checkSignInData
}