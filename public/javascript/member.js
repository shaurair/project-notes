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
let isAllowImageSubmit = false;
let isAllowDataSubmit = true;
let isAllowGroupSubmit = true;

async function initMember() {
	await getUser();

	if(userInfo == null) {
		location.href = '/';
	}
	else {
		memberOptBtn.classList.add('in-member');
		showMemberNav();
		setMemberInfo();
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
		location.reload();
	}
	else {
		alert(result['data']["message"] + ( response.status >= 500 ? " Please redirect this page and try again." : ''));
		addTeamWaitingElement.classList.add("unseen");
		enableAddTeamButton();
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