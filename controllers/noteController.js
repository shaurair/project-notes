const noteModel		= require('../models/noteModel');
const projectModel	= require('../models/projectModel');
const token			= require('../models/token');

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

const deleteNote = async (req, res) => {
	let projectId = req.body.projectId;
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

	result = await noteModel.deleteNote(projectId, memberInfo['id']);
	res.status(result.statusCode).send(result['data']);
}

const getNotes = async (req, res) => {
	let nextPage = req.query.nextPage;
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

	result = await noteModel.getNotes(memberInfo['id'], nextPage);
	res.status(result.statusCode).send(result['data']);
}

const setTopNote = async (req, res) => {
	let projectId = req.body.projectId;
	let originalPos = req.body.originalPos;
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

	if(originalPos == null) {
		result = await noteModel.setTopNote(projectId, memberInfo['id']);
	}
	else {
		result = await noteModel.setTopNoteOriginalPos(projectId, memberInfo['id'], originalPos);
	}
	
	res.status(result.statusCode).send(result['data']);
}

module.exports = {
	addNote,
	getOneNote,
	deleteNote,
	getNotes,
	setTopNote
}