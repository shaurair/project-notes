async function initProjectId() {
	await getUser();

	if(userInfo == null) {
		showPublicNav();
	}
	else {
		showMemberNav();
	}
}