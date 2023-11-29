const notificationModel	= require('../models/notificationModel');
const token				= require('../utilities/token');

const getExpiredProjectId = async (req, res) => {
	let userToken;
	let memberInfo;
	let result;

	try {
		userToken = req.headers.authorization.replace('Bearer ', '');
		memberInfo = token.decode(userToken);
	}
	catch(err) {
		res.status(403).send({data: {"message" : "User not log in"}});
		return;
	}

	let now = new Date();
	let year = now.getFullYear();
	let month = (now.getMonth() + 1).toString().padStart(2, '0');
	let day = now.getDate().toString().padStart(2, '0');
	let formattedDate = `${year}-${month}-${day}`;

	result = await notificationModel.getExpiredProjectId(memberInfo['id'], formattedDate);
	res.status(result.statusCode).send(result['data']);
}
module.exports = {
	getExpiredProjectId,
}