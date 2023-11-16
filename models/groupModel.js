const database = require('./conn-aws-RDS');

async function checkExistTeam(name) {
	let sql = 'SELECT * FROM group_table WHERE name = ?;';
	try {
		let result = await database.databasePool.query(sql, [name]);
		if(result.length == 0) {
			return {
				data: {
					message: 'ok'
				}
			};
		}
		else {
			return {
				data: {
					message: 'This team name is already exist!'
				},
				statusCode: 400
			};
		}
	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

async function addTeam(name, memberId) {
	let sql = 'INSERT INTO group_table(name) VALUES(?);';
	let sqlGroup = 'INSERT INTO group_member(group_id, member_id, role) VALUES (?, ?, ?);'
	try {
		let result = await database.databasePool.query(sql, [name]);
		let groupId = result.insertId;
		await database.databasePool.query(sqlGroup, [groupId, memberId, 'manager']);

		return {
			data: {
				message: 'ok'
			},
			statusCode: 200
		};
	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

module.exports = {
	checkExistTeam,
	addTeam
}