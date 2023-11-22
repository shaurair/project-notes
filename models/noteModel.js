const database = require('./conn-aws-RDS');

async function addNote(projectId, memberId, note) {
	let sql = 'INSERT INTO note(project_id, member_id, note) VALUES (?, ?, ?) ON duplicate key update note = ?;';

	try {
		let result = await database.databasePool.query(sql, [projectId, memberId, note, note]);

		return {
			data: {
				message: 'ok',
				noteId: result.insertId
			},
			statusCode: 200
		};
	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

module.exports = {
	addNote
}