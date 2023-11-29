const database = require('./conn-aws-RDS');

async function getExpiredProjectId(memberId, nowDate) {
	let sql = `SELECT project_id FROM project INNER JOIN project_member ON project_member.project_id = project.id 
			   WHERE project_member.member_id = ? AND deadline <= ?;`;

	try {
		let result = await database.databasePool.query(sql, [memberId, nowDate]);

		return {
			data: {
				message: 'ok',
				expired: result,
			},
			statusCode: 200
		};
	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

module.exports = {
	getExpiredProjectId,
}