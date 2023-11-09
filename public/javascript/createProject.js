const ownerSearchBtn = document.getElementById('owner-search');
const ownerSearchContainerElement = document.getElementById('owner-search-result');
const ownerSearchListElement = document.getElementById('owner-search-list');
const ownerSearchKeyWord = document.getElementById('owner-input');
const ownerPeopleList = document.getElementById('owner-people-list');
const assigneeSearchBtn = document.getElementById('assignee-search');
const assigneeSearchContainerElement = document.getElementById('assignee-search-result');
const assigneeSearchListElement = document.getElementById('assignee-search-list');
const assigneeSearchKeyWord = document.getElementById('assignee-input');
const assigneePeopleList = document.getElementById('assignee-people-list');
const followerSearchBtn = document.getElementById('follower-search');
const followerSearchContainerElement = document.getElementById('follower-search-result');
const followerSearchListElement = document.getElementById('follower-search-list');
const followerSearchKeyWord = document.getElementById('follower-input');
const followerPeopleList = document.getElementById('follower-people-list');
const addProjectBtn = document.getElementById('add-project');
const summaryElement = document.getElementById('summary-input-content');
let isSearchResultShowing = false;
let associatePeople = {owner:{}, assignee:{}, follower:{}};

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
		if(associatePeople[associateRole][id]) {
			return;
		}

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

assigneeSearchBtn.addEventListener('click', async() => {
	searchMethod = document.getElementById('select-id-assignee').checked ? searchId : searchName;
	let searchResult = await searchMethod(assigneeSearchKeyWord.value);

	addSearchResult(searchResult['data'], assigneeSearchContainerElement, assigneeSearchListElement, assigneePeopleList, 'assignee');
})

followerSearchBtn.addEventListener('click', async() => {
	searchMethod = document.getElementById('select-id-follower').checked ? searchId : searchName;
	let searchResult = await searchMethod(followerSearchKeyWord.value);

	addSearchResult(searchResult['data'], followerSearchContainerElement, followerSearchListElement, followerPeopleList, 'follower');
})

ownerSearchKeyWord.addEventListener('keypress', (event) => {
	if(event.key === 'Enter') {
		ownerSearchBtn.click();
	}
})

assigneeSearchKeyWord.addEventListener('keypress', (event) => {
	if(event.key === 'Enter') {
		assigneeSearchBtn.click();
	}
})

followerSearchKeyWord.addEventListener('keypress', (event) => {
	if(event.key === 'Enter') {
		followerSearchBtn.click();
	}
})

window.addEventListener('click', (event) => {
	if(isSearchResultShowing) {
		if(!ownerSearchContainerElement.classList.contains('unseen')) {
			ownerSearchContainerElement.classList.add('unseen');
		}
		if(!assigneeSearchContainerElement.classList.contains('unseen')) {
			assigneeSearchContainerElement.classList.add('unseen');
		}
		if(!followerSearchContainerElement.classList.contains('unseen')) {
			followerSearchContainerElement.classList.add('unseen');
		}
		
		isSearchResultShowing = false;
	}
});

addProjectBtn.addEventListener('click', () => {
	let checkContentResult = checkContent();
	if(checkContentResult == 'ok') {
		// TODO
	}
	else {
		alert(checkContentResult);
	}
})

function checkContent() {
	if(summaryElement.value == '') {
		summaryElement.classList.add('highlight-block');
		return 'Summary should not be empty'
	}
	else {
		summaryElement.classList.remove('highlight-block');
	}

	if(Object.keys(associatePeople['owner']).length == 0) {
		ownerSearchKeyWord.classList.add('highlight-block');
		return 'Owner should not be empty'
	}
	else {
		ownerSearchKeyWord.classList.remove('highlight-block');
	}

	return 'ok';
}