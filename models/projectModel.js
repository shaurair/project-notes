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
	let sqlRole = 'SELECT member.id, member.image_filename, member.name FROM project_member INNER JOIN member ON project_member.member_id = member.id WHERE project_member.project_id = ? AND project_member.role = ?';
	let sqlTeam = 'SELECT group_table.name, group_table.id FROM project_team INNER JOIN group_table ON project_team.group_id = group_table.id WHERE project_team.project_id = ?;';

	try {
		let contentResult = await database.databasePool.query(sql, [projectId]);
		let ownerResult = await database.databasePool.query(sqlRole, [projectId, 'owner']);
		let reviewerResult = await database.databasePool.query(sqlRole, [projectId, 'reviewer']);
		let teamResult = await database.databasePool.query(sqlTeam, [projectId]);

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
				owner: ownerResult,
				reviewer: reviewerResult,
				team: teamResult
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

async function updateProject(projectId, changedItemList, changedValueList) {
	let sql = 'UPDATE project set ';
	changedItemList.forEach(item => {
		sql = sql + item + '=?,';
	});
	sql = sql.replace(/,$/g, ' ') + 'WHERE id = ?;'
	changedValueList.push(projectId);
	try {
		await database.databasePool.query(sql, changedValueList);

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

async function updateAssociatePeople(projectId, associateRole, changeMemberList) {
	let sqlRemoveMember = 'DELETE FROM project_member WHERE project_id = ? AND member_id = ? AND role = ?;';
	let sqlAddMember = 'INSERT INTO project_member(project_id, member_id, role) VALUES(?, ?, ?);';

	try {
		for( let i = 0; i < changeMemberList.add.length; i++) {
			await database.databasePool.query(sqlAddMember, [projectId, changeMemberList.add[i], associateRole]);
		}

		for( let i = 0; i < changeMemberList.delete.length; i++) {
			await database.databasePool.query(sqlRemoveMember, [projectId, changeMemberList.delete[i], associateRole]);
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

async function updateAssociateGroup(projectId, changeGroupList) {
	let sqlRemoveGroup = 'DELETE FROM project_team WHERE project_id = ? AND group_id = ?;';
	let sqlAddGroup = 'INSERT INTO project_team(project_id, group_id) VALUES(?, ?);';

	try {
		for( let i = 0; i < changeGroupList.add.length; i++) {
			await database.databasePool.query(sqlAddGroup, [projectId, changeGroupList.add[i]]);
		}

		for( let i = 0; i < changeGroupList.delete.length; i++) {
			await database.databasePool.query(sqlRemoveGroup, [projectId, changeGroupList.delete[i]]);
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


module.exports = {
	createProject,
	setAssociate,
	getProjectContent,
	updateProject,
	updateAssociatePeople,
	updateAssociateGroup
}