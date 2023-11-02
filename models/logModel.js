const database = require('./conn-aws-RDS');

async function checkUserSignIn(email, password) {
    let sql = 'SELECt * FROM member WHERE email = ? AND password = ?';
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

module.exports = {
    checkUserSignIn
}