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

async function checkUserSignIn(email, password) {
	let sql = 'SELECT * FROM member WHERE email = ? AND password = ?;';
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
		return database.ErrorProcess(error);
	}
}

async function checkExistEmail(email) {
	let sql = 'SELECT * FROM member WHERE email = ?;';
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
		return database.ErrorProcess(error);
	}
}

async function checkExistName(name) {
	let sql = 'SELECT * FROM member WHERE name = ?;';
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
					message: 'Name is already exist! Add nickname or some characters in name.\n e.g. Mary Ho -> Mary Ho (Marr)'
				},
				statusCode: 400
			};
		}
	}
	catch(error) {
		return database.ErrorProcess(error);
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
		return database.ErrorProcess(error);
	}
}

module.exports = {
	getUserInfo,
	checkUserSignIn,
	checkExistEmail,
	checkExistName,
	signUpUserData
}