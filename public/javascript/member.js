const changeImageElement = document.getElementById('change-image');
const editImageBtn = document.getElementById('edit-image');
const editImageElement = document.getElementById('edit-image-area');
const memberInfoAreaElement = document.getElementById('member-info-area');

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
	let imgSrc = userInfo["file_name"] == null ? "user" : userInfo["id"];
	let element = document.getElementById("member-name");
	element.textContent = userInfo["name"];

	element = document.getElementById("member-email");
	element.textContent = userInfo["email"];

	element = document.getElementById("member-image");
	element.style.backgroundImage = "url(" + "https://d2o8k69neolkqv.cloudfront.net/" + imgSrc + ".png" + ")";
}

editImageBtn.addEventListener('click', ()=>{
	if(editImageBtn.textContent == "取消編輯") {
		editImageElement.classList.add("unseen");
		memberInfoAreaElement.classList.remove("unseen");
		// editDataBtn.classList.remove("unseen");
		// editPasswordBtn.classList.remove("unseen");
		editImageBtn.textContent = "修改大頭貼";
	}
	else {
		editImageElement.classList.remove("unseen");
		memberInfoAreaElement.classList.add("unseen");
		// editDataBtn.classList.add("unseen");
		// editPasswordBtn.classList.add("unseen");
		editImageBtn.textContent = "取消編輯";
	}
});