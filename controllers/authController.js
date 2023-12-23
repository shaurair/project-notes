const authModel 	= require('../models/authModel');
const token 		= require('../models/token');

const getUser = async (req, res) => {
	try {
		let userToken = req.headers.authorization.replace('Bearer ', '');
		let member = token.decode(userToken);
		let result = await authModel.getUserInfo(member['id']);
		member['name'] = result.data.name;
		member['imageFilename'] = result.data.imageFilename;

		let data = {
			id: member['id'],
			email: member['email'],
			name: result['data']['name'],
			file_name: result['data']['imageFilename']
		}

		res.send({data: data})
	}
	catch(err) {
		res.send({data: null})
	}
}

const checkSignInData = async (req, res) => {
	let email = req.body.email;
	let password = req.body.password;
	let result = await authModel.checkUserSignIn(email, password);

	if(result.statusCode == 200) {
		let payload = {
			'id': result.data.id,
			'email': email
		};

		let userToken = token.encode(payload);
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
	let result = await authModel.checkExistName(name);

	if(result.data.message == "ok") {
		result = await authModel.checkExistEmail(email);
		if(result.data.message == "ok") {
			result = await authModel.signUpUserData(name, email, password);
			res.status(result.statusCode).send(result.data);
			return;
		}
	}

	res.status(result.statusCode).send(result.data);
}


module.exports = {
	getUser,
	checkSignInData,
	checkSignUpData
}