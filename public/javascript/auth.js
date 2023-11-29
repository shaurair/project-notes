const signOptBtn = document.getElementById('sign');
const projectsOptBtn = document.getElementById('project');
const personalOptBtn = document.getElementById('personal');
const createProjectBtn = document.getElementById('create-project');
const memberOptBtn = document.getElementById('member');
const memberSelectionElement = document.querySelector(".member-selection");
const memberCenterBtn = document.getElementById('opt-member-center');
const signOutBtn = document.getElementById('opt-sign-out');
let isMemberDialogueShowing = false;
let userInfo;

function showMemberNav() {
	memberOptBtn.classList.remove('unseen');
	personalOptBtn.classList.remove('unseen');
	projectsOptBtn.classList.remove('unseen');
	createProjectBtn.classList.remove('unseen');
	updateUserImage(memberOptBtn);
}

function updateUserImage(updateElement) {
	let imgSrc = userInfo["file_name"] == null ? "user.png" : userInfo["file_name"];
	updateElement.style.backgroundImage = "url(" + "https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/" + imgSrc + ")";
}

function showPublicNav() {
	signOptBtn.classList.remove('unseen');
}

async function getUser() {
	let token = localStorage.getItem('token');
	let response = await fetch("/auth", {
		headers: {'Authorization':`Bearer ${token}`}
	});
	let result = await response.json();

	userInfo = result['data'];
}

window.addEventListener('click', (event) => {
	if(isMemberDialogueShowing && (event.target !== memberSelectionElement) && (event.target !== memberOptBtn)) {
		memberSelectionElement.classList.add('unseen');
		memberOptBtn.classList.remove('in-member');
		isMemberDialogueShowing = false;
	}
});

memberOptBtn.addEventListener('click', () => {
	if(memberSelectionElement.classList.contains('unseen')) {
		memberSelectionElement.classList.remove('unseen');
		memberOptBtn.classList.add('in-member');
		isMemberDialogueShowing = true;
	}
	else {
		memberSelectionElement.classList.add('unseen');
		memberOptBtn.classList.remove('in-member');
		isMemberDialogueShowing = false;
	}
})

memberCenterBtn.addEventListener('click', ()=>{
	location.href = '/member';
});

signOutBtn.addEventListener('click', () => {
	localStorage.removeItem('token');
	localStorage.removeItem('lastNotifyDate');
	location.reload();
});
