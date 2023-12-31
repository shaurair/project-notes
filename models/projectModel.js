const database 		= require('./conn-aws-RDS');
const dataFormat 	= require('./dataFormat');
const AUTH = {
	PERMISSION_REJECT: 0,
	SERVER_ERROR: 1,
	PERMISSION_OK: 2
}

async function createProject(summary, description, priority, deadline, creator) {
	let sql = 'INSERT INTO project(summary, description, priority, deadline, creator_member_id) VALUES(?, ?, ?, ?, ?);';
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
		return database.ErrorProcess(error);
	}
}

async function setAssociate(associate, projectId) {
	let ownerList = Object.keys(associate.owner);
	let reviewerList = Object.keys(associate.reviewer);
	let teamList = Object.keys(associate.team);

	let sqlMember = 'INSERT INTO project_member(project_id, member_id, role) VALUES(?, ?, ?);';
	let sqlTeam =  'INSERT INTO project_group(project_id, group_id) VALUES(?, ?);';
	try {
		ownerList.forEach(async owner => {
			await database.databasePool.query(sqlMember, [projectId, owner, 'owner']);
		})
		reviewerList.forEach(async reviewer => {
			await database.databasePool.query(sqlMember, [projectId, reviewer, 'reviewer']);
		})
		teamList.forEach(async team => {
			await database.databasePool.query(sqlTeam, [projectId, team]);
		})

		return {
			data: {
				message: 'ok',
				id: projectId
			},
			statusCode: 200
		};
	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

async function getAuthorization(projectId, memberId) {
	let sql = 'SELECT project_member.project_id FROM project_member LEFT JOIN project_group ON project_member.project_id = project_group.project_id LEFT JOIN group_member ON project_group.group_id = group_member.group_id INNER JOIN project ON project_member.project_id = project.id WHERE project_member.project_id = ? AND (project_member.member_id = ? OR group_member.member_id = ? OR project.creator_member_id = ?);';
	let sqlParam = [projectId, memberId, memberId, memberId];

	try {
		let result = await database.databasePool.query(sql, sqlParam);
		let auth = result.length == 0 ? AUTH.PERMISSION_REJECT : AUTH.PERMISSION_OK;

		return {
			data: {
				message: 'ok',
				auth: auth
			},
			statusCode: 200
		}
	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

async function getProjectContent(projectId) {
	let sql = 'SELECT project.*, member.image_filename, member.name FROM project INNER JOIN member ON project.creator_member_id = member.id WHERE project.id = ?;';
	let sqlTeam = 'SELECT group_table.name, group_table.id FROM project_group INNER JOIN group_table ON project_group.group_id = group_table.id WHERE project_group.project_id = ?;';

	try {
		let contentResult = await database.databasePool.query(sql, [projectId]);
		let teamResult = await database.databasePool.query(sqlTeam, [projectId]);
		let rolesResult = await getRoleInOneProject([projectId]);
		let ownerList = rolesResult.data.roles.filter(member=>member.role === 'owner');
		let reviewerList = rolesResult.data.roles.filter(member=>member.role === 'reviewer');

		return {
			data: {
				message: 'ok',
				summary: contentResult[0].summary,
				description: contentResult[0].description,
				status: contentResult[0].status,
				priority: contentResult[0].priority,
				deadline: dataFormat.setDateFormateSlash(contentResult[0].deadline),
				creatorName: contentResult[0].name,
				creatorImage: contentResult[0].image_filename,
				owner: ownerList,
				reviewer: reviewerList,
				team: teamResult
			},
			statusCode: 200
		};
	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

async function getComment(projectId, currentCommentCursor) {
	let limit = 5;
	let offset = parseInt(currentCommentCursor);
	let sqlComment = 'SELECT project_comment.*, member.image_filename, member.name FROM project_comment INNER JOIN member ON project_comment.member_id = member.id  WHERE project_id = ? LIMIT ? OFFSET ?;'

	try {
		let commentResult = await database.databasePool.query(sqlComment, [projectId, (limit + 1), offset]);
		nextCommentCursor = commentResult.length == (limit + 1) ? offset + limit : null;

		return {
			data: {
				message: 'ok',
				comment: commentResult.slice(0, limit),
				nextCommentCursor: nextCommentCursor
			},
			statusCode: 200
		};
	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

async function getCommentUser(projectId) {
	let sql = 'SELECT member_id AS id FROM project_comment WHERE project_id = ? GROUP BY member_id;';

	try {
		let result = await database.databasePool.query(sql, [projectId]);

		return {
			data: {
				message: 'ok',
				user: result
			},
			statusCode: 200
		};
	}
	catch(error) {
		return database.ErrorProcess(error);
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
		return database.ErrorProcess(error);
	}
}

async function updateProjectStatus(projectId, status) {
	let sql = 'UPDATE project set status = ? WHERE id = ?;';
	try {
		await database.databasePool.query(sql, [status, projectId]);

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
		return database.ErrorProcess(error);
	}
}

async function updateAssociateGroup(projectId, changeGroupList) {
	let sqlRemoveGroup = 'DELETE FROM project_group WHERE project_id = ? AND group_id = ?;';
	let sqlAddGroup = 'INSERT INTO project_group(project_id, group_id) VALUES(?, ?);';

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
		return database.ErrorProcess(error);
	}
}

async function addComment(projectId, memberId, comment, datetime) {
	let sql = 'INSERT INTO project_comment(project_id, member_id, comment, datetime) VALUES(?, ?, ?, ?);';
	try {
		let result = await database.databasePool.query(sql, [projectId, memberId, comment, datetime]);

		return {
			data: {
				message: 'ok',
				commentId: result.insertId
			},
			statusCode: 200
		};
	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

async function deleteComment(commentId) {
	let sql = 'DELETE FROM project_comment WHERE id = ?;';
	try {
		await database.databasePool.query(sql, [commentId]);

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

async function updateComment(commentId, comment) {
	let sql = 'UPDATE project_comment set comment = ? WHERE id = ?;';
	try {
		await database.databasePool.query(sql, [comment, commentId]);

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

async function getProjectMain(memberId, status, page, keyword, myRole) {
	let limit = 5;
	let offset = page * limit;
	let sql;
	let sqlParam;
	if(myRole == 0) {
		if(keyword == '') {
			sql = 'SELECT DISTINCT project_id, project.summary, project.priority, project.deadline FROM project_member INNER JOIN project ON project_member.project_id = project.id WHERE member_id = ? AND project.status = ? ORDER BY project.deadline is null, project.deadline ASC LIMIT ? OFFSET ?;';
			sqlParam = [memberId, status, (limit + 1), offset];
		}
		else {
			sql = 'SELECT DISTINCT project_id, project.summary, project.priority, project.deadline FROM project_member INNER JOIN project ON project_member.project_id = project.id WHERE member_id = ? AND project.status = ? AND project.summary like ? ORDER BY project.deadline is null, project.deadline ASC LIMIT ? OFFSET ?;';
			sqlParam = [memberId, status, `%${keyword}%`, (limit + 1), offset];
		}
	}
	else {
		if(keyword == '') {
			sql = 'SELECT DISTINCT project.id AS project_id, project.summary, project.priority, project.deadline FROM project LEFT JOIN project_member ON project_member.project_id = project.id LEFT JOIN project_group ON project_member.project_id = project_group.project_id LEFT JOIN group_member ON project_group.group_id = group_member.group_id WHERE (project_member.member_id = ? OR group_member.member_id = ?) AND project.status = ? GROUP BY project.id ORDER BY project.deadline is null, project.deadline ASC LIMIT ? OFFSET ?;';
			sqlParam = [memberId, memberId, status, (limit + 1), offset];
		}
		else {
			sql = 'SELECT DISTINCT project.id AS project_id, project.summary, project.priority, project.deadline FROM project LEFT JOIN project_member ON project_member.project_id = project.id LEFT JOIN project_group ON project_member.project_id = project_group.project_id LEFT JOIN group_member ON project_group.group_id = group_member.group_id WHERE (project_member.member_id = ? OR group_member.member_id = ?) AND project.status = ?  AND project.summary like ? GROUP BY project.id ORDER BY project.deadline is null, project.deadline ASC LIMIT ? OFFSET ?;';
			sqlParam = [memberId, memberId, status, `%${keyword}%`, (limit + 1), offset];
		}
	}

	try {
		let contentResult = await database.databasePool.query(sql, sqlParam);
		let nextPage = contentResult.length == (limit + 1) ? parseInt(page) + 1 : null;

		return {
			data: {
				message: 'ok',
				content: contentResult.slice(0, limit),
				nextPage: nextPage
			},
			statusCode: 200
		};
	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

async function getRoleInOneProject(projectId) {
	let sql = 'SELECT member.id, member.image_filename, member.name, role FROM project_member INNER JOIN member ON project_member.member_id = member.id WHERE project_id = ?;'

	try {
		let result = await database.databasePool.query(sql, [projectId]);

		return {
			data: {
				message: 'ok',
				roles: result
			},
			statusCode: 200
		};
	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

async function getRoleInProjectList(projectIdList) {
	let sql = 'SELECT project_id, member.image_filename, member.name, role FROM project_member INNER JOIN member ON project_member.member_id = member.id WHERE project_id in (?);'

	try {
		let result = await database.databasePool.query(sql, [projectIdList]);

		return {
			data: {
				message: 'ok',
				roles: result
			},
			statusCode: 200
		};
	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

async function addFile(projectId, memberId, fileName, datetime) {
	let sql = 'INSERT INTO project_file(project_id, member_id, file_name, datetime) VALUES(?, ?, ?, ?) ON DUPLICATE KEY UPDATE member_id = ?;';
	try {
		let result = await database.databasePool.query(sql, [projectId, memberId, fileName, datetime, memberId]);

		return {
			data: {
				message: 'ok',
				fileId: result.insertId
			},
			statusCode: 200
		};
	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

async function getFile(projectId) {
	let sql = 'SELECT project_file.id as file_id, file_name, member_id, member.name, member.image_filename as member_image, datetime FROM project_file INNER JOIN member ON member_id = member.id WHERE project_id = ? ORDER BY project_file.id';
	
	try {
		let result = await database.databasePool.query(sql, [projectId]);

		return {
			data: {
				message: 'ok',
				file: result
			},
			statusCode: 200
		};
	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

async function deleteFile(fileId) {
	let sql = 'DELETE FROM project_file WHERE id = ?;';
	try {
		await database.databasePool.query(sql, [fileId]);

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

async function addNotification(projectId, memberId, messageType) {
	let sql = 'INSERT INTO project_notification(project_id, member_id, message_type) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE member_id = ?;';
	try {
		let result = await database.databasePool.query(sql, [projectId, memberId, messageType, memberId]);

		return {
			data: {
				message: 'ok',
				notificationId: result.insertId
			},
			statusCode: 200
		};
	}
	catch(error) {
		return database.ErrorProcess(error);
	}
}

module.exports = {
	createProject,
	setAssociate,
	getProjectContent,
	updateProject,
	updateProjectStatus,
	updateAssociatePeople,
	updateAssociateGroup,
	addComment,
	getComment,
	getCommentUser,
	deleteComment,
	updateComment,
	getProjectMain,
	getRoleInOneProject,
	getRoleInProjectList,
	getAuthorization,
	addFile,
	getFile,
	deleteFile,
	addNotification
}