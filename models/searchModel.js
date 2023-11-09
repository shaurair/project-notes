const database = require('./conn-aws-RDS');

async function searchName(name) {
	let sql = 'SELECt id, name, image_filename FROM member WHERE name like ?;';
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
		console.error(error)

		return {
			data: {
				message: 'Something wrong while operating database, please refresh and try again',
			},
			statusCode: 500
		}
	}
}

async function searchId(id) {
	let sql = 'SELECt id, name, image_filename FROM member WHERE id = ?;';
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
		console.error(error)

		return {
			data: {
				message: 'Something wrong while operating database, please refresh and try again',
			},
			statusCode: 500
		}
	}
}

module.exports = {
	searchName,
	searchId
}