const logModel = require('../models/logModel');
const token = require('../utilities/token');

const checkSignInData = async (req, res) => {
	let email = req.body.email;
	let password = req.body.password;
	let result = await logModel.checkUserSignIn(email, password);

	if(result.statusCode == 200) {
		let payload = {
			'id': result.data.id,
			'email': email
		};

		let userToken = await token.encode(payload);
		res.status(result.statusCode).send({'token': userToken});
	}
	else {
		res.status(result.statusCode).send(result.data);
	}
}

const checkSignUpData = async (req, res) => {
	let name = req.body.name;
	let email = req.body.email;
	let password = req.body.password;
	let result = await logModel.checkExistEmail(email);

	if(result.data.message == "ok") {
		result = await logModel.signUpUserData(name, email, password);
		res.status(result.statusCode).send(result.data);
	}
	else {
		res.status(result.statusCode).send(result.data);
	}

}

module.exports = {
	checkSignInData: checkSignInData,
	checkSignUpData: checkSignUpData
}