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

module.exports = {
	getUser
}