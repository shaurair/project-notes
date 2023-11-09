const projectModel = require('../models/projectModel');

const create = async (req, res) => {
	let summary = req.body.summary;
	let description = req.body.description;
	let priority = req.body.priority;
	let deadline = req.body.deadline;
	let creator = req.body.creator;
	let result = await projectModel.createProject(summary, description, priority, deadline, creator);
	res.status(result.statusCode).send(result.data);
}

module.exports = {
	create
}