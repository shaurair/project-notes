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
const viewmoreBtn = document.getElementById('project-viewmore');
const statusSelect = document.getElementById('project-status-value');
const editProjectBtn = document.getElementById('edit-project');
const cancelEditBtn = document.getElementById('cancel-edit-project');
const darkBackgrountElement = document.querySelector('.dark-background');
const editProjectAreaElement = document.querySelector('.edit-project-area');
let projectId = location.href.match(/\/project\/(\d+)/)[1];
let projectData;
let originalAssociate = {owner:{}, reviewer:{}, team:{}};
let editAssociate = {owner:{}, reviewer:{}, team:{}};

async function initProjectId() {
	await getUser();

	if(userInfo == null) {
		location.href = '/';
	}
	else {
		showMemberNav();
		getProjectContent();
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
		element.textContent = projectData['deadline'];
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
		addEditDefaultRoles(null, projectData['team'][i]['name'], projectData['team'][i]['id'], peopleListElement, 'team');
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

function setProjectContent(data) {
	let element;
	let peopleListContainer;
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
	imgUrl = null;
	if(data['creatorImage'] != null) {
		imgUrl = `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${data['creatorImage']}`;
	}

	setPeople(imgUrl, data['creatorName'], peopleListContainer);

	// set owner
	peopleListContainer = document.getElementById('owner-container');
	for(let i = 0; i < data['owner'].length; i++) {
		imgUrl = null;
		if(data['owner'][i]['image_filename'] != null) {
			imgUrl = `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${data['owner'][i]['image_filename']}`;
		}
		setPeople(imgUrl, data['owner'][i]['name'], peopleListContainer);
	}

	// set reviewer
	peopleListContainer = document.getElementById('reviewer-container');
	for(let i = 0; i < data['reviewer'].length; i++) {
		imgUrl = null;
		if(data['reviewer'][i]['image_filename'] != null) {
			imgUrl = `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${data['reviewer'][i]['image_filename']}`;
		}
		setPeople(imgUrl, data['reviewer'][i]['name'], peopleListContainer);
	}

	// set team
	peopleListContainer = document.getElementById('team-container');
	for(let i = 0; i < data['team'].length; i++) {
		setTeam(data['team'][i]['name'], peopleListContainer);
	}
}

function setPeople(imgUrl, name, peopleListElement) {
	let elementContainer = document.createElement('div');
	elementContainer.className = 'project-people-container';
	peopleListElement.appendChild(elementContainer);

	addImgToContainer(imgUrl, elementContainer);
	addNameToContainer(name, elementContainer);
}

function setTeam(name, teamListElement) {
	let elementContainer = document.createElement('div');
	elementContainer.className = 'project-team-container';
	teamListElement.appendChild(elementContainer);

	addNameToContainer(name, elementContainer);
}

function changeStatusColor() {
	const selectedValue = statusSelect.value;

	if(selectedValue == 'OPEN') {
		statusSelect.style.backgroundColor = 'grey';
	}
	else if(selectedValue == 'IN PROGRESS') {
		statusSelect.style.backgroundColor = 'darkblue';
	}
	else if(selectedValue == 'REVIEWING') {
		statusSelect.style.backgroundColor = 'blueviolet';
	}
	else if(selectedValue == 'DONE') {
		statusSelect.style.backgroundColor = 'teal';
	}
}

// Click events
viewmoreBtn.addEventListener('click', () => {
	const viewmoreDialogueElement = document.querySelector('.viewmore-dialogue-project');
	if(viewmoreDialogueElement.classList.contains('unseen')) {
		viewmoreDialogueElement.classList.remove('unseen');
	}
	else {
		viewmoreDialogueElement.classList.add('unseen');
	}
})

statusSelect.addEventListener('change', changeStatusColor);

editProjectBtn.addEventListener('click', () => {
	darkBackgrountElement.classList.remove('unseen');
	editProjectAreaElement.classList.remove('unseen');
	setEditProjectContent();
});

cancelEditBtn.addEventListener('click', () => {
	darkBackgrountElement.classList.add('unseen');
	editProjectAreaElement.classList.add('unseen');
});

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