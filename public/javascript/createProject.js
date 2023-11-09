const ownerSearchBtn = document.getElementById('owner-search');
const ownerSearchContainerElement = document.getElementById('owner-search-result');
const ownerSearchListElement = document.getElementById('owner-search-list');
const ownerSearchKeyWord = document.getElementById('owner-input');
let isSearchResultShowing = false;

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
	let result = await response.json();

	addSearchResult(result['data'], ownerSearchContainerElement, ownerSearchListElement);
}

async function searchId(id) {
	let response = await fetch(`/search?id=${id}`);
	let result = await response.json();
	
	addSearchResult(result['data'], ownerSearchContainerElement, ownerSearchListElement);
}

function addSearchResult(resultData, listContainer, listElement) {
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
			elementContainer.className = 'search-people-container';
			listElement.appendChild(elementContainer);

			let element = document.createElement('div');
			element.className = 'people-img';
			elementContainer.appendChild(element);

			element = document.createElement('div');
			element.className = 'people-text';
			element.textContent = resultList[resultIdx]['name'];
			elementContainer.appendChild(element);
		}
	}
}

ownerSearchBtn.addEventListener('click', () => {
	if(document.getElementById('select-id-owner').checked) {
		searchId(ownerSearchKeyWord.value);
	}
	else {
		searchName(ownerSearchKeyWord.value);
	}
})

ownerSearchKeyWord.addEventListener('keypress', (event) => {
	if(event.key === 'Enter') {
		ownerSearchBtn.click();
	}
})

window.addEventListener('click', (event) => {
	if(isSearchResultShowing && (!event.target.closest ('#owner-search-list'))) {
		ownerSearchContainerElement.classList.add('unseen');
		isSearchResultShowing = false;
	}
});