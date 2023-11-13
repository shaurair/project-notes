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
const followerSearchBtn = document.getElementById('follower-search');
const followerSearchContainerElement = document.getElementById('follower-search-result');
const followerSearchListElement = document.getElementById('follower-search-list');
const followerSearchKeyWord = document.getElementById('follower-input');
const followerPeopleList = document.getElementById('follower-people-list');
const teamSearchBtn = document.getElementById('team-search');
const teamSearchContainerElement = document.getElementById('team-search-result');
const teamSearchListElement = document.getElementById('team-search-list');
const teamSearchKeyWord = document.getElementById('team-input');
const teamList = document.getElementById('team-list');
const addProjectBtn = document.getElementById('add-project');
const summaryElement = document.getElementById('summary-input-content');
const descriptionElement = document.getElementById('description-input');
let isSearchResultShowing = false;
let associate = {owner:{}, reviewer:{}, follower:{}, team:{}};

async function initCreateProject() {
	await getUser();

	if(userInfo == null) {
		location.href = '/';
	}
	else {
		showMemberNav();
	}
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

			let imgUrl = null;
			if(associateRole != 'team') {
				let element = document.createElement('div');
				element.className = 'people-img';
				if(resultList[resultIdx]['image_filename'] != null) {
					imgUrl = `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${resultList[resultIdx]['image_filename']}`;
					element.style.backgroundImage = `url(${imgUrl})`;
				}
				elementContainer.appendChild(element);
			}

			let userName = resultList[resultIdx]['name'];
			element = document.createElement('div');
			element.className = 'people-text';
			element.textContent = userName;
			elementContainer.appendChild(element);

			addClickEffect(elementContainer, imgUrl, userName, resultList[resultIdx]['id'], peopleListElement, associateRole);
		}
	}
}

function addToList(imgUrl, userName, id, peopleListElement, associateRole, associate) {
	if(associate[associateRole][id]) {
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

	associate[associateRole][id] = true;

	addRemoveOption(elementContainer, peopleListElement, associate, associateRole, id);
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

function addClickEffect(resultElement, imgUrl, userName, id, peopleListElement, associateRole) {
	resultElement.addEventListener('click', () => {
		addToList(imgUrl, userName, id, peopleListElement, associateRole, associate)
	})
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

	if(Object.keys(associate['owner']).length == 0) {
		ownerSearchKeyWord.classList.add('highlight-block');
		return 'Owner should not be empty'
	}
	else {
		ownerSearchKeyWord.classList.remove('highlight-block');
	}

	return 'ok';
}

async function createNewProject() {
	let summary = summaryElement.value;
	let description = document.getElementById('description-input').value;
	let priority = document.getElementById('create-priority').value;
	let deadline = document.getElementById('deadline-input').value == '' ? null : document.getElementById('deadline-input').value;
	let creator = userInfo['id'];

	let response = await fetch("/api_project/", {
		method: "POST",
		body: JSON.stringify({ 'summary': summary,
							   'description': description,
							   'priority': priority,
							   'deadline': deadline,
							   'creator': creator,
							   'associate': associate
		}),
		headers: {'Content-Type':'application/json'}
	});
	let result = await response.json();

	if(response.ok) {
		alert('Successfully created!');
		location.href = `/project/${result['id']}`;
	}
	else {
		alert(result["message"] + " Please redirect this page and try again.");
	}
}

// Click events
ownerSearchBtn.addEventListener('click', async() => {
	searchMethod = document.getElementById('select-id-owner').checked ? searchId : searchName;
	let searchResult = await searchMethod(ownerSearchKeyWord.value);

	addSearchResult(searchResult['data'], ownerSearchContainerElement, ownerSearchListElement, ownerPeopleList, 'owner');
})

reviewerSearchBtn.addEventListener('click', async() => {
	searchMethod = document.getElementById('select-id-reviewer').checked ? searchId : searchName;
	let searchResult = await searchMethod(reviewerSearchKeyWord.value);

	addSearchResult(searchResult['data'], reviewerSearchContainerElement, reviewerSearchListElement, reviewerPeopleList, 'reviewer');
})

followerSearchBtn.addEventListener('click', async() => {
	searchMethod = document.getElementById('select-id-follower').checked ? searchId : searchName;
	let searchResult = await searchMethod(followerSearchKeyWord.value);

	addSearchResult(searchResult['data'], followerSearchContainerElement, followerSearchListElement, followerPeopleList, 'follower');
})

teamSearchBtn.addEventListener('click', async() => {
	searchMethod = searchTeam;
	let searchResult = await searchMethod(teamSearchKeyWord.value);

	addSearchResult(searchResult['data'], teamSearchContainerElement, teamSearchListElement, teamList, 'team');
})

window.addEventListener('click', (event) => {
	if(isSearchResultShowing) {
		if(!ownerSearchContainerElement.classList.contains('unseen')) {
			ownerSearchContainerElement.classList.add('unseen');
		}
		if(!reviewerSearchContainerElement.classList.contains('unseen')) {
			reviewerSearchContainerElement.classList.add('unseen');
		}
		if(!followerSearchContainerElement.classList.contains('unseen')) {
			followerSearchContainerElement.classList.add('unseen');
		}
		if(!teamSearchContainerElement.classList.contains('unseen')) {
			teamSearchContainerElement.classList.add('unseen');
		}
		
		isSearchResultShowing = false;
	}
});

addProjectBtn.addEventListener('click', () => {
	let checkContentResult = checkContent();
	if(checkContentResult == 'ok') {
		createNewProject();
	}
	else {
		alert(checkContentResult);
	}
})

// Enter events
addEnterEffect([ownerSearchKeyWord, reviewerSearchKeyWord, teamSearchKeyWord], [ownerSearchBtn, reviewerSearchBtn, teamSearchBtn]);