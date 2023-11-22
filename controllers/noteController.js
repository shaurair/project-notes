const noteModel		= require('../models/noteModel');
const projectModel	= require('../models/projectModel');
const token			= require('../utilities/token');

const addNote = async (req, res) => {
	let projectId = req.body.projectId;
	let note = req.body.note;
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

	result = await projectModel.getAuthorization(projectId, memberInfo['id']);
	if(result.data.message != 'ok') {
		res.status(result.statusCode).send(result);
		return;
	}

	result = await noteModel.addNote(projectId, memberInfo['id'], note);
	res.status(result.statusCode).send(result);
}

const getOneNote = async (req, res) => {
	let projectId = req.query.projectId;
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

	result = await projectModel.getAuthorization(projectId, memberInfo['id']);
	if(result.data.message != 'ok') {
		res.status(result.statusCode).send(result);
		return;
	}

	result = await noteModel.getOneNote(projectId, memberInfo['id']);
	res.status(result.statusCode).send(result['data']);
}

module.exports = {
	addNote,
	getOneNote
}