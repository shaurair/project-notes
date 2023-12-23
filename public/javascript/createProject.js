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
const addProjectBtn = document.getElementById('add-project');
const summaryElement = document.getElementById('summary-input-content');
const descriptionElement = document.getElementById('description-input');
const darkBackgroundTeamContentElement = document.querySelector('.team-content-dark-background');
const teamContainer = document.querySelector('.project-team-content-area');
const closeTeamContainerBtn = document.getElementById('close-team-content');
const memberPeopleList = document.getElementById('member-people-list');
let createAssociate = {owner:{}, reviewer:{}, team:{}};
let isAllowOwnerSearch = true;
let isAllowReviewerSearch = true;
let isAllowTeamSearch = true;

async function initCreateProject() {
	await getUser();

	if(userInfo == null) {
		location.href = '/';
	}
	else {
		showMemberNav();
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

	if(Object.keys(createAssociate['owner']).length == 0) {
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

	let response = await fetch("/api/project/", {
		method: "POST",
		body: JSON.stringify({ 'summary': summary,
							   'description': description,
							   'priority': priority,
							   'deadline': deadline,
							   'creator': creator,
							   'associate': createAssociate
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

// input event
ownerSearchKeyWord.addEventListener('input', ()=>{
	ownerSearchBtn.click();
})

reviewerSearchKeyWord.addEventListener('input', ()=>{
	reviewerSearchBtn.click();
})

teamSearchKeyWord.addEventListener('input', ()=>{
	teamSearchBtn.click();
})

// Click events
ownerSearchBtn.addEventListener('click', async() => {
	if(isAllowOwnerSearch === false) {
		return;
	}
	isAllowOwnerSearch = false;
	let keyword = ownerSearchKeyWord.value;

	searchMethod = document.getElementById('select-id-owner').checked ? searchId : searchName;
	let searchResult = await searchMethod(keyword);

	addSearchResult(searchResult['data'], ownerSearchContainerElement, ownerSearchListElement, ownerPeopleList, 'owner', createAssociate);
	
	isAllowOwnerSearch = true;
	if(keyword !== ownerSearchKeyWord.value) {
		ownerSearchBtn.click();
	}
})

reviewerSearchBtn.addEventListener('click', async() => {
	if(isAllowReviewerSearch === false) {
		return;
	}
	isAllowReviewerSearch = false;
	let keyword = reviewerSearchKeyWord.value;

	searchMethod = document.getElementById('select-id-reviewer').checked ? searchId : searchName;
	let searchResult = await searchMethod(keyword);

	addSearchResult(searchResult['data'], reviewerSearchContainerElement, reviewerSearchListElement, reviewerPeopleList, 'reviewer', createAssociate);

	isAllowReviewerSearch = true;
	if(keyword !== reviewerSearchKeyWord.value) {
		reviewerSearchBtn.click();
	}
})

teamSearchBtn.addEventListener('click', async() => {
	if(isAllowTeamSearch === false) {
		return;
	}
	isAllowTeamSearch = false;
	let keyword = teamSearchKeyWord.value;

	searchMethod = searchTeam;
	let searchResult = await searchMethod(keyword);

	addTeamSearchResult(searchResult['data'], teamSearchContainerElement, teamSearchListElement, teamList, 'team', createAssociate, darkBackgroundTeamContentElement);

	isAllowTeamSearch = true;
	if(keyword !== teamSearchKeyWord.value) {
		teamSearchBtn.click();
	}
})

closeTeamContainerBtn.addEventListener('click', ()=>{
	teamContainer.classList.add('unseen');
	darkBackgroundTeamContentElement.classList.add('unseen');
})

window.addEventListener('click', (event) => {
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