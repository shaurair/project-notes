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
	let sql = 'SELECT project_id, note, project.summary, project.status FROM note INNER JOIN project ON project_id = project.id WHERE project_id = ? AND member_id = ?;';

	try {
		let result = await database.databasePool.query(sql, [projectId, memberId]);

		return {
			data: {
				message: 'ok',
				note: (result.length == 0 ? null : result[0])
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
	let sql = 'SELECT project_id, project.summary, note, project.status, pos FROM note INNER JOIN project ON project_id = project.id WHERE member_id = ? ORDER BY pos is null, pos ASC, note.id DESC LIMIT ? OFFSET ?;';

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

async function setTopNote(projectId, memberId) {
	let sqlPosIncrement = 'UPDATE note SET pos = pos + 1 WHERE pos IS NOT NULL AND member_id = ?;';
	let sqlPosTop = 'UPDATE note SET pos = 1 WHERE project_id = ? AND member_id = ?;';

	try {
		await database.databasePool.query(sqlPosIncrement, [memberId]);
		await database.databasePool.query(sqlPosTop, [projectId, memberId]);

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

async function setTopNoteOriginalPos(projectId, memberId, originalPos) {
	let sqlPosIncrement = 'UPDATE note SET pos = pos + 1 WHERE pos < ? AND member_id = ?;';
	let sqlPosTop = 'UPDATE note SET pos = 1 WHERE project_id = ? AND member_id = ?;';

	try {
		await database.databasePool.query(sqlPosIncrement, [originalPos, memberId]);
		await database.databasePool.query(sqlPosTop, [projectId, memberId]);

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
	deleteNote,
	setTopNote,
	setTopNoteOriginalPos
}