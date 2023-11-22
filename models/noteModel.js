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

async function getOneNote(projectId, memberId) {
	let sql = 'SELECT * FROM note WHERE project_id = ? AND member_id = ?;';

	try {
		let result = await database.databasePool.query(sql, [projectId, memberId]);

		return {
			data: {
				message: 'ok',
				note: (result.length == 0 ? null : result[0].note)
			},
			statusCode: 200
		};
	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

async function getNotes(memberId, page) {
	let limit = 6;
	let offset = page * limit;
	let sql = 'SELECT project_id, project.summary, note FROM note INNER JOIN project ON project_id = project.id WHERE member_id = ? LIMIT ? OFFSET ?;';

	try {
		let result = await database.databasePool.query(sql, [memberId, (limit + 1), offset]);
		let nextPage = result.length == (limit + 1) ? page + 1 : null;

		return {
			data: {
				message: 'ok',
				note: result.slice(0, limit),
				nextPage: nextPage
			},
			statusCode: 200
		};
	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

async function deleteNote(projectId, memberId) {
	let sql = 'DELETE FROM note WHERE project_id = ? AND member_id = ?;';

	try {
		await database.databasePool.query(sql, [projectId, memberId]);

		return {
			data: {
				message: 'ok',
			},
			statusCode: 200
		};
	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

module.exports = {
	addNote,
	getOneNote,
	getNotes,
	deleteNote
}