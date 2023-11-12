const viewmoreBtn = document.getElementById('project-viewmore');
const statusSelect = document.getElementById('project-status-value');
const editProjectBtn = document.getElementById('edit-project');
const cancelEditBtn = document.getElementById('cancel-edit-project');
const darkBackgrountElement = document.querySelector('.dark-background');
const editProjectAreaElement = document.querySelector('.edit-project-area');
let projectId = location.href.match(/\/project\/(\d+)/)[1];
let projectData;
let associate = {owner:{}, reviewer:{}, team:{}};

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
			associate.owner[userData['id']] = true;
		});
		projectData['reviewer'].forEach(userData => {
			associate.reviewer[userData['id']] = true;
		});
		projectData['team'].forEach(userData => {
			associate.team[userData['id']] = true;
		});
		setProjectContent(result);
	}
	else {
		alert('something went wrong, please redirect and try again');
	}
}

function addClickEffect(imgUrl, userName, id, peopleListElement, associateRole) {
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
			delete associate[associateRole][id];
			peopleListElement.removeChild(elementContainer);
		})

		let closeIconElement = document.createElement('div');
		closeIconElement.className = 'close-icon';

		closeElement.appendChild(closeIconElement);
		elementContainer.appendChild(closeElement);

		associate[associateRole][id] = true;
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

	// set owner
	peopleListElement = document.getElementById('owner-people-list');
	for(let i = 0; i < projectData['owner'].length; i++) {
		imgUrl = null;
		if(projectData['owner'][i]['image_filename'] != null) {
			imgUrl = `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${projectData['owner'][i]['image_filename']}`;
		}
		addClickEffect(imgUrl, projectData['owner'][i]['name'], projectData['owner'][i]['id'], peopleListElement, 'owner');
	}

	// set reviewer
	peopleListElement = document.getElementById('reviewer-people-list');
	for(let i = 0; i < projectData['reviewer'].length; i++) {
		imgUrl = null;
		if(projectData['reviewer'][i]['image_filename'] != null) {
			imgUrl = `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${projectData['reviewer'][i]['image_filename']}`;
		}
		addClickEffect(imgUrl, projectData['reviewer'][i]['name'], projectData['reviewer'][i]['id'], peopleListElement, 'reviewer');
	}

	// set team
	peopleListElement = document.getElementById('team-list');
	for(let i = 0; i < projectData['team'].length; i++) {
		addClickEffect(null, projectData['team'][i]['name'], projectData['team'][i]['id'], peopleListElement, 'team');
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

function setTeam(name, teamListElement) {
	let element;
	let elementContainer;

	elementContainer = document.createElement('div');
	elementContainer.className = 'project-team-container';
	teamListElement.appendChild(elementContainer);

	element = document.createElement('div');
	element.className = 'people-text';
	element.textContent = name;
	elementContainer.appendChild(element);
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
})