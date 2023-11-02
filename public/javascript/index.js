async function initIndex() {
	await getUser();

	if(userInfo == null) {
		showPublicNav()
	}
	else {
		showMemberNav();
	}
}