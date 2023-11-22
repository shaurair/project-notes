const ownerSearchBtn = document.getElementById('owner-search');
const ownerSearchContainerElement = document.getElementById('owner-search-result');
const ownerSearchListElement = document.getElementById('owner-search-list');
const ownerSearchKeyWord = document.getElementById('owner-input');
const ownerPeopleList = document.getElementById('owner-people-list');
const reviewerSearchBtn = document.getElementById('reviewer-search');
const reviewerSearchContainerElement = document.getElementById('reviewer-search-result');
const reviewerSearchListElement = document.getElementById('reviewer-search-list');
const reviewerSearchKeyWord = document.getElementById('reviewer-input');
const reviewerPeopleList = document.getElementById('reviewer-people-list');
const teamSearchBtn = document.getElementById('team-search');
const teamSearchContainerElement = document.getElementById('team-search-result');
const teamSearchListElement = document.getElementById('team-search-list');
const teamSearchKeyWord = document.getElementById('team-input');
const teamList = document.getElementById('team-list');
// const viewmoreBtn = document.getElementById('project-viewmore');
const statusSelect = document.getElementById('project-status-value');
const editProjectBtn = document.getElementById('edit-project');
const cancelEditBtn = document.getElementById('cancel-edit-project');
const saveBtn = document.getElementById('save-project');
const darkBackgrountElement = document.querySelector('.dark-background');
const darkBackgroundTeamContentElement = document.querySelector('.team-content-dark-background');
const editProjectAreaElement = document.querySelector('.edit-project-area');
const summaryElement = document.getElementById('summary-input-content');
const descriptionElement = document.getElementById('description-input');
const commentInputElement = document.getElementById('add-comment-text');
const addCommentBtn = document.getElementById('add-comment');
const commentContainer = document.querySelector('.comment-container');
const commentLoadMoreBtn = document.getElementById('loadmore-comment-button');
const noCommentElement = document.getElementById('no-comment');
const teamContainer = document.querySelector('.project-team-content-area');
const closeTeamContainerBtn = document.getElementById('close-team-content');
const memberPeopleList = document.getElementById('member-people-list');
const addToNoteBtn = document.getElementById('add-to-note');
const personalNoteArea = document.querySelector('.personal-note-area');
const personalNoteInput = document.getElementById('input-note-project');
const saveNoteBtn = document.getElementById('save-note-project');
const deleteNoteBtn = document.getElementById('delete-note-project');
const updateNoteWait = document.getElementById('update-waiting');
const updateNoteSuccess = document.getElementById('update-success');
const AUTH = {
	PERMISSION_REJECT: 0,
	SERVER_ERROR: 1,
	PERMISSION_OK: 2
}
let projectId = location.href.match(/\/project\/(\d+)/)[1];
let projectData;
let originalAssociate = {owner:{}, reviewer:{}, team:{}};
let editAssociate = {owner:{}, reviewer:{}, team:{}};
let editContent;
let nextCommentPage = 0;
let currentPersonalNote = '';
let isAllowSaveNote = false;
let isAllowDeleteNote = false;

async function initProjectId() {
	await getUser();

	if(userInfo == null) {
		location.href = '/';
	}
	else {
		showMemberNav();
		let authResult = await CheckAuthorization();
		if(authResult == AUTH.PERMISSION_REJECT) {
			document.querySelector('.main-project-lock').classList.remove('unseen');
			document.querySelector('.main-project-loading').classList.add('unseen');
			return;
		}
		else if(authResult == AUTH.SERVER_ERROR) {
			document.querySelector('.main-project-loading').classList.add('unseen');
			return;
		}
		showContent();

		await Promise.all([	getProjectContent(),
							getProjectComment(), 
							setCommentImage(), 
							getNote()]);
		showOption();
	}
}

function showContent() {
	document.querySelector('.main-project-id').classList.remove('unseen');
	document.querySelector('.main-project-loading').classList.add('unseen');
}

function showOption() {
	document.querySelector('.project-option').classList.remove('unseen');
}

async function CheckAuthorization() {
	let token = localStorage.getItem('token');
	let response = await fetch(`/api_project/auth?id=${projectId}`, {
								headers: {Authorization: `Bearer ${token}`}
							});
	let result = await response.json();

	if(response.ok) {
		return result['auth'];
	}
	else {
		alert('something went wrong, please redirect and try again');
		return  AUTH.SERVER_ERROR;
	}
}

async function getProjectContent() {
	let token = localStorage.getItem('token');
	let response = await fetch(`/api_project/content?id=${projectId}`, {
								headers: {Authorization: `Bearer ${token}`}
							});
	let result = await response.json();

	if(response.ok) {
		projectData = result;
		projectData['owner'].forEach(userData => {
			originalAssociate.owner[userData['id']] = true;
		});
		projectData['reviewer'].forEach(userData => {
			originalAssociate.reviewer[userData['id']] = true;
		});
		projectData['team'].forEach(userData => {
			originalAssociate.team[userData['id']] = true;
		});
		setProjectContent(result);
	}
	else {
		alert('something went wrong, please redirect and try again');
	}
}

async function getProjectComment() {
	let token = localStorage.getItem('token');
	let response = await fetch(`/api_project/comment?projectId=${projectId}&nextPage=${nextCommentPage}`, {
								headers: {Authorization: `Bearer ${token}`}
							});
	let result = await response.json();

	if(response.ok) {
		setComment(result['comment']);
		nextCommentPage = result['nextPage'];
		if(nextCommentPage == null) {
			commentLoadMoreBtn.classList.add('unseen');
		}
		else {
			commentLoadMoreBtn.classList.remove('unseen');
		}
	}
	else {
		alert('something went wrong while loading comment, please redirect and try again');
	}
}

function setProjectContent(data) {
	let element;
	let peopleListContainer;
	let imageFilename;
	let imgUrl;

	element = document.getElementById('project-summary');
	element.textContent = data['summary'];

	element = document.getElementById('project-description');
	element.textContent = data['description'];

	element = document.getElementById('project-status-value');
	element.value = data['status'];
	changeStatusColor();

	element = document.getElementById('project-priority');
	element.textContent = data['priority'];

	if(data['deadline'] != null) {
		element = document.getElementById('project-deadline');
		element.textContent = data['deadline'];
	}

	// set creator
	peopleListContainer = document.getElementById('creator-container');
	imageFilename = data['creatorImage'];
	imgUrl = (imageFilename == null) ? null : `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${imageFilename}`;
	setPeople(imgUrl, data['creatorName'], peopleListContainer);

	// set owner
	peopleListContainer = document.getElementById('owner-container');
	for(let i = 0; i < data['owner'].length; i++) {
		imageFilename = data['owner'][i]['image_filename'];
		imgUrl = (imageFilename == null) ? null : `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${imageFilename}`;
		setPeople(imgUrl, data['owner'][i]['name'], peopleListContainer);
	}

	// set reviewer
	peopleListContainer = document.getElementById('reviewer-container');
	for(let i = 0; i < data['reviewer'].length; i++) {
		imageFilename = data['reviewer'][i]['image_filename'];
		imgUrl = (imageFilename == null) ? null : `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${imageFilename}`;
		setPeople(imgUrl, data['reviewer'][i]['name'], peopleListContainer);
	}

	// set team
	peopleListContainer = document.getElementById('team-container');
	for(let i = 0; i < data['team'].length; i++) {
		setTeam(data['team'][i]['name'], peopleListContainer, data['team'][i]['id']);
	}
}

function setPeople(imgUrl, name, peopleListElement) {
	let elementContainer = document.createElement('div');
	elementContainer.className = 'project-people-container';
	peopleListElement.appendChild(elementContainer);

	addImgToContainer(imgUrl, elementContainer);
	addNameToContainer(name, elementContainer);
}

function setTeam(name, teamListElement, groupId) {
	let elementContainer = document.createElement('div');
	elementContainer.className = 'project-team-container';
	teamListElement.appendChild(elementContainer);

	addNameAndLinkToContainer(name, elementContainer, groupId);
}

function setComment(commentList) {
	if(commentList.length == 0) {
		noCommentElement.classList.remove('unseen');
	}
	else {
		for(let i = 0; i < commentList.length; i++) {
			addCommentBlock(commentList[i]['image_filename'], commentList[i]['name'], commentList[i]['member_id'], commentList[i]['datetime'], commentList[i]['comment'], commentList[i]['id']);
		}
	}
}

function setCommentImage() {
	if(userInfo['file_name'] != null) {
		document.getElementById('add-comment-img').style.backgroundImage = `url(https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${userInfo['file_name']})`;;
	}
}

function addCommentBlock(imageFilename, userName, userId, datetime, comment, commentId) {
	let commentBlock = document.createElement('div');
	commentBlock.className = 'comment-block';
	commentContainer.appendChild(commentBlock);

	let commentImg = document.createElement('div');
	commentImg.className = 'comment-img';
	if(imageFilename!= null) {
		commentImg.style.backgroundImage = `url(https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${imageFilename})`;
	}
	commentBlock.appendChild(commentImg);

	let commentContent = document.createElement('div');
	commentContent.className = 'comment-content';
	commentBlock.appendChild(commentContent);

	let commentInfo = document.createElement('div');
	commentInfo.className = 'comment-info';
	commentContent.appendChild(commentInfo);

	let commentInfoUser = document.createElement('div');
	commentInfoUser.className = 'comment-info-user';
	commentInfoUser.textContent = userName;
	commentInfo.appendChild(commentInfoUser);

	let commentInfoDatetime = document.createElement('div');
	commentInfoDatetime.className = 'comment-info-datetime';
	commentInfoDatetime.textContent = datetime;
	commentInfo.appendChild(commentInfoDatetime);

	let commentText = document.createElement('div');
	commentText.className = 'comment-text';
	commentText.textContent = comment;
	commentContent.appendChild(commentText);

	if(userId == userInfo['id']) {
		let commentAction = document.createElement('div');
		commentAction.className = 'actions-container';
		commentContent.appendChild(commentAction);

		let actionElement = document.createElement('div');
		actionElement.className = 'action-opt mouseover';
		actionElement.textContent = 'Edit';
		actionElement.addEventListener('click', () => {
			commentText.classList.add('unseen');
			commentAction.classList.add('unseen');
			let commentEditInput = document.createElement('textarea');
			commentEditInput.type = 'text';
			commentEditInput.value = commentText.textContent;
			commentEditInput.className = 'edit-comment-text';
			commentContent.appendChild(commentEditInput);

			let buttonGroupContainer = document.createElement('div');
			buttonGroupContainer.className = 'add-comment-btn-container';
			commentContent.appendChild(buttonGroupContainer);

			let buttonElement = document.createElement('div');
			buttonElement.className = 'create-button project-text mouseover';
			buttonElement.textContent = 'Cancel';
			buttonElement.addEventListener('click', () => {
				commentText.classList.remove('unseen');
				commentAction.classList.remove('unseen');
				commentContent.removeChild(commentEditInput);
				commentContent.removeChild(buttonGroupContainer);
			});
			buttonGroupContainer.appendChild(buttonElement);

			buttonElement = document.createElement('div');
			buttonElement.className = 'create-button highlight-text mouseover';
			buttonElement.textContent = 'Save';
			buttonElement.addEventListener('click', async () => {
				if(commentEditInput.value === comment) {
					commentText.classList.remove('unseen');
					commentAction.classList.remove('unseen');
					commentContent.removeChild(commentEditInput);
					commentContent.removeChild(buttonGroupContainer);
				}
				else {
					let updateResult = await updateComment(commentId, commentEditInput.value);
					if(updateResult == 'ok') {
						commentText.textContent = commentEditInput.value;
						commentText.classList.remove('unseen');
						commentAction.classList.remove('unseen');
						commentContent.removeChild(commentEditInput);
						commentContent.removeChild(buttonGroupContainer);
					}
				}
			});
			buttonGroupContainer.appendChild(buttonElement);
		})
		commentAction.appendChild(actionElement);

		actionElement = document.createElement('div');
		actionElement.className = 'action-opt mouseover';
		actionElement.textContent = 'Delete';
		actionElement.addEventListener('click', () => {
			let userConfirm = confirm('Are you sure to delete this comment?');
			if(userConfirm) {
				deleteComment(commentId, commentBlock);
			}
		});
		commentAction.appendChild(actionElement);
	}
}

async function deleteComment(commentId, commentBlock) {
	let token = localStorage.getItem('token');
	let response = await fetch(`/api_project/comment?commentId=${commentId}`, {
		method: 'DELETE',
		headers: {Authorization: `Bearer ${token}`}
	});
	
	if(response.ok) {
		commentContainer.removeChild(commentBlock);
		if(commentContainer.innerHTML == '') {
			noCommentElement.classList.remove('unseen');
		}
	}
	else {
		alert('something went wrong while deleting comment, please redirect and try again');
	}
}

function addEditDefaultRoles(imgUrl, userName, id, peopleListElement, associateRole) {
	if(editAssociate[associateRole][id]) {
		return;
	}
	let elementContainer = document.createElement('div');
	elementContainer.className = 'people-container';
	peopleListElement.appendChild(elementContainer);

	if(associateRole != 'team') {
		let element = document.createElement('div');
		element.className = 'people-img';
		elementContainer.appendChild(element);
		if(imgUrl != null) {
			element.style.backgroundImage = `url(${imgUrl})`;
		}
	}

	element = document.createElement('div');
	element.className = 'people-text';
	element.textContent = userName;
	elementContainer.appendChild(element);

	let closeElement = document.createElement('div');
	closeElement.className = 'close mouseover';
	closeElement.addEventListener('click', () => {
		delete editAssociate[associateRole][id];
		peopleListElement.removeChild(elementContainer);
	})

	let closeIconElement = document.createElement('div');
	closeIconElement.className = 'close-icon';

	closeElement.appendChild(closeIconElement);
	elementContainer.appendChild(closeElement);

	editAssociate[associateRole][id] = true;
}

function addEditDefaultTeam(userName, id, peopleListElement, associateRole) {
	if(editAssociate[associateRole][id]) {
		return;
	}
	let elementContainer = document.createElement('div');
	elementContainer.className = 'people-container';
	peopleListElement.appendChild(elementContainer);

	element = document.createElement('div');
	element.className = 'people-text mouseover';
	element.textContent = userName;
	elementContainer.appendChild(element);
	element.addEventListener('click', async() => {
		let result = await getGroupMembers(id);
		teamContainer.classList.remove('unseen');
		darkBackgroundTeamContentElement.classList.remove('unseen');
		document.getElementById('team-name-title').textContent = userName;

		memberList = result['data']['groupMember'];
		memberPeopleList.innerHTML = '';
		memberList.forEach(memberData => {
			let imageFilename = memberData['image_filename'];
			let imgUrl = (imageFilename == null) ? null : `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${imageFilename}`;
			let memberId = memberData['member_id'];
			let memberName = memberData['name'];

			let elementContainer = document.createElement('div');
			elementContainer.className = 'people-container';
			memberPeopleList.appendChild(elementContainer);
		
			let element = document.createElement('div');
			element.className = 'people-img';
			elementContainer.appendChild(element);
			if(imgUrl != null) {
				element.style.backgroundImage = `url(${imgUrl})`;
			}
			element = document.createElement('div');
			element.className = 'people-text';
			element.textContent = memberName;
			elementContainer.appendChild(element);
		});
	})

	let closeElement = document.createElement('div');
	closeElement.className = 'close mouseover';
	closeElement.addEventListener('click', () => {
		delete editAssociate[associateRole][id];
		peopleListElement.removeChild(elementContainer);
	})

	let closeIconElement = document.createElement('div');
	closeIconElement.className = 'close-icon';

	closeElement.appendChild(closeIconElement);
	elementContainer.appendChild(closeElement);

	editAssociate[associateRole][id] = true;
}

function setEditProjectContent() {
	let element;
	let peopleListElement;
	let imgUrl;

	element = document.getElementById('summary-input-content');
	element.value = projectData['summary'];

	element = document.getElementById('description-input');
	element.value = projectData['description'];

	element = document.getElementById('create-priority');
	element.value = projectData['priority'];

	if(projectData['deadline'] != null) {
		element = document.getElementById('deadline-input');
		projectData['deadline'] = projectData['deadline'].replace(/\//g, '-');
		element.value = projectData['deadline'];
	}

	editAssociate = {owner:{}, reviewer:{}, team:{}};

	// set owner
	ownerPeopleList.innerHTML = '';
	for(let i = 0; i < projectData['owner'].length; i++) {
		imgUrl = null;
		if(projectData['owner'][i]['image_filename'] != null) {
			imgUrl = `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${projectData['owner'][i]['image_filename']}`;
		}
		addEditDefaultRoles(imgUrl, projectData['owner'][i]['name'], projectData['owner'][i]['id'], ownerPeopleList, 'owner');
	}

	// set reviewer
	peopleListElement = document.getElementById('reviewer-people-list');
	peopleListElement.innerHTML = '';
	for(let i = 0; i < projectData['reviewer'].length; i++) {
		imgUrl = null;
		if(projectData['reviewer'][i]['image_filename'] != null) {
			imgUrl = `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${projectData['reviewer'][i]['image_filename']}`;
		}
		addEditDefaultRoles(imgUrl, projectData['reviewer'][i]['name'], projectData['reviewer'][i]['id'], peopleListElement, 'reviewer');
	}

	// set team
	peopleListElement = document.getElementById('team-list');
	peopleListElement.innerHTML = '';
	for(let i = 0; i < projectData['team'].length; i++) {
		addEditDefaultTeam(projectData['team'][i]['name'], projectData['team'][i]['id'], peopleListElement, 'team');
	}
}

function setPeopleForEditProject(imgUrl, name, peopleListElement) {
	let element;
	let elementContainer;

	elementContainer = document.createElement('div');
	elementContainer.className = 'project-people-container';
	peopleListElement.appendChild(elementContainer);

	element = document.createElement('div');
	element.className = 'people-img';
	if(imgUrl != null) {
		element.style.backgroundImage = `url(${imgUrl})`;
	}
	elementContainer.appendChild(element);

	element = document.createElement('div');
	element.className = 'people-text';
	element.textContent = name;
	elementContainer.appendChild(element);
}

function changeStatusColor() {
	const selectedValue = statusSelect.value;

	if(selectedValue == 'OPEN') {
		statusSelect.style.backgroundColor = 'var(--color-status-open)';
	}
	else if(selectedValue == 'INPROGRESS') {
		statusSelect.style.backgroundColor = 'var(--color-status-progress)';
	}
	else if(selectedValue == 'REVIEWING') {
		statusSelect.style.backgroundColor = 'var(--color-status-reviewing)';
	}
	else if(selectedValue == 'DONE') {
		statusSelect.style.backgroundColor = 'var(--color-status-done)';
	}
}

async function updateProjectStatus(status) {
	let response = await fetch('/api_project/status', {
		method: 'PATCH',
		body: JSON.stringify({
			projectId: projectId,
			status: status
		}),
		headers: {'Content-Type':'application/json'}
	})
	let result = await response.json();

	if(!response.ok) {
		alert(result["message"] + " Please redirect this page and try again.");
	}
}

function checkContent() {
	if(summaryElement.value == '') {
		summaryElement.classList.add('highlight-block');
		return 'Summary should not be empty'
	}
	else if(summaryElement.value.length > 100) {
		summaryElement.classList.add('highlight-block');
		return 'A total of ' + summaryElement.value.length + ' characters in summary exceeds the limit of 100 characters'
	}
	else {
		summaryElement.classList.remove('highlight-block');
	}

	if(descriptionElement.value.length > 5000) {
		descriptionElement.classList.add('highlight-block');
		return 'A total of ' + descriptionElement.value.length + ' characters in summary exceeds the limit of 5000 characters'
	}
	else {
		descriptionElement.classList.remove('highlight-block');
	}

	if(Object.keys(editAssociate['owner']).length == 0) {
		ownerSearchKeyWord.classList.add('highlight-block');
		return 'Owner should not be empty'
	}
	else {
		ownerSearchKeyWord.classList.remove('highlight-block');
	}

	if(checkDifferentNumber() == 0) {
		return 'nothing is changed'
	}

	return 'ok';
}

function checkDifferentNumber() {
	editContent = {projectId: projectId, content:{}};
	let contentChangeLength = checkProjectContent();
	let ownerChangeLengh = checkAssociateList('owner');
	let reviewerChangeLengh = checkAssociateList('reviewer');
	let teamChangeLengh = checkAssociateList('team');

	return contentChangeLength + ownerChangeLengh + reviewerChangeLengh + teamChangeLengh;
}

function checkProjectContent() {
	let priority = document.getElementById('create-priority').value;
	let deadline = document.getElementById('deadline-input').value == '' ? null : document.getElementById('deadline-input').value;

	if(projectData['summary'] != summaryElement.value) {
		editContent.content['summary'] = summaryElement.value;
	}
	if(projectData['description'] != descriptionElement.value) {
		editContent.content['description'] = descriptionElement.value;
	}
	if(projectData['priority'] != priority) {
		editContent.content['priority'] = priority;
	}
	if(projectData['deadline'] != deadline) {
		editContent.content['deadline'] = deadline;
	}

	return Object.keys(editContent.content).length;
}

function checkAssociateList(associateRole) {
	editContent[associateRole] = {};
	editContent[associateRole]['delete'] = Object.keys(originalAssociate[associateRole]).filter(key => !editAssociate[associateRole].hasOwnProperty(key));
	editContent[associateRole]['add'] = Object.keys(editAssociate[associateRole]).filter(key => !originalAssociate[associateRole].hasOwnProperty(key));

	return Object.keys(editContent[associateRole]['delete']).length + editContent[associateRole]['add'];
}

async function updateProject() {
	let response = await fetch("/api_project/", {
		method: "PATCH",
		body: JSON.stringify(editContent),
		headers: {'Content-Type':'application/json'}
	});
	let result = await response.json();

	if(response.ok) {
		alert('Successfully updated!');
		location.reload();
	}
	else {
		alert(result["message"] + " Please redirect this page and try again.");
	}
}

async function addComment(datetime) {
	let token = localStorage.getItem('token');
	let response = await fetch(`/api_project/comment`, {
		method: 'POST',
		headers: {Authorization: `Bearer ${token}`,
								'Content-Type':'application/json'
				},
		body: JSON.stringify( {
			projectId: projectId,
			datetime: datetime,
			comment: commentInputElement.value
		})
	})
	let result = await response.json();

	if(response.ok) {
		if(commentContainer.innerHTML == '') {
			noCommentElement.classList.add('unseen');
		}
		addCommentBlock(userInfo['file_name'], userInfo['name'], userInfo['id'], datetime, commentInputElement.value, result['commentId']);
		commentInputElement.value = '';
	}
	else {
		alert(result["message"] + " Please redirect this page and try again.");
	}
}

async function updateComment(commentId, comment) {
	let token = localStorage.getItem('token');
	let response = await fetch(`/api_project/comment`, {
		method: 'PATCH',
		headers: {Authorization: `Bearer ${token}`,
								'Content-Type':'application/json'
				},
		body: JSON.stringify( {
			commentId: commentId,
			comment: comment
		})
	})
	let result = await response.json();

	if(response.ok) {
		return 'ok'
	}
	else {
		alert(result["message"] + " Please redirect this page and try again.");
	}
}

async function addPersonalNote() {
	let note = personalNoteInput.value;
	let token = localStorage.getItem('token');
	let response = await fetch(`/api/note`, {
		method: 'POST',
		headers: {Authorization: `Bearer ${token}`,
								'Content-Type':'application/json'
				},
		body: JSON.stringify( {
			projectId: projectId,
			note: note
		})
	})
	let result = await response.json();

	if(response.ok) {
		currentPersonalNote = note;
		saveNoteBtn.classList.remove('note-save-enable');
		isAllowDeleteNote = true;
	}
	else {
		alert(result["message"] + " Please redirect this page and try again.");
	}
}

async function updatePersonalNote() {
	let note = personalNoteInput.value;
	let token = localStorage.getItem('token');
	let response = await fetch(`/api/note`, {
		method: 'POST',
		headers: {Authorization: `Bearer ${token}`,
								'Content-Type':'application/json'
				},
		body: JSON.stringify( {
			projectId: projectId,
			note: note
		})
	})
	let result = await response.json();

	if(response.ok) {
		currentPersonalNote = note;
		updateNoteWait.classList.add('unseen');
		updateNoteSuccess.classList.remove('unseen');
		saveNoteBtn.classList.remove('note-save-enable');
		isAllowDeleteNote = true;
	}
	else {
		alert(result["message"] + " Please redirect this page and try again.");
	}
}

async function getNote() {
	let token = localStorage.getItem('token');
	let response = await fetch(`/api/note/one-note?projectId=${projectId}`, {
		headers: {Authorization: `Bearer ${token}`}
	})
	let result = await response.json();

	if(response.ok) {
		if(result['note'] != null) {
			currentPersonalNote = personalNoteInput.value = result['note'];
			addToNoteBtn.textContent = 'See my personal notes';
			isAllowDeleteNote = true;
		}
	}
	else {
		alert(result["message"] + " Please redirect this page and try again.");
	}
}

async function deleteNote() {
	let token = localStorage.getItem('token');
	let response = await fetch(`/api/note`, {
						method: 'DELETE',
						headers: {Authorization: `Bearer ${token}`,
												'Content-Type':'application/json'
								},
						body: JSON.stringify( {
							projectId: projectId,
						})
					})
	let result = await response.json();

	if(response.ok) {
		currentPersonalNote = personalNoteInput.value = '';
		addToNoteBtn.textContent = 'Add to personal notes';
		personalNoteArea.classList.add('unseen');
	}
	else {
		alert(result["message"] + " Please redirect this page and try again.");
	}
}

// Select change events
statusSelect.addEventListener('change', () => {
	changeStatusColor();
	updateProjectStatus(statusSelect.value);
});

personalNoteInput.addEventListener('input', ()=>{
	updateNoteWait.classList.add('unseen');
	updateNoteSuccess.classList.add('unseen');
	if(currentPersonalNote != personalNoteInput.value) {
		saveNoteBtn.classList.add('note-save-enable');
		isAllowSaveNote = true;
	}
	else {
		saveNoteBtn.classList.remove('note-save-enable');
		isAllowSaveNote = false;
	}
})

// Click events
// viewmoreBtn.addEventListener('click', () => {
// 	const viewmoreDialogueElement = document.querySelector('.viewmore-dialogue-project');
// 	if(viewmoreDialogueElement.classList.contains('unseen')) {
// 		viewmoreDialogueElement.classList.remove('unseen');
// 	}
// 	else {
// 		viewmoreDialogueElement.classList.add('unseen');
// 	}
// })

editProjectBtn.addEventListener('click', () => {
	darkBackgrountElement.classList.remove('unseen');
	editProjectAreaElement.classList.remove('unseen');
	setEditProjectContent();
});

cancelEditBtn.addEventListener('click', () => {
	darkBackgrountElement.classList.add('unseen');
	editProjectAreaElement.classList.add('unseen');
});

saveBtn.addEventListener('click', () => {
	let checkContentResult = checkContent();
	if(checkContentResult == 'ok') {
		updateProject();
	}
	else {
		alert(checkContentResult);
	}
})

ownerSearchBtn.addEventListener('click', async() => {
	searchMethod = document.getElementById('select-id-owner').checked ? searchId : searchName;
	let searchResult = await searchMethod(ownerSearchKeyWord.value);

	addSearchResult(searchResult['data'], ownerSearchContainerElement, ownerSearchListElement, ownerPeopleList, 'owner', editAssociate);
})

reviewerSearchBtn.addEventListener('click', async() => {
	searchMethod = document.getElementById('select-id-reviewer').checked ? searchId : searchName;
	let searchResult = await searchMethod(reviewerSearchKeyWord.value);

	addSearchResult(searchResult['data'], reviewerSearchContainerElement, reviewerSearchListElement, reviewerPeopleList, 'reviewer', editAssociate);
})

teamSearchBtn.addEventListener('click', async() => {
	searchMethod = searchTeam;
	let searchResult = await searchMethod(teamSearchKeyWord.value);

	addSearchResult(searchResult['data'], teamSearchContainerElement, teamSearchListElement, teamList, 'team', editAssociate);
})

addCommentBtn.addEventListener('click', () => {
	if(commentInputElement.value == '') {
		alert('Comment should not be empty.');
		return;
	}
	else if(commentInputElement.value.length > 2000) {
		alert('A total of ' + commentInputElement.value.length + ' characters in summary exceeds the limit of 2000 characters');
		return;
	}

	const now = new Date();
	const options = {
		year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', 
	};
	const localTime = now.toLocaleString('en-US', options);
	const formattedDate = localTime.split(', ').join(' ');

	addComment(formattedDate);
})

commentLoadMoreBtn.addEventListener('click', () => {
	getProjectComment();
})

closeTeamContainerBtn.addEventListener('click', ()=>{
	teamContainer.classList.add('unseen');
	darkBackgroundTeamContentElement.classList.add('unseen');
})

addToNoteBtn.addEventListener('click', ()=>{
	personalNoteArea.classList.remove('unseen');
	if(addToNoteBtn.textContent === 'Add to personal notes') {
		addToNoteBtn.textContent = 'See my personal notes';
		addPersonalNote();
	}
	window.scrollTo({
		top: personalNoteArea.offsetTop,
		behavior: 'smooth'
	})
})

saveNoteBtn.addEventListener('click', ()=>{
	if(isAllowSaveNote) {
		updatePersonalNote();
		updateNoteWait.classList.remove('unseen')
	}
})

deleteNoteBtn.addEventListener('click', ()=>{
	if(isAllowDeleteNote) {
		let userConfirm = confirm('Are you sure to delete this note?');
		if(userConfirm) {
			isAllowSaveNote = false;
			isAllowDeleteNote = false;
			saveNoteBtn.classList.remove('note-save-enable');
			updateNoteSuccess.classList.add('unseen');
			deleteNote();
		}
	}
})

window.addEventListener('click', () => {
	if(!ownerSearchContainerElement.classList.contains('unseen')) {
		ownerSearchContainerElement.classList.add('unseen');
	}
	if(!reviewerSearchContainerElement.classList.contains('unseen')) {
		reviewerSearchContainerElement.classList.add('unseen');
	}
	if(!teamSearchContainerElement.classList.contains('unseen')) {
		teamSearchContainerElement.classList.add('unseen');
	}
});

// Enter events
addEnterEffect([ownerSearchKeyWord, reviewerSearchKeyWord, teamSearchKeyWord], [ownerSearchBtn, reviewerSearchBtn, teamSearchBtn]);