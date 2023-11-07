const database = require('./conn-aws-RDS');

async function checkUserSignIn(email, password) {
	let sql = 'SELECt * FROM member WHERE email = ? AND password = ?;';
	try {
		let result = await database.databasePool.query(sql, [email, password]);

		if(result.length == 0) {
			return {
				data: {
					message: 'Email or password is wrong'
				},
				statusCode: 400
			};
		}
		else {
			return {
				data: {
					message: 'ok',
					id: result[0].id, 
					name: result[0].name,
					imageFilename: result[0].image_filename
				},
				statusCode: 200
			};
		}

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

async function checkExistEmail(email) {
	let sql = 'SELECt * FROM member WHERE email = ?;';
	try {
		let result = await database.databasePool.query(sql, [email]);
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
					message: 'Email is already exist'
				},
				statusCode: 400
			};
		}
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

async function signUpUserData(name, email, password) {
	let sql = 'INSERT INTO member(name, email, password) VALUES(?,?,?)';
	try {
		await database.databasePool.query(sql, [name, email, password]);

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
	checkUserSignIn: checkUserSignIn,
	checkExistEmail: checkExistEmail,
	signUpUserData: signUpUserData
}