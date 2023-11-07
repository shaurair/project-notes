const changeImageElement = document.getElementById('change-image');
const editImageBtn = document.getElementById('edit-image');
const editImageElement = document.getElementById('edit-image-area');
const memberInfoAreaElement = document.getElementById('member-info-area');
const fileInputBtn = document.getElementById('fileInput');
const submitImageBtn = document.getElementById("upload-submit");
const submitImageSuccessElement = document.getElementById("submit-success");
const submitImageWaitingElement = document.getElementById("submit-waiting");
let isAllowImageSubmit = false;

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
	let element = document.getElementById("member-name");
	element.textContent = userInfo["name"];

	element = document.getElementById("member-email");
	element.textContent = userInfo["email"];

	element = document.getElementById("member-image");
	updateUserImage(element);
}

function disableButton() {
	submitImageBtn.style.cursor = "not-allowed";
	submitImageBtn.classList.remove("mouseover");
	isAllowImageSubmit = false;
}

function enableButton() {
	submitImageBtn.style.cursor = "pointer";
	submitImageBtn.classList.add("mouseover");
	submitImageWaitingElement.classList.add("unseen");
	submitImageSuccessElement.classList.add("unseen");
	isAllowImageSubmit = true;
}

// async function sendImageFile() {
// 	let token = localStorage.getItem('token');
// 	let formData = new FormData();
// 	formData.append('photo', imageFile);
// 	let response = await fetch("../api/update/profile/image", {
// 			method: "POST",
// 			body: formData,
// 			headers: {
// 				'Authorization':`Bearer ${token}`,
// 			}
// 	});
// 	let result = await response.json();

// 	if(response.ok) {
// 		submitImageWaitingElement.classList.add("unseen");
// 		submitImageSuccessElement.classList.remove("unseen");
// 		alert("更新成功！頁面將自動跳轉");
// 		location.href = "/member";
// 	}
// 	else {
// 		alert(result["message"]);
// 		submitImageWaitingElement.classList.add("unseen");
// 		disableButton();
// 	}
// }

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

fileInputBtn.addEventListener('change', ()=>{
	imageFile = fileInputBtn.files[0];

	enableButton();
	changeImageElement.src = URL.createObjectURL(imageFile);
	changeImageElement.classList.remove("unseen");
});

submitImageBtn.addEventListener('click', ()=>{
	if(isAllowImageSubmit == true) {
		submitImageSuccessElement.classList.remove("unseen");
		disableButton();
		// sendImageFile();
	}
});