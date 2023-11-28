const database = require('./conn-aws-RDS');

async function searchName(name) {
	let sql = 'SELECT id, name, image_filename FROM member WHERE name like ?;';
	try {
		let result = await database.databasePool.query(sql, [`%${name}%`]);

		if(result.length == 0) {
			return {
				data: {
					message: 'No results'
				},
				statusCode: 400
			};
		}
		else {
			return {
				data: {
					message: 'ok',
					result: result
				},
				statusCode: 200
			};
		}

	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

async function searchId(id) {
	let sql = 'SELECT id, name, image_filename FROM member WHERE id = ?;';
	try {
		let result = await database.databasePool.query(sql, [id]);

		if(result.length == 0) {
			return {
				data: {
					message: 'No results'
				},
				statusCode: 400
			};
		}
		else {
			return {
				data: {
					message: 'ok',
					result: result
				},
				statusCode: 200
			};
		}

	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

async function searchTeam(team) {
	let sql = 'SELECT id, name FROM group_table WHERE name like ?;';
	try {
		let result = await database.databasePool.query(sql, [`%${team}%`]);

		if(result.length == 0) {
			return {
				data: {
					message: 'No results'
				},
				statusCode: 400
			};
		}
		else {
			return {
				data: {
					message: 'ok',
					result: result
				},
				statusCode: 200
			};
		}

	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

module.exports = {
	searchName,
	searchId,
	searchTeam
}