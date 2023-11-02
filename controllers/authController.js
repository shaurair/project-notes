const token = require('../utilities/token');

const getUser = (req, res) => {
	try {
		let userToken = req.headers.authorization.replace('Bearer ', '');
		let member = token.decode(userToken);

		res.send({data: member})
	}
	catch(err) {
		res.send({data: null})
	}
}

module.exports = {
	getUser
}