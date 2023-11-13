async function searchName(name) {
	let response = await fetch(`/search?name=${name}`);
	return await response.json();
}

async function searchId(id) {
	let response = await fetch(`/search?id=${id}`);
	return await response.json();
}

async function searchTeam(team) {
	let response = await fetch(`/search?team=${team}`);
	return await response.json();
}

function addEnterEffect(inputElementList, buttonElementList) {
	for(let i = 0; i < inputElementList.length; i++) {
		inputElementList[i].addEventListener('keypress', (event) => {
			if(event.key === 'Enter') {
				buttonElementList[i].click();
			}
		})
	}
}