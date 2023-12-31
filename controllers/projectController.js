const token 			= require('../models/token');
const dataFormat 		= require('../models/dataFormat');
const projectModel 		= require('../models/projectModel');
const authModel			= require('../models/authModel');
const multer 			= require('multer'); // process formData doc.
const operateStorage 	= require('../models/conn-aws-S3');
// const socketMethod 		= require('../routes/socketMethod');
const socketMethod 		= require('../routes/socket-io');
const MESSAGE_TYPE 		= require('../routes/socket-message').MESSAGE_TYPE;
const imageStorage 	= multer.memoryStorage();
const upload = multer({storage: imageStorage});

const create = async (req, res) => {
	let summary = req.body.summary;
	let description = req.body.description;
	let priority = req.body.priority;
	let deadline = req.body.deadline;
	let creator = req.body.creator;
	let associate = req.body.associate;
	let result;

	result = await projectModel.createProject(summary, description, priority, deadline, creator);

	if(result.data.message != 'ok') {
		res.status(result.statusCode).send(result.data);
		return;
	}
	else {
		let projectId = result.data.id;
		result = await projectModel.setAssociate(associate, projectId);
		res.status(result.statusCode).send(result.data);
	}
}

const getAuthorization = async (req, res) => {
	let projectId = req.query.id;
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
	res.status(result.statusCode).send(result.data);
}

const getContent = async (req, res) => {
	let projectId = req.query.id;
	let userToken;
	let result;

	try {
		userToken = req.headers.authorization.replace('Bearer ', '');
		token.decode(userToken);
	}
	catch(err) {
		res.status(403).send({data: {"message" : "User not log in"}});
		return;
	}

	result = await projectModel.getProjectContent(projectId);
	res.status(result.statusCode).send(result.data);
}

const getComment = async (req, res) => {
	let projectId = req.query.projectId;
	let nextCommentCursor = req.query.nextCommentCursor;
	let userToken;
	let result;

	try {
		userToken = req.headers.authorization.replace('Bearer ', '');
		token.decode(userToken);
	}
	catch(err) {
		res.status(403).send({data: {"message" : "User not log in"}});
		return;
	}

	result = await projectModel.getComment(projectId, nextCommentCursor);
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

	res.status(result.statusCode).send(result.data);
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

	// notify owner and users involved in discussion
	let informMessage = await setInformMessage(memberInfo['id'], projectId, comment, result.data.commentId, datetime);
	let allInformUser = await getInvolvedUserList(projectId, memberInfo['id']);

	allInformUser.forEach(memberId=>{
		if(socketMethod.checkUserConnected(memberId)) {
			socketMethod.notify(memberId, informMessage);
		}
		else {
			projectModel.addNotification(projectId, memberId, MESSAGE_TYPE.REPLY_TO_MY_PROJECT);
		}
	})
}

async function setInformMessage(memberId, projectId, comment, commentId, datetime) {
	result = await authModel.getUserInfo(memberId);

	let informMessage= {
		projectId: projectId,
		message: `Someone replies to project-${projectId}`,
		newCommentCreatorName: result.data.name,
		newCommentCreatorImage: result.data.imageFilename,
		newCommentCreatorId: memberId,
		newCommentText: comment,
		newCommentId: commentId,
		newCommentDatetime: datetime
	}
	return informMessage;
}

async function getInvolvedUserList(projectId, commentMemberId) {
	let ownerIdList = [];
	result = await projectModel.getRoleInOneProject(projectId);
	if(result.data.message == 'ok') {
		ownerIdList = result.data.roles.filter(member=>member.role === 'owner').map(owner=>owner.id);
	}

	let commentUserIdList = [];
	result = await projectModel.getCommentUser(projectId);
	if(result.data.message == 'ok') {
		commentUserIdList = result.data.user.map(user=>user.id)
	}

	let allInformUser = [...new Set([...commentUserIdList, ...ownerIdList])];
	allInformUser = allInformUser.filter(memberId => memberId !== commentMemberId);
	return allInformUser;
}

const deleteComment = async (req, res) => {
	let commentId = req.query.commentId;
	let userToken;
	let result;

	try {
		userToken = req.headers.authorization.replace('Bearer ', '');
		token.decode(userToken);
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
	let result;

	try {
		userToken = req.headers.authorization.replace('Bearer ', '');
		token.decode(userToken);
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
	let result;
	let roleResult;
	let projectIdList = [];
	let roles = {};

	try {
		userToken = req.headers.authorization.replace('Bearer ', '');
		token.decode(userToken);
	}
	catch(err) {
		res.status(403).send({data: {"message" : "User not log in"}});
		return;
	}
	result = await projectModel.getProjectMain(memberId, status, page, keyword, myRole);
	if(result.data.message != 'ok') {
		res.status(result.statusCode).send(result.data);
		return;
	}

	result.data.content.forEach(content => {
		content.deadline = dataFormat.setDateFormateSlash(content.deadline);
		projectIdList.push(content.project_id)
		roles[content.project_id] = {owner:[], reviewer:[]}
	});

	if(result.data.content.length != 0 ) {
		roleResult = await projectModel.getRoleInProjectList(projectIdList);
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

const addFile = async (req, res) => {
	let projectId = req.body.projectId;
	let fileName = req.body.fileName;
	let datetime = req.body.datetime;
	let file = req.file;
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

	if(!file) {
		res.status(400).send({data: {"message" : "None file request"}});
		return;
	}

	result = await operateStorage.uploadToS3(file.buffer, fileName, file.mimetype, `project-${projectId}`);

	if(result.ok) {
		result = await projectModel.addFile(projectId, memberInfo['id'], fileName, datetime);
		res.status(result.statusCode).send(result.data);
	}
	else {
		res.status(500).send({"message" : "Upload file failed"});
	}
}

const getFile = async (req, res) => {
	let projectId = req.query.projectId;
	let userToken;
	let result;

	try {
		userToken = req.headers.authorization.replace('Bearer ', '');
		token.decode(userToken);
	}
	catch(err) {
		res.status(403).send({data: {"message" : "User not log in"}});
		return;
	}

	result = await projectModel.getFile(projectId);
	res.status(result.statusCode).send(result.data);
}

const deleteFile = async (req, res) => {
	let fileId = req.query.fileId;
	let fileName = req.query.fileName;
	let projectId = req.query.projectId;
	let userToken;
	let result;

	try {
		userToken = req.headers.authorization.replace('Bearer ', '');
		token.decode(userToken);
	}
	catch(err) {
		res.status(403).send({data: {"message" : "User not log in"}});
		return;
	}

	result = await operateStorage.deleteFileOnS3(fileName,  `project-${projectId}`);
	if(!result.ok) {
		res.status(500).send({"message" : "Upload file failed"});
		return;
	}

	result = await projectModel.deleteFile(fileId);
	res.status(result.statusCode).send(result.data);
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
	getProjectMainAndRole,
	getAuthorization,
	addFile,
	upload,
	getFile,
	deleteFile
}