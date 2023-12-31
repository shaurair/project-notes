const groupModel 	= require('../models/groupModel');
const token 		= require('../models/token');

const createGroup = async (req, res) => {
	let name = req.body.name;
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

	result = await groupModel.checkExistTeam(name);
	if(result.data.message != 'ok') {
		res.status(result.statusCode).send(result);
		return;
	}

	result = await groupModel.addTeam(name, memberInfo['id']);
	res.status(result.statusCode).send(result);
}

const getMyGroup = async (req, res) => {
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

	result = await groupModel.getMyGroup(memberInfo['id']);
	res.status(result.statusCode).send(result);
}

const getGroupMember = async (req, res) => {
	let userToken;
	let memberInfo;
	let groupId = req.query.groupId;
	let result;

	try {
		userToken = req.headers.authorization.replace('Bearer ', '');
		memberInfo = token.decode(userToken);
	}
	catch(err) {
		res.status(403).send({data: {"message" : "User not log in"}});
		return;
	}

	result = await groupModel.getGroupMember(groupId);
	res.status(result.statusCode).send(result);
}

const updateMember = async (req, res) => {
	let userToken;
	let memberInfo;
	let groupId = req.query.groupId;
	let memberDiff = req.body.memberDiff;
	let result;

	try {
		userToken = req.headers.authorization.replace('Bearer ', '');
		memberInfo = token.decode(userToken);
	}
	catch(err) {
		res.status(403).send({data: {"message" : "User not log in"}});
		return;
	}

	result = await groupModel.updateMember(groupId, memberDiff);
	res.status(result.statusCode).send(result);
}

const updateTeamName = async (req, res) => {
	let userToken;
	let memberInfo;
	let groupId = req.query.groupId;
	let newName = req.query.name;
	let result;

	try {
		userToken = req.headers.authorization.replace('Bearer ', '');
		memberInfo = token.decode(userToken);
	}
	catch(err) {
		res.status(403).send({data: {"message" : "User not log in"}});
		return;
	}

	result = await groupModel.checkExistTeam(newName);
	if(result.data.message != 'ok') {
		res.status(result.statusCode).send(result);
		return;
	}

	result = await groupModel.updateTeamName(groupId, newName);
	res.status(result.statusCode).send(result);
}

module.exports = {
	createGroup,
	getMyGroup,
	getGroupMember,
	updateMember,
	updateTeamName
}