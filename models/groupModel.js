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
	let sqlGroup = 'INSERT INTO group_member(group_id, member_id) VALUES (?, ?);'
	try {
		let result = await database.databasePool.query(sql, [name]);
		let groupId = result.insertId;
		await database.databasePool.query(sqlGroup, [groupId, memberId]);

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

async function getMyGroup(memberId) {
	let sql = 'SELECT group_id, group_table.name FROM group_member INNER JOIN group_table ON group_member.group_id = group_table.id WHERE member_id = ?;';

	try {
		let result = await database.databasePool.query(sql, [memberId]);

		return {
			data: {
				message: 'ok',
				myGroup: result
			},
			statusCode: 200
		};
	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

async function getGroupMember(groupId) {
	let sql = 'SELECT member.name, member_id, member.image_filename FROM group_member INNER JOIN member ON group_member.member_id = member.id WHERE group_id = ?;';

	try {
		let result = await database.databasePool.query(sql, [groupId]);

		return {
			data: {
				message: 'ok',
				groupMember: result
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
	addTeam,
	getMyGroup,
	getGroupMember
}