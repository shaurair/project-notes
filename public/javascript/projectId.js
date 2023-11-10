const viewmoreBtn = document.getElementById('project-viewmore');
const statusSelect = document.getElementById('project-status-value');
let projectId = location.href.match(/\/project\/(\d+)/)[1];

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
		setProjectContent(result);
	}
	else {
		alert('something went wrong, please redirect and try again');
	}
}

function setProjectContent(data) {
	let element = document.getElementById('project-summary');
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

	let creatorContainer = document.getElementById('creator-container');
	let elementContainer = document.createElement('div');
	elementContainer.className = 'project-people-container';
	creatorContainer.appendChild(elementContainer);

	let imgUrl = null;
	element = document.createElement('div');
	element.className = 'people-img';
	if(data['creatorImage'] != null) {
		imgUrl = `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${data['creatorImage']}`;
		element.style.backgroundImage = `url(${imgUrl})`;
	}
	elementContainer.appendChild(element);

	let userName = data['creatorName'];
	element = document.createElement('div');
	element.className = 'people-text';
	element.textContent = userName;
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

statusSelect.addEventListener('change', changeStatusColor)