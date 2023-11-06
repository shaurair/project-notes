const viewmoreBtn = document.getElementById('project-viewmore');

async function initProjectId() {
	await getUser();

	if(userInfo == null) {
		location.href = '/';
	}
	else {
		showMemberNav();
	}
}

viewmoreBtn.addEventListener('click', () => {
	const viewmoreDialogueElement = document.querySelector('.viewmore-dialogue-project');
	if(viewmoreDialogueElement.classList.contains('unseen')) {
		viewmoreDialogueElement.classList.remove('unseen');
	}
	else {
		viewmoreDialogueElement.classList.add('unseen');
	}
})