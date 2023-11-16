const loadmoreOpenBtn = document.getElementById('loadmore-open-button');
const loadmoreProgressBtn = document.getElementById('loadmore-progress-button');
const loadmoreReviewingBtn = document.getElementById('loadmore-reviewing-button');
const loadmoreDoneBtn = document.getElementById('loadmore-done-button');
let nextPage = {'OPEN': 0, 'INPROGRESS': 0, 'REVIEWING': 0, 'DONE': 0,}

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
	}
}

async function getMainAndRole(status) {
	let token = localStorage.getItem('token');
	let response = await fetch(`/api_project/main-info?memberId=${userInfo['id']}&status=${status}&page=${nextPage[status]}`, {
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
		tbodyElement = document.getElementById('open-result-tbody');
		if(nextPage[status] == 0) {
			if(dataList.length == 0 ) {
				document.getElementById('no-open').classList.remove('unseen');
				return;
			}
			else {
				document.getElementById('open-project-list').classList.remove('unseen')
			}
		}
	}
	else if(status == 'INPROGRESS') {
		tbodyElement = document.getElementById('progress-result-tbody');
		if(nextPage[status] == 0) {
			if(dataList.length == 0 ) {
				document.getElementById('no-progress').classList.remove('unseen');
				return;
			}
			else {
				document.getElementById('progress-project-list').classList.remove('unseen')
			}
		}
	}
	else if(status == 'REVIEWING') {
		tbodyElement = document.getElementById('reviewing-result-tbody');
		if(nextPage[status] == 0) {
			if(dataList.length == 0 ) {
				document.getElementById('no-reviewing').classList.remove('unseen');
				return;
			}
			else {
				document.getElementById('reviewing-project-list').classList.remove('unseen')
			}
		}
	}
	else if(status == 'DONE') {
		tbodyElement = document.getElementById('done-result-tbody');
		if(nextPage[status] == 0) {
			if(dataList.length == 0 ) {
				document.getElementById('no-done').classList.remove('unseen');
				return;
			}
			else {
				document.getElementById('done-project-list').classList.remove('unseen')
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
		tr.appendChild(td);

		// deadline
		td = document.createElement('td');
		td.textContent = deadline;
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