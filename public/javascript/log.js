const demoBtn = document.querySelector('.demo-user');
const signInEmailElement = document.getElementById('email');
const signInPasswordElement = document.getElementById('password');
const signUpNameElement = document.getElementById('sign-name');
const signUpEmailElement = document.getElementById('sign-email');
const signUpPasswordElement = document.getElementById('sign-password');
const goSignUpBtn = document.getElementById('go-sign-up-btn');
const goSignInBtn = document.getElementById('go-sign-in-btn');
const signInAreaElement = document.getElementById('sign-in-area');
const signUpAreaElement = document.getElementById('sign-up-area');
const signInBtn = document.getElementById('sign-in-btn');
const signUpBtn = document.getElementById('sign-up-btn');

function checkInputFormat(name, email, password) {
	let emailRule = /^[A-Za-z0-9_.-]+\@[A-Za-z0-9_.-]+$/;

	if(name == '') {
		return 'Name is required';
	}
	
	if(email == '') {
		return 'Email is required';
	}
	else if(emailRule.test(email) == false) {
		return 'Email format is incorrect';
	}

	if(password == '') {
		return 'Passowrd is required';
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

async function signUp(name, email, password) {
	let messageElement = document.getElementById("sign-up-message");
	let checkInputResult = checkInputFormat(name, email, password);

	if(checkInputResult == 'ok') {
		let response = await fetch("/log", {
			method: "POST",
			body: JSON.stringify({ "name":name,
								"email":email,
								"password":password       
			}),
			headers: {'Content-Type':'application/json'}
		});
		let result = await response.json();

		if(response.ok) {
			alert('Your registration is successful!');
			location.href = '/log';
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

signUpBtn.addEventListener('click', () => {
	signUp(signUpNameElement.value, signUpEmailElement.value, signUpPasswordElement.value);
})

goSignUpBtn.addEventListener('click', () => {
	signInAreaElement.classList.add('unseen');
	signUpAreaElement.classList.remove('unseen');
})
goSignInBtn.addEventListener('click', () => {
	signInAreaElement.classList.remove('unseen');
	signUpAreaElement.classList.add('unseen');
})