const PRIORITYTEXT = {
	'Critical': 'critical-text',
	'Major': 'major-text',
	'Minor': 'minor-text'
}
async function searchName(name) {
	let response = await fetch(`/search?name=${name}`);
	return await response.json();
}

async function searchId(id) {
	let response = await fetch(`/search?id=${id}`);
	return await response.json();
}

async function searchTeam(team) {
	let response = await fetch(`/search?team=${team}`);
	return await response.json();
}

async function getGroupMembers(groupId) {
	let token = localStorage.getItem('token');
	let response = await fetch(`/api/group/get-group-member?groupId=${groupId}`, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
	});
	return await response.json();
}

function addEnterEffect(inputElementList, buttonElementList) {
	for(let i = 0; i < inputElementList.length; i++) {
		inputElementList[i].addEventListener('keypress', (event) => {
			if(event.key === 'Enter') {
				buttonElementList[i].click();
			}
		})
	}
}

function addSearchResult(resultData, listContainer, searchListElement, selectedListElement, associateRole, associate) {
	listContainer.classList.remove('unseen');
	searchListElement.innerHTML = '';

	if(resultData['message'] == 'No results') {
		element = document.createElement('div');
		element.textContent = 'No result';
		searchListElement.appendChild(element);
	}
	else {
		let resultList = resultData['result'];
		for(let resultIdx = 0; resultIdx < resultList.length; resultIdx++) {
			let imageFilename = resultList[resultIdx]['image_filename'];
			let imgUrl = (imageFilename == null) ? null : `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${imageFilename}`;
			let name = resultList[resultIdx]['name'];
			let elementContainer = document.createElement('div');
			elementContainer.className = 'search-people-container mouseover';
			searchListElement.appendChild(elementContainer);

			if(associateRole != 'team') {
				addImgToContainer(imgUrl, elementContainer);
			}
			addNameToContainer(name, elementContainer);
			addClickEffect(elementContainer, imgUrl, name, resultList[resultIdx]['id'], selectedListElement, associateRole, associate);
		}
	}
}

function addClickEffect(resultElement, imgUrl, userName, id, selectedListElement, associateRole, associate) {
	resultElement.addEventListener('click', () => {
		addToList(imgUrl, userName, id, selectedListElement, associateRole, associate)
	})
}

function addToList(imgUrl, userName, id, selectedListElement, associateRole, associate) {
	if(associate[associateRole][id]) {
		return;
	}
	let elementContainer = document.createElement('div');
	elementContainer.className = 'people-container';
	selectedListElement.appendChild(elementContainer);

	if(associateRole != 'team') {
		addImgToContainer(imgUrl, elementContainer);
		addNameToContainer(userName, elementContainer);
	}
	else {
		addNameAndLinkToContainer(userName, elementContainer, id);
	}

	addRemoveOption(elementContainer, selectedListElement, associate, associateRole, id);
	associate[associateRole][id] = true;
}

function addImgToContainer(imgUrl, elementContainer) {
	let element = document.createElement('div');
	element.className = 'people-img';
	elementContainer.appendChild(element);
	if(imgUrl != null) {
		element.style.backgroundImage = `url(${imgUrl})`;
	}
}

function addNameToContainer(name, elementContainer) {
	let element = document.createElement('div');
	element.className = 'people-text';
	element.textContent = name;
	elementContainer.appendChild(element);
}

function addNameAndLinkToContainer(name, elementContainer, groupId) {
	let element = document.createElement('div');
	element.className = 'people-text mouseover';
	element.textContent = name;
	elementContainer.appendChild(element);

	element.addEventListener('click', async() => {
		let result = await getGroupMembers(groupId);
		teamContainer.classList.remove('unseen');
		darkBackgroundTeamContentElement.classList.remove('unseen');
		document.getElementById('team-name-title').textContent = name;

		memberList = result['data']['groupMember'];
		memberPeopleList.innerHTML = '';
		memberList.forEach(memberData => {
			let imageFilename = memberData['image_filename'];
			let imgUrl = (imageFilename == null) ? null : `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${imageFilename}`;
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
}

function addRemoveOption(elementContainer, elementContainerList, associate, associateRole, id) {
	let closeElement = document.createElement('div');
	closeElement.className = 'close mouseover';
	closeElement.addEventListener('click', () => {
		delete associate[associateRole][id];
		elementContainerList.removeChild(elementContainer);
	})
	elementContainer.appendChild(closeElement);

	let closeIconElement = document.createElement('div');
	closeIconElement.className = 'close-icon';
	closeElement.appendChild(closeIconElement);
}

async function updateNote(projectId, note) {
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
		return 'ok'
	}
	else {
		return result["message"];
	}
}

async function deleteNote(projectId) {
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
		return 'ok'
	}
	else {
		return result["message"];
	}
}

async function getNote(projectId) {
	let token = localStorage.getItem('token');
	let response = await fetch(`/api/note/one-note?projectId=${projectId}`, {
		headers: {Authorization: `Bearer ${token}`}
	})
	return await response.json();
}

function getTodayDate() {
	let now = new Date();
	let year = now.getFullYear();
	let month = (now.getMonth() + 1).toString().padStart(2, '0');
	let day = now.getDate().toString().padStart(2, '0');
	return `${year}/${month}/${day}`;
}