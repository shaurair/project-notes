const noResultOpenElement = document.getElementById('no-open');
const noResultProgressElement = document.getElementById('no-progress');
const noResultReviewingElement = document.getElementById('no-reviewing');
const noResultDoneElement = document.getElementById('no-done');
const resultOpenContainer = document.getElementById('open-project-list');
const resultProgressContainer = document.getElementById('progress-project-list');
const resultReviewingContainer = document.getElementById('reviewing-project-list');
const resultDoneContainer = document.getElementById('done-project-list');
const resultOpenElement = document.getElementById('open-result-tbody');
const resultProgressElement = document.getElementById('progress-result-tbody');
const resultReviewingElement = document.getElementById('reviewing-result-tbody');
const resultDoneElement = document.getElementById('done-result-tbody');
const loadmoreOpenBtn = document.getElementById('loadmore-open-button');
const loadmoreProgressBtn = document.getElementById('loadmore-progress-button');
const loadmoreReviewingBtn = document.getElementById('loadmore-reviewing-button');
const loadmoreDoneBtn = document.getElementById('loadmore-done-button');
const searchBtn = document.getElementById('project-search');
const myRoleSelect = document.getElementById('role-select');
const keywordInput = document.getElementById('search-input');
let myRole = 0;
let keyword = '';
let nextPage = {'OPEN': 0, 'INPROGRESS': 0, 'REVIEWING': 0, 'DONE': 0,};

async function initProject() {
	await getUser();

	if(userInfo == null) {
		location.href = '/';
	}
	else {
		projectsOptBtn.classList.add('in-project');
		showMemberNav();
		getMainAndRole('OPEN');
		getMainAndRole('INPROGRESS');
		getMainAndRole('REVIEWING');
		getMainAndRole('DONE');
		checkNotification();
	}
}

async function getMainAndRole(status) {
	let token = localStorage.getItem('token');
	let response = await fetch(`/api_project/main-info?memberId=${userInfo['id']}&status=${status}&page=${nextPage[status]}&myRole=${myRole}&keyword=${keyword}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

	let result = await response.json();

	if(response.ok) {
		setStatusResult(status, result['content'], result['roles']);
		nextPage[status] = result['nextPage'];
		setLoadmoreBtn(status);
	}
	else {
		alert('something went wrong, please redirect and try again');
	}
}

function setStatusResult(status, dataList, roleInfo) {
	let tbodyElement;
	if(status == 'OPEN') {
		tbodyElement = resultOpenElement;
		if(nextPage[status] == 0) {
			if(dataList.length == 0 ) {
				noResultOpenElement.classList.remove('unseen');
				return;
			}
			else {
				resultOpenContainer.classList.remove('unseen')
			}
		}
	}
	else if(status == 'INPROGRESS') {
		tbodyElement = resultProgressElement;
		if(nextPage[status] == 0) {
			if(dataList.length == 0 ) {
				noResultProgressElement.classList.remove('unseen');
				return;
			}
			else {
				resultProgressContainer.classList.remove('unseen')
			}
		}
	}
	else if(status == 'REVIEWING') {
		tbodyElement = resultReviewingElement;
		if(nextPage[status] == 0) {
			if(dataList.length == 0 ) {
				noResultReviewingElement.classList.remove('unseen');
				return;
			}
			else {
				resultReviewingContainer.classList.remove('unseen')
			}
		}
	}
	else if(status == 'DONE') {
		tbodyElement = resultDoneElement;
		if(nextPage[status] == 0) {
			if(dataList.length == 0 ) {
				noResultDoneElement.classList.remove('unseen');
				return;
			}
			else {
				resultDoneContainer.classList.remove('unseen')
			}
		}
	}

	for(let i = 0; i < dataList.length; i++) {
		let projectId = dataList[i]['project_id'];
		let summary = dataList[i]['summary'];
		let priority = dataList[i]['priority'];
		let deadline = dataList[i]['deadline'] == null ? '-' : dataList[i]['deadline'];
		let tr = document.createElement('tr');
		tbodyElement.appendChild(tr);

		// project id summary
		let td = document.createElement('td');
		td.className = 'tb-project-summary';
		let link = document.createElement('a');
		link.className = 'hyperlink project-text';
		link.href = `project/${projectId}`;
		link.textContent = `Project-${projectId}` + "  " + summary;
		td.appendChild(link);
		tr.appendChild(td);

		// owner
		td = document.createElement('td');
		td.className = 'tb-people';
		tr.appendChild(td);

		let peopleListElement = document.createElement('div');
		peopleListElement.className = 'tb-project-people-container';
		td.appendChild(peopleListElement);
		
		let peopleList = roleInfo[projectId]['owner'];
		if(peopleList.length == 0) {
			td.textContent = '-'
		}
		for(let peopleIdx = 0; peopleIdx < peopleList.length; peopleIdx++) {
			let imageFilename = peopleList[peopleIdx]['image'];
			let name = peopleList[peopleIdx]['name'];
			imgUrl = (imageFilename == null) ? null : `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${imageFilename}`;

			elementContainer = document.createElement('div');
			elementContainer.className = 'project-people-container';
			peopleListElement.appendChild(elementContainer);

			addImgToContainer(imgUrl, elementContainer);
			addNameToContainer(name, elementContainer);
		}

		// reviewer
		td = document.createElement('td');
		td.className = 'tb-people';
		tr.appendChild(td);

		peopleListElement = document.createElement('div');
		peopleListElement.className = 'tb-project-people-container';
		td.appendChild(peopleListElement);
		
		peopleList = roleInfo[projectId]['reviewer'];
		if(peopleList.length == 0) {
			td.textContent = '-'
		}
		for(let peopleIdx = 0; peopleIdx < peopleList.length; peopleIdx++) {
			let imageFilename = peopleList[peopleIdx]['image'];
			let name = peopleList[peopleIdx]['name'];
			imgUrl = (imageFilename == null) ? null : `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${imageFilename}`;

			elementContainer = document.createElement('div');
			elementContainer.className = 'project-people-container';
			peopleListElement.appendChild(elementContainer);
			
			addImgToContainer(imgUrl, elementContainer);
			addNameToContainer(name, elementContainer);
		}

		// priority
		td = document.createElement('td');
		td.textContent = priority;
		td.classList.add(PRIORITYTEXT[priority]);
		tr.appendChild(td);

		// deadline
		td = document.createElement('td');
		td.textContent = deadline;
		if(deadline !== '-' && deadline <= getTodayDate()) {
			td.classList.add('highlight-text');
		}
		tr.appendChild(td);
	}
}

function setLoadmoreBtn(status) {
	next = nextPage[status];
	if(next == null) {
		if(status == 'OPEN') {
			loadmoreOpenBtn.classList.add('unseen');
		}
		else if(status == 'INPROGRESS') {
			loadmoreProgressBtn.classList.add('unseen');
		}
		else if(status == 'REVIEWING') {
			loadmoreReviewingBtn.classList.add('unseen');
		}
		else if(status == 'DONE') {
			loadmoreDoneBtn.classList.add('unseen');
		}
	}
}

function resetLoadmoreBtn() {
	loadmoreOpenBtn.classList.remove('unseen');
	loadmoreProgressBtn.classList.remove('unseen');
	loadmoreReviewingBtn.classList.remove('unseen');
	loadmoreDoneBtn.classList.remove('unseen');
}

myRoleSelect.addEventListener('change', ()=>{
	searchBtn.click();
})

loadmoreOpenBtn.addEventListener('click', () => {
	getMainAndRole('OPEN');
})

loadmoreProgressBtn.addEventListener('click', () => {
	getMainAndRole('INPROGRESS');
})

loadmoreReviewingBtn.addEventListener('click', () => {
	getMainAndRole('REVIEWING');
})

loadmoreDoneBtn.addEventListener('click', () => {
	getMainAndRole('DONE');
})

searchBtn.addEventListener('click', () => {
	resultOpenContainer.classList.add('unseen');
	resultProgressContainer.classList.add('unseen');
	resultReviewingContainer.classList.add('unseen');
	resultDoneContainer.classList.add('unseen');
	resultOpenElement.innerHTML = '';
	resultProgressElement.innerHTML = '';
	resultReviewingElement.innerHTML = '';
	resultDoneElement.innerHTML = '';
	noResultOpenElement.classList.add('unseen');
	noResultProgressElement.classList.add('unseen');
	noResultReviewingElement.classList.add('unseen');
	noResultDoneElement.classList.add('unseen');
	resetLoadmoreBtn();

	myRole = myRoleSelect.value;
	keyword = keywordInput.value;
	nextPage = {'OPEN': 0, 'INPROGRESS': 0, 'REVIEWING': 0, 'DONE': 0,};

	getMainAndRole('OPEN');
	getMainAndRole('INPROGRESS');
	getMainAndRole('REVIEWING');
	getMainAndRole('DONE');
})

// Enter events
addEnterEffect([keywordInput], [searchBtn]);