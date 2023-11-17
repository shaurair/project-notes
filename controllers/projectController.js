const token = require('../utilities/token');
const projectModel = require('../models/projectModel');
const { format } = require('date-fns');

const create = async (req, res) => {
	let summary = req.body.summary;
	let description = req.body.description;
	let priority = req.body.priority;
	let deadline = req.body.deadline;
	let creator = req.body.creator;
	let associate = req.body.associate;
	let data;
	let result;

	result = await projectModel.createProject(summary, description, priority, deadline, creator);

	if(result.data.message != 'ok') {
		res.status(result.statusCode).send(result.data);
		return;
	}
	else {
		let projectId = result.data.id;
		result = await projectModel.setAssociate(associate, projectId);
		if(result.data.message != 'ok') {
			res.status(result.statusCode).send(result.data);
			return;
		}
		else {
			data = {
				message: 'ok',
				id: projectId
			}
			res.status(result.statusCode).send(data);
		}
	}
}

const getContent = async (req, res) => {
	let projectId = req.query.id;
	let userToken;
	let memberInfo;
	let result;
	let auth;

	try {
		userToken = req.headers.authorization.replace('Bearer ', '');
		memberInfo = token.decode(userToken);
	}
	catch(err) {
		res.status(403).send({data: {"message" : "User not log in"}});
		return;
	}

	result = await projectModel.getAuthorization(projectId, memberInfo['id']);
	if(result.data.message != 'ok' || result.data.auth == 0) {
		res.status(result.statusCode).send(result.data);
		return
	}
	auth = result.data.auth;

	result = await projectModel.getProjectContent(projectId, auth);

	if(result.data.deadline != null) {
		let date = new Date(result.data.deadline);
		result.data.deadline = format(date, 'yyyy/MM/dd');
	}

	res.status(result.statusCode).send(result.data);
}

const getComment = async (req, res) => {
	let projectId = req.query.projectId;
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

	result = await projectModel.getComment(projectId, nextPage);
	res.status(result.statusCode).send(result.data);
}

const update = async (req, res) => {
	let projectId = req.body.projectId;
	let content = req.body.content;
	let owner = req.body.owner;
	let reviewer = req.body.reviewer;
	let team = req.body.team;
	let changedItemList = Object.keys(content);
	let changedValueList;
	let result;

	if(changedItemList.length != 0) {
		changedValueList = changedItemList.map(itemKey => content[itemKey]);
		result = await projectModel.updateProject(projectId, changedItemList, changedValueList);
		if(result.data.message != 'ok') {
			res.status(result.statusCode).send(result.data);
			return;
		}
	}

	result = await projectModel.updateAssociatePeople(projectId, 'owner', owner);
	if(result.data.message != 'ok') {
		res.status(result.statusCode).send(result.data);
		return;
	}

	result = await projectModel.updateAssociatePeople(projectId, 'reviewer', reviewer);
	if(result.data.message != 'ok') {
		res.status(result.statusCode).send(result.data);
		return;
	}

	result = await projectModel.updateAssociateGroup(projectId, team);
	if(result.data.message != 'ok') {
		res.status(result.statusCode).send(result.data);
		return;
	}

	res.send(req.body);
}

const updateStatus = async (req, res) => {
	let projectId = req.body.projectId;
	let status = req.body.status;
	let result;

	result = await projectModel.updateProjectStatus(projectId, status);
	res.status(result.statusCode).send(result.data);
}

const addComment = async (req, res) => {
	let projectId = req.body.projectId;
	let comment = req.body.comment;
	let datetime = req.body.datetime;
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

	result = await projectModel.addComment(projectId, memberInfo['id'], comment, datetime);
	res.status(result.statusCode).send(result.data);
}

const deleteComment = async (req, res) => {
	let commentId = req.query.commentId;
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

	result = await projectModel.deleteComment(commentId);
	res.status(result.statusCode).send(result.data);
}

const updateComment = async (req, res) => {
	let commentId = req.body.commentId;
	let comment = req.body.comment;
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

	result = await projectModel.updateComment(commentId, comment);
	res.status(result.statusCode).send(result.data);
}

const getProjectMainAndRole = async (req, res) => {
	let memberId = req.query.memberId;
	let status = req.query.status;
	let page = req.query.page;
	let myRole = req.query.myRole;
	let keyword = req.query.keyword;
	let userToken;
	let memberInfo;
	let result;
	let roleResult;
	let projectIdList = [];
	let roles = {};

	try {
		userToken = req.headers.authorization.replace('Bearer ', '');
		memberInfo = token.decode(userToken);
	}
	catch(err) {
		res.status(403).send({data: {"message" : "User not log in"}});
		return;
	}
	result = await projectModel.getProjectMain(memberId, status, page, keyword);
	if(result.data.message != 'ok') {
		res.status(result.statusCode).send(result.data);
		return;
	}

	result.data.content.forEach(content => {
		if(content.deadline != null) {
			let date = new Date(content.deadline);
			content.deadline = format(date, 'yyyy/MM/dd');
		}
		projectIdList.push(content.project_id)
		roles[content.project_id] = {owner:[], reviewer:[]}
	});

	if(result.data.content.length != 0 ) {
			roleResult = await projectModel.getProjectRole(projectIdList);
		if(roleResult.data.message != 'ok') {
			res.status(roleResult.statusCode).send(roleResult.data);
			return;
		}

		roleResult.data.roles.forEach(role => {
			roles[role.project_id][role.role].push({name:role.name, image:role.image_filename})
		})
	}



	res.status(result.statusCode).send({content: result.data.content, roles:roles, nextPage: result.data.nextPage})
}

module.exports = {
	create,
	getContent,
	update,
	addComment,
	getComment,
	deleteComment,
	updateComment,
	updateStatus,
	getProjectMainAndRole
}