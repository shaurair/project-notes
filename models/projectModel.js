const database = require('./conn-aws-RDS');

async function createProject(summary, description, priority, deadline, creator) {
	let sql = 'INSERT INTO project(summary, description, priority, deadline, creater_id) VALUES(?, ?, ?, ?, ?);';
	try {
		let result = await database.databasePool.query(sql, [summary, description, priority, deadline, creator]);

		return {
			data: {
				message: 'ok',
				id: result.insertId
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

async function setAssociate(associate, projectId) {
	let ownerNumber = Object.keys(associate.owner).length;
	let ownerList = Object.keys(associate.owner);
	let reviewerNumber = Object.keys(associate.reviewer).length;
	let reviewerList = Object.keys(associate.reviewer);
	let teamNumber = Object.keys(associate.team).length;
	let teamList = Object.keys(associate.team);

	let sqlMember = 'INSERT INTO project_member(project_id, member_id, role) VALUES(?, ?, ?);';
	let sqlTeam =  'INSERT INTO project_team(project_id, group_id) VALUES(?, ?);';
	try {
		for( let i = 0; i < ownerNumber; i++) {
			await database.databasePool.query(sqlMember, [projectId, ownerList[i], 'owner']);
		}
		for( let i = 0; i < reviewerNumber; i++) {
			await database.databasePool.query(sqlMember, [projectId, reviewerList[i], 'reviewer']);
		}
		for( let i = 0; i < teamNumber; i++) {
			await database.databasePool.query(sqlTeam, [projectId, teamList[i]]);
		}

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

async function getProjectContent(projectId) {
	let sql = 'SELECT project.*, member.image_filename, member.name FROM project INNER JOIN member ON project.creater_id = member.id WHERE project.id = ?;';
	let sqlOwner = 'SELECT member.id, member.image_filename, member.name FROM project_member INNER JOIN member ON project_member.member_id = member.id WHERE project_member.project_id = ? AND project_member.role = ?';

	try {
		let contentResult = await database.databasePool.query(sql, [projectId]);
		let ownerResult = await database.databasePool.query(sqlOwner, [projectId, 'owner']);

		return {
			data: {
				message: 'ok',
				summary: contentResult[0].summary,
				description: contentResult[0].description,
				status: contentResult[0].status,
				priority: contentResult[0].priority,
				deadline: contentResult[0].deadline,
				creatorName: contentResult[0].name,
				creatorImage: contentResult[0].image_filename,
				owner: ownerResult
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
	createProject,
	setAssociate,
	getProjectContent
}