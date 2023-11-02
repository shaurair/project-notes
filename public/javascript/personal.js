async function initPersonal() {
	await getUser();

	if(userInfo == null) {
		location.href = '/';
	}
	else {
		personalOptBtn.classList.add('in-personal');
		showMemberNav();
	}
}