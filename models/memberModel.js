const database = require('./conn-aws-RDS');

async function updateUserImage(memberId, filename) {
	let sql = 'UPDATE member SET image_filename = ? WHERE id = ?;';
	try {
		await database.databasePool.query(sql, [filename, memberId]);
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

async function updateUserName(memberId, name) {
	let sql = 'UPDATE member SET name = ? WHERE id = ?;';
	try {
		await database.databasePool.query(sql, [name, memberId]);
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
	updateUserImage,
	updateUserName
}