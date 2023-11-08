async function initCreateProject() {
	await getUser();

	if(userInfo == null) {
		showPublicNav();
	}
	else {
		showMemberNav();
	}
}