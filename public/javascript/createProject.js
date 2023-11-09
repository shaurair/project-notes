const ownerSearchBtn = document.getElementById('owner-search');
const ownerSearchContainerElement = document.getElementById('owner-search-result');
const ownerSearchListElement = document.getElementById('owner-search-list');
const ownerSearchKeyWord = document.getElementById('owner-input');
const ownerPeopleList = document.getElementById('owner-people-list');
let isSearchResultShowing = false;
let associatePeople = {owner:{}, assignee:{}, follower:{}}

async function initCreateProject() {
	await getUser();

	if(userInfo == null) {
		showPublicNav();
	}
	else {
		showMemberNav();
	}
}

async function searchName(name) {
	let response = await fetch(`/search?name=${name}`);
	return await response.json();
}

async function searchId(id) {
	let response = await fetch(`/search?id=${id}`);
	return await response.json();
}

function addSearchResult(resultData, listContainer, listElement, peopleListElement, associateRole) {
	listContainer.classList.remove('unseen');
	isSearchResultShowing = true;
	listElement.innerHTML = '';

	if(resultData['message'] == 'No results') {
		element = document.createElement('div');
		element.textContent = 'No result';
		listElement.appendChild(element);
	}
	else {
		let resultList = resultData['result'];
		for(let resultIdx = 0; resultIdx < resultList.length; resultIdx++) {
			let elementContainer = document.createElement('div');
			elementContainer.className = 'search-people-container mouseover';
			listElement.appendChild(elementContainer);

			let element = document.createElement('div');
			let imgUrl = null;
			element.className = 'people-img';
			if(resultList[resultIdx]['image_filename'] != null) {
				imgUrl = `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${resultList[resultIdx]['image_filename']}`;
				element.style.backgroundImage = `url(${imgUrl})`;
			}
			elementContainer.appendChild(element);

			let userName = resultList[resultIdx]['name'];
			element = document.createElement('div');
			element.className = 'people-text';
			element.textContent = userName;
			elementContainer.appendChild(element);

			addClickEffect(elementContainer, imgUrl, userName, resultList[resultIdx]['id'], peopleListElement, associateRole);
		}
	}
}

function addClickEffect(resultElement, imgUrl, userName, id, peopleListElement, associateRole) {
	resultElement.addEventListener('click', () => {
		let elementContainer = document.createElement('div');
		elementContainer.className = 'people-container';
		peopleListElement.appendChild(elementContainer);

		let element = document.createElement('div');
		element.className = 'people-img';
		elementContainer.appendChild(element);
		if(imgUrl != null) {
			element.style.backgroundImage = `url(${imgUrl})`;
		}

		element = document.createElement('div');
		element.className = 'people-text';
		element.textContent = userName;
		elementContainer.appendChild(element);

		let closeElement = document.createElement('div');
		closeElement.className = 'close mouseover';
		closeElement.addEventListener('click', () => {
			delete associatePeople[associateRole][id];
			peopleListElement.removeChild(elementContainer);
		})

		let closeIconElement = document.createElement('div');
		closeIconElement.className = 'close-icon';

		closeElement.appendChild(closeIconElement);
		elementContainer.appendChild(closeElement);

		associatePeople[associateRole][id] = true;
	})
}

ownerSearchBtn.addEventListener('click', async() => {
	searchMethod = document.getElementById('select-id-owner').checked ? searchId : searchName;
	let searchResult = await searchMethod(ownerSearchKeyWord.value);

	addSearchResult(searchResult['data'], ownerSearchContainerElement, ownerSearchListElement, ownerPeopleList, 'owner');
})

ownerSearchKeyWord.addEventListener('keypress', (event) => {
	if(event.key === 'Enter') {
		ownerSearchBtn.click();
	}
})

window.addEventListener('click', (event) => {
	if(isSearchResultShowing) {
		ownerSearchContainerElement.classList.add('unseen');
		isSearchResultShowing = false;
	}
});