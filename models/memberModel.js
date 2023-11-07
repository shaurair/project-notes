const database = require('./conn-aws-RDS');

async function updateUserImage(memberId, filename) {
	console.log('updateUserImage: ', memberId, filename);

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
	updateUserImage
}