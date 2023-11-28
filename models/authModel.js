const database = require('./conn-aws-RDS');

async function getUserInfo(memberId) {
	let sql = 'SELECT name, image_filename FROM member WHERE id = ?;';
	try {
		let result = await database.databasePool.query(sql, [memberId]);
		return {
			data: {
				message: 'ok',
				name: result[0].name,
				imageFilename: result[0].image_filename
			},
			statusCode: 200
		};
	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

module.exports = {
	getUserInfo
}