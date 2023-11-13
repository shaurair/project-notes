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

	try {
		userToken = req.headers.authorization.replace('Bearer ', '');
		memberInfo = token.decode(userToken);
	}
	catch(err) {
		res.status(403).send({data: {"message" : "User not log in"}});
		return;
	}

	result = await projectModel.getProjectContent(projectId);

	if(result.data.deadline != null) {
		let date = new Date(result.data.deadline);
		result.data.deadline = format(date, 'yyyy/MM/dd');
	}

	res.status(result.statusCode).send(result.data);
}

const update = async (req, res) => {
	let projectId = req.body.projectId;
	let content = req.body.content;
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

	res.send(req.body);
}

module.exports = {
	create,
	getContent,
	update
}