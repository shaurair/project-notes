const projectModel = require('../models/projectModel');

const create = async (req, res) => {
	let summary = req.body.summary;
	let description = req.body.description;
	let priority = req.body.priority;
	let deadline = req.body.deadline;
	let creator = req.body.creator;
	let associate = req.body.associate;
	let projectId = result.data.id;
	let data;
	let result = await projectModel.createProject(summary, description, priority, deadline, creator);

	if(result.data.message != 'ok') {
		res.status(result.statusCode).send(result.data);
		return;
	}
	else {
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

module.exports = {
	create
}