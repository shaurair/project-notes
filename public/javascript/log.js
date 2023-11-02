const demoBtn = document.querySelector('.demo-user');
const signInEmailElement = document.getElementById('email');
const signInPasswordElement = document.getElementById('password');
const goSignUpBtn = document.getElementById('go-sign-up-btn');
const goSignInBtn = document.getElementById('go-sign-in-btn');
const signInAreaElement = document.getElementById('sign-in-area');
const signUpAreaElement = document.getElementById('sign-up-area');
const signInBtn = document.getElementById('sign-in-btn');

function checkInputFormat(name, email, password) {
	let emailRule = /^[A-Za-z0-9_.-]+\@[A-Za-z0-9_.-]+$/;

	if(name == '') {
		return '姓名未輸入';
	}
	
	if(email == '') {
		return 'Email未輸入';
	}
	else if(emailRule.test(email) == false) {
		return 'Email格式不正確';
	}

	if(password == '') {
		return '密碼未輸入';
	}

	return 'ok';
}

async function signIn(email, password) {
	let messageElement = document.getElementById("sign-in-message");
	let checkInputResult = checkInputFormat(null, email, password);

	if(checkInputResult == 'ok') {
		let response = await fetch("/log", {
			method: "PUT",
			body: JSON.stringify({"email":email,
								"password":password       
			}),
			headers: {'Content-Type':'application/json'}
		});
		let result = await response.json();

		if(response.ok) {
			localStorage.setItem('token', result["token"]);
			location.href = '/';
		}
		else {
			messageElement.textContent = result['message'];
		}
	}
	else {
		messageElement.textContent = checkInputResult;
	}
}

async function initLog() {
	await getUser();

	if(userInfo == null) {
		showPublicNav();
	}
	else {
		showMemberNav();
	}
}

demoBtn.addEventListener('click', () => {
	signInEmailElement.value = 'test@test.com';
	signInPasswordElement.value = 'test123';
})

signInBtn.addEventListener('click', () => {
	signIn(signInEmailElement.value, signInPasswordElement.value);
})

goSignUpBtn.addEventListener('click', () => {
	signInAreaElement.classList.add('unseen');
	signUpAreaElement.classList.remove('unseen');
})
goSignInBtn.addEventListener('click', () => {
	signInAreaElement.classList.remove('unseen');
	signUpAreaElement.classList.add('unseen');
})