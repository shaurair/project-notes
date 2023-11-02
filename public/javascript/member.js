async function initMember() {
	await getUser();

	if(userInfo == null) {
		location.href = '/';
	}
	else {
		memberOptBtn.classList.add('in-member');
		showMemberNav();
	}
}