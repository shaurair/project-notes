const changeImageElement = document.getElementById('change-image');
const editImageBtn = document.getElementById('edit-image');
const editNameBtn = document.getElementById('edit-name');
const editImageElement = document.getElementById('edit-image-area');
const editNameElement = document.getElementById('edit-name-area');
const newNameInputElement = document.getElementById('change-name-txt');
const memberInfoAreaElement = document.getElementById('member-info-area');
const fileInputBtn = document.getElementById('fileInput');
const submitImageBtn = document.getElementById("upload-submit");
const submitImageSuccessElement = document.getElementById("submit-success");
const submitImageWaitingElement = document.getElementById("submit-waiting");
const submitDataBtn = document.getElementById("upload-member-data-submit");
const submitDataSuccessElement = document.getElementById("update-success");
const submitDataWaitingElement = document.getElementById("update-waiting");
const createTeamBtn = document.getElementById('create-team');
const createTeamEditElement = document.getElementById('create-team-input-area');
const addTeamBtn = document.getElementById('add-team-submit');
const newTeamNameInput = document.getElementById('new-team-name');
const addTeamSuccessElement = document.getElementById("add-team-success");
const addTeamWaitingElement = document.getElementById("add-team-waiting");
const teamContentElement = document.querySelector('.team-content-area');
const teamContentBackgroundElement = document.querySelector('.dark-background');
const teamListElement = document.getElementById('team-list');
const teamNameTitleElement = document.getElementById('team-name-title');
const updateTeamNameInput = document.getElementById('team-name-update-input');
const closeTeamContentBtn = document.getElementById('close-team-content');
const teamMemberBtn = document.getElementById('team-member');
const updateTeamNameBtn = document.getElementById('update-team-name');
const teamMemberArea = document.querySelector('.team-member-area');
const updateTeamNameArea = document.querySelector('.update-team-area');
const memberSearchBtn = document.getElementById('member-search');
const memberSearchContainerElement = document.getElementById('member-search-result');
const memberSearchListElement = document.getElementById('member-search-list');
const memberSearchKeyWord = document.getElementById('member-input');
const memberPeopleList = document.getElementById('member-people-list');
const updateMemberBtn = document.getElementById('update-group');
const updateTeamNameSubmitBtn = document.getElementById('update-team-submit');
const updateTeamNameSuccessElement = document.getElementById("update-team-success");
const updateTeamNameWaitingElement = document.getElementById("update-team-waiting");
let isAllowImageSubmit = false;
let isAllowDataSubmit = true;
let isAllowGroupSubmit = true;
let isAllowUpdateTeamNameSubmit = true;
let originalMember = {member:{}};
let editMember = {member:{}};

async function initMember() {
	await getUser();

	if(userInfo == null) {
		location.href = '/';
	}
	else {
		memberOptBtn.classList.add('in-member');
		showMemberNav();
		setMemberInfo();
		getTeam();
	}
}

function setMemberInfo() {
	let element = document.getElementById("member-name");
	element.textContent = userInfo["name"];

	element = document.getElementById("member-id");
	element.textContent = userInfo["id"];

	element = document.getElementById("member-email");
	element.textContent = userInfo["email"];

	element = document.getElementById("member-image");
	updateUserImage(element);
}

function disableButton() {
	submitImageBtn.style.cursor = "not-allowed";
	submitImageBtn.classList.remove("mouseover");
	isAllowImageSubmit = false;
}

function enableButton() {
	submitImageBtn.style.cursor = "pointer";
	submitImageBtn.classList.add("mouseover");
	submitImageWaitingElement.classList.add("unseen");
	submitImageSuccessElement.classList.add("unseen");
	isAllowImageSubmit = true;
}

function disableDataButton() {
	submitDataBtn.style.cursor = "not-allowed";
	submitDataBtn.classList.remove("mouseover");
	isAllowDataSubmit = false;
}

function enableDataButton() {
	submitDataBtn.style.cursor = "pointer";
	submitDataBtn.classList.add("mouseover");
	isAllowDataSubmit = true;
}

function disableAddTeamButton() {
	addTeamBtn.style.cursor = "not-allowed";
	addTeamBtn.classList.remove("mouseover");
	isAllowGroupSubmit = false;
}

function enableAddTeamButton() {
	addTeamBtn.style.cursor = "pointer";
	addTeamBtn.classList.add("mouseover");
	isAllowGroupSubmit = true;
}

function disableUpdateTeamNameButton() {
	updateTeamNameSubmitBtn.style.cursor = 'not-allowed';
	updateTeamNameSubmitBtn.classList.remove('mouseover');
	isAllowUpdateTeamNameSubmit = false;
}

function enableUpdateTeamNameButton() {
	updateTeamNameSubmitBtn.style.cursor = "pointer";
	updateTeamNameSubmitBtn.classList.add("mouseover");
	isAllowUpdateTeamNameSubmit = true;
}

async function sendImageFile() {
	let token = localStorage.getItem('token');
	let formData = new FormData();
	formData.append('photo', imageFile);
	let response = await fetch("/member/update/image", {
			method: "PATCH",
			body: formData,
			headers: {
				'Authorization':`Bearer ${token}`,
			}
	});
	let result = await response.json();

	if(response.ok) {
		submitImageWaitingElement.classList.add("unseen");
		submitImageSuccessElement.classList.remove("unseen");
		localStorage.setItem('token', result['data']['token']);
		alert("Successfully updated! This page will automatically redirect");
		location.href = '/member';
	}
	else {
		alert(result['data']["message"] + ( response.status >= 500 ? " Please redirect this page and try again." : ''));
		submitImageWaitingElement.classList.add("unseen");
		disableButton();
	}
}

async function updateData(name) {
	let token = localStorage.getItem('token');
	let response = await fetch("/member/update/name", {
			method: "PATCH",
			body: JSON.stringify({
				"name":name
			}),
			headers: {
				'Authorization':`Bearer ${token}`,
				'Content-Type':'application/json'
			}
	});
	let result = await response.json();

	if(response.ok) {
		submitDataWaitingElement.classList.add("unseen");
		submitDataSuccessElement.classList.remove("unseen");
		localStorage.setItem('token', result['data']["token"]);
		alert("Successfully updated! This page will automatically redirect");
		location.href = '/member';
	}
	else {
		alert(result['data']["message"] + ( response.status >= 500 ? " Please redirect this page and try again." : ''));
		submitDataWaitingElement.classList.add("unseen");
		enableDataButton();
	}
}

async function createTeam(name) {
	let token = localStorage.getItem('token');
	let response = await fetch("/api/group/create", {
			method: "POST",
			body: JSON.stringify({
				"name":name
			}),
			headers: {
				'Authorization':`Bearer ${token}`,
				'Content-Type':'application/json'
			}
	});
	let result = await response.json();

	if(response.ok) {
		addTeamWaitingElement.classList.add("unseen");
		addTeamSuccessElement.classList.remove("unseen");
		alert("Successfully created! This page will automatically redirect");
		teamListElement.innerHTML = '';
		createTeamBtn.click();
		getTeam();
	}
	else {
		alert(result['data']["message"] + (response.status >= 500 ? ' Please redirect this page and try again.' : ''));
		addTeamWaitingElement.classList.add("unseen");
		enableAddTeamButton();
	}
}

async function getTeam() {
	let token = localStorage.getItem('token');
	let response = await fetch('/api/group/get-my-group', {
			headers: {
				'Authorization': `Bearer ${token}`
			}
	});
	let result = await response.json();

	if(response.ok) {
		setGroupList(result['data']['myGroup']);
	}
	else {
		alert(result['data']['message'] + (response.status >= 500 ? ' Please redirect this page and try again.' : ''))
	}
}

function setGroupList(groupList) {
	if(groupList.length == 0) {
		teamListElement.textContent = 'No result';
	}
	else {
		groupList.forEach(group => {
			let groupName = group.name;
			let groupId = group.group_id;
			let element = document.createElement('div');
			element.className = 'team mouseover';
			element.textContent = groupName;
			teamListElement.appendChild(element);
			element.addEventListener('click', async ()=>{
				teamContentElement.classList.remove('unseen');
				teamContentBackgroundElement.classList.remove('unseen');
				updateTeamNameInput.value = groupName;
				teamNameTitleElement.textContent = groupName;
				teamNameTitleElement.value = groupId;
				let result = await getGroupMembers(groupId);
				setMemberList(result['data']['groupMember']);
			})
		})
	}
}

function setMemberList(memberList) {
	memberList.forEach(memberData => {
		originalMember.member[memberData['member_id']] = true;
		let imageFilename = memberData['image_filename'];
		let imgUrl = (imageFilename == null) ? null : `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${imageFilename}`;
		let memberId = memberData['member_id'];
		let memberName = memberData['name'];

		if(editMember['member'][memberId]) {
			return;
		}

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
	
		if(memberId != userInfo['id']) {
			let closeElement = document.createElement('div');
			closeElement.className = 'close mouseover';
			closeElement.addEventListener('click', () => {
				delete editMember['member'][memberId];
				memberPeopleList.removeChild(elementContainer);
			})
	
			let closeIconElement = document.createElement('div');
			closeIconElement.className = 'close-icon';
			closeElement.appendChild(closeIconElement);
			elementContainer.appendChild(closeElement);
		}
	
		editMember['member'][memberId] = true;
	});
}

async function updateTeamMember(memberDiff) {
	let groupId = teamNameTitleElement.value;
	let token = localStorage.getItem('token');
	let response = await fetch(`/api/group/update-member?groupId=${groupId}`, {
			method: 'PUT',
			body: JSON.stringify({
				memberDiff
			}),
			headers: {
				'Authorization':`Bearer ${token}`,
				'Content-Type':'application/json'
			}
	})

	let result = await response.json();

	if(response.ok) {
		alert("Successfully updated team member!");
		originalMember.member = {...editMember.member};
	}
	else {
		alert(result['data']["message"] + (response.status >= 500 ? ' Please redirect this page and try again.' : ''));
	}
}

async function updateTeamName() {
	let groupId = teamNameTitleElement.value;
	let newName = updateTeamNameInput.value;
	let token = localStorage.getItem('token');
	let response = await fetch(`/api/group/update-name?groupId=${groupId}&name=${newName}`, {
			method: 'PUT',
			headers: {
				'Authorization':`Bearer ${token}`
			}
	})

	let result = await response.json();

	updateTeamNameWaitingElement.classList.add('unseen');
	if(response.ok) {
		updateTeamNameSuccessElement.classList.remove('unseen');
		teamNameTitleElement.textContent = newName;
		enableUpdateTeamNameButton();
		teamListElement.innerHTML = '';
		getTeam();
	}
	else {
		alert(result['data']["message"] + (response.status >= 500 ? ' Please redirect this page and try again.' : ''));
	}
}

editImageBtn.addEventListener('click', ()=>{
	if(editImageBtn.textContent == "Cancel") {
		editImageElement.classList.add("unseen");
		memberInfoAreaElement.classList.remove("unseen");
		editNameBtn.classList.remove("unseen");
		// editPasswordBtn.classList.remove("unseen");
		editImageBtn.textContent = "Upload new photo";
	}
	else {
		editImageElement.classList.remove("unseen");
		memberInfoAreaElement.classList.add("unseen");
		editNameBtn.classList.add("unseen");
		// editPasswordBtn.classList.add("unseen");
		editImageBtn.textContent = "Cancel";
	}
});

editNameBtn.addEventListener('click', ()=>{
	if(editNameBtn.textContent == "Cancel") {
		editNameElement.classList.add("unseen");
		memberInfoAreaElement.classList.remove("unseen");
		editImageBtn.classList.remove("unseen");
		// editPasswordBtn.classList.remove("unseen");
		editNameBtn.textContent = "Upload name";
	}
	else {
		editNameElement.classList.remove("unseen");
		memberInfoAreaElement.classList.add("unseen");
		editImageBtn.classList.add("unseen");
		newNameInputElement.value = userInfo['name'];
		// editPasswordBtn.classList.add("unseen");
		editNameBtn.textContent = "Cancel";
	}
});

fileInputBtn.addEventListener('change', ()=>{
	imageFile = fileInputBtn.files[0];

	enableButton();
	changeImageElement.src = URL.createObjectURL(imageFile);
	changeImageElement.classList.remove("unseen");
});

submitImageBtn.addEventListener('click', ()=>{
	if(isAllowImageSubmit == true) {
		submitImageWaitingElement.classList.remove("unseen");
		disableButton();
		sendImageFile();
	}
});

submitDataBtn.addEventListener('click', ()=>{
	if(isAllowDataSubmit == true) {
		if(userInfo['name'] == newNameInputElement.value) {
			alert('The input name is the same as current name')
			return;
		}
		if(newNameInputElement.value == '') {
			alert('Please enter a name')
			return;
		}

		submitImageWaitingElement.classList.remove("unseen");
		disableDataButton();
		updateData(newNameInputElement.value);
	}
})

createTeamBtn.addEventListener('click', ()=>{
	createTeamEditElement.classList.remove('unseen');

	if(createTeamBtn.textContent == "Cancel") {
		createTeamEditElement.classList.add("unseen");
		createTeamBtn.textContent = "Create a new team";
	}
	else {
		createTeamEditElement.classList.remove("unseen");
		createTeamBtn.textContent = "Cancel";
	}
})

addTeamBtn.addEventListener('click', ()=>{
	if(isAllowGroupSubmit == true) {
		if(newTeamNameInput.value == '') {
			alert('Please enter a team name')
			return;
		}

		addTeamWaitingElement.classList.remove("unseen");
		disableAddTeamButton();
		createTeam(newTeamNameInput.value);
	}
})

closeTeamContentBtn.addEventListener('click', ()=>{
	teamContentElement.classList.add('unseen');
	teamContentBackgroundElement.classList.add('unseen');
	editMember = {member:{}};
	originalMember = {member:{}};
	memberPeopleList.innerHTML = '';
})

teamMemberBtn.addEventListener('click', ()=>{
	teamMemberArea.classList.remove('unseen');
	updateTeamNameArea.classList.add('unseen');
	teamMemberBtn.classList.add('team-action-selected');
	updateTeamNameBtn.classList.remove('team-action-selected');
})

updateTeamNameBtn.addEventListener('click', ()=>{
	teamMemberArea.classList.add('unseen');
	updateTeamNameArea.classList.remove('unseen');
	teamMemberBtn.classList.remove('team-action-selected');
	updateTeamNameBtn.classList.add('team-action-selected');
})

memberSearchBtn.addEventListener('click', async() => {
	searchMethod = document.getElementById('select-id-member').checked ? searchId : searchName;
	let searchResult = await searchMethod(memberSearchKeyWord.value);

	addSearchResult(searchResult['data'], memberSearchContainerElement, memberSearchListElement, memberPeopleList, 'member', editMember);
})

updateMemberBtn.addEventListener('click', ()=>{
	let memberDiff = {};
	memberDiff['delete'] = Object.keys(originalMember['member']).filter(MemberIdKey => !editMember['member'].hasOwnProperty(MemberIdKey));
	memberDiff['add'] = Object.keys(editMember['member']).filter(MemberIdKey => !originalMember['member'].hasOwnProperty(MemberIdKey));
	if(memberDiff['delete'].length == 0 && memberDiff['add'].length == 0) {
		alert('team member is same as before');
		return;
	}
	updateTeamMember(memberDiff);
})

updateTeamNameSubmitBtn.addEventListener('click', ()=>{
	if(isAllowUpdateTeamNameSubmit) {
		if(teamNameTitleElement.textContent === updateTeamNameInput.value) {
			alert('input team name has not changed!')
			return;
		}
		disableUpdateTeamNameButton();
		updateTeamNameSuccessElement.classList.add('unseen');
		updateTeamNameWaitingElement.classList.remove('unseen');
		updateTeamName();
	}
})

window.addEventListener('click', () => {
	if(!memberSearchContainerElement.classList.contains('unseen')) {
		memberSearchContainerElement.classList.add('unseen');
	}
});

// Enter events
addEnterEffect([memberSearchKeyWord], [memberSearchBtn]);