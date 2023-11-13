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

function addEnterEffect(inputElementList, buttonElementList) {
	for(let i = 0; i < inputElementList.length; i++) {
		inputElementList[i].addEventListener('keypress', (event) => {
			if(event.key === 'Enter') {
				buttonElementList[i].click();
			}
		})
	}
}

function addSearchResult(resultData, listContainer, listElement, peopleListElement, associateRole, associate) {
	listContainer.classList.remove('unseen');
	listElement.innerHTML = '';

	if(resultData['message'] == 'No results') {
		element = document.createElement('div');
		element.textContent = 'No result';
		listElement.appendChild(element);
	}
	else {
		let resultList = resultData['result'];
		for(let resultIdx = 0; resultIdx < resultList.length; resultIdx++) {
			let imageFilename = resultList[resultIdx]['image_filename'];
			let imgUrl = (imageFilename == null) ? null : `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${imageFilename}`;
			let name = resultList[resultIdx]['name'];
			let elementContainer = document.createElement('div');
			elementContainer.className = 'search-people-container mouseover';
			listElement.appendChild(elementContainer);

			if(associateRole != 'team') {
				addImgToContainer(imgUrl, elementContainer);
			}
			addNameToContainer(name, elementContainer);
			addClickEffect(elementContainer, imgUrl, name, resultList[resultIdx]['id'], peopleListElement, associateRole, associate);
		}
	}
}

function addClickEffect(resultElement, imgUrl, userName, id, peopleListElement, associateRole, associate) {
	resultElement.addEventListener('click', () => {
		addToList(imgUrl, userName, id, peopleListElement, associateRole, associate)
	})
}

function addToList(imgUrl, userName, id, peopleListElement, associateRole, associate) {
	if(associate[associateRole][id]) {
		return;
	}
	let elementContainer = document.createElement('div');
	elementContainer.className = 'people-container';
	peopleListElement.appendChild(elementContainer);

	if(associateRole != 'team') {
		addImgToContainer(imgUrl, elementContainer);
	}

	addNameToContainer(userName, elementContainer);
	addRemoveOption(elementContainer, peopleListElement, associate, associateRole, id);
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