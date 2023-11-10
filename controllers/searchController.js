const searchModel = require('../models/searchModel');

const search = async (req, res) => {
	let name = req.query.name;
	let id = req.query.id;
	let team = req.query.team;
	let result;

	if(name) {
		result = await searchModel.searchName(name);
	}
	else if(id) {
		result = await searchModel.searchId(id);
	}
	else if(team) {
		result = await searchModel.searchTeam(team);
	}
	else {
		result = {data: {
			message: 'No results'
		}};
	}
	res.send(result);
}

module.exports = {
	search
}