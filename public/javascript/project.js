async function initProject() {
	await getUser();

	if(userInfo == null) {
		location.href = '/';
	}
	else {
		projectsOptBtn.classList.add('in-project');
		showMemberNav();
	}
}