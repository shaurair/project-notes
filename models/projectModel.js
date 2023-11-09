const database = require('./conn-aws-RDS');

async function createProject(summary, description, priority, deadline, creator) {
	let sql = 'INSERT INTO project(summary, description, priority, deadline, creater_id) VALUES(?, ?, ?, ?, ?);';
	try {
		let result = await database.databasePool.query(sql, [summary, description, priority, deadline, creator]);

		return {
			data: {
				message: 'ok',
				id: result.insertId
			},
			statusCode: 200
		};
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
	createProject
}