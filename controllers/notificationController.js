const notificationModel	= require('../models/notificationModel');
const token				= require('../utilities/token');
const MESSAGE_TYPE 		= require('../utilities/socket-message').MESSAGE_TYPE;

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

const getHistoryUpdate = async (req, res) => {
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

	result = await notificationModel.getHistoryUpdate(memberInfo['id']);
	result['data'].notification.forEach(notificationItem=>{
		let projectId = notificationItem['project_id']
		if(notificationItem['messageText'] === MESSAGE_TYPE.REPLY_TO_MY_PROJECT) {
			notificationItem['messageText'] = `Someone replies to project-${projectId}`;
		}
		else if(notificationItem['messageText'] === MESSAGE_TYPE.UPDATE_MY_PROJECT) {
			notificationItem['messageText'] = `Someone updates project-${projectId}`;
		}
	})
	res.status(result.statusCode).send(result['data']);
}

module.exports = {
	getExpiredProjectId,
	getHistoryUpdate
}