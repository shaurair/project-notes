async function initIndex() {
	await getUser();

	if(userInfo == null) {
		showPublicNav();
		document.getElementById('start-button').classList.remove('unseen');
	}
	else {
		showMemberNav();
	}
}