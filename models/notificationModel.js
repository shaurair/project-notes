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

async function getHistoryUpdate(memberId) {
	let sql = `SELECT message_type AS messageText, project_id, id FROM project_notification WHERE member_id = ?;`;
	let deleteHistorySql = `DELETE FROM project_notification WHERE id in (?);`;

	try {
		let result = await database.databasePool.query(sql, [memberId]);
		let notificationIdList = result.map(resultItem=>{
			return resultItem.id
		})

		if(notificationIdList.length > 0) {
			await database.databasePool.query(deleteHistorySql, [notificationIdList]);
		}

		return {
			data: {
				message: 'ok',
				notification: result,
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
	getHistoryUpdate
}