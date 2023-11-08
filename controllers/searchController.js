const searchModel = require('../models/searchModel');

const search = async (req, res) => {
	let name = req.query.name;
	let id = req.query.id;
	let result;

	if(name) {
		result = await searchModel.searchName(name);
	}
	else if(id) {
		result = await searchModel.searchId(id);
	} 
	res.send(result);
}

module.exports = {
	search
}