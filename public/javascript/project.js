const loadmoreOpenBtn = document.getElementById('loadmore-open-button');
let nextPageOpen = 0;

async function initProject() {
	await getUser();

	if(userInfo == null) {
		location.href = '/';
	}
	else {
		projectsOptBtn.classList.add('in-project');
		showMemberNav();
		getMainAndRole('OPEN');
	}
}

async function getMainAndRole(status) {
	let token = localStorage.getItem('token');
	let response = await fetch(`/api_project/main-info?memberId=${userInfo['id']}&status=${status}&page=${nextPageOpen}`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});

	let result = await response.json();

	if(response.ok) {
		setStatusResult(status, result['content'], result['roles']);
		nextPageOpen = result['nextPage'];
		if( nextPageOpen == null) {
			loadmoreOpenBtn.classList.add('unseen');
		}
	}
	else {
		alert('something went wrong, please redirect and try again');
	}
}

function setStatusResult(status, dataList, roleInfo) {
	if(status == 'OPEN') {
		for(let i = 0; i < dataList.length; i++) {
			let projectId = dataList[i]['project_id'];
			let summary = dataList[i]['summary'];
			let priority = dataList[i]['priority'];
			let deadline = dataList[i]['deadline'] == null ? '-' : dataList[i]['deadline'];

			let tbodyElement = document.getElementById('open-result-tbody');
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
			td.className = 'tb-project-people';
			let ownerList = roleInfo[projectId]['owner'];
			for(let ownerIdx = 0; ownerIdx < ownerList.length; ownerIdx++) {
				let imageFilename = ownerList[ownerIdx]['image'];
				let name = ownerList[ownerIdx]['name'];
				let imgUrl = (imageFilename == null) ? null : `https://d2o8k69neolkqv.cloudfront.net/project-note/user_img/${imageFilename}`;

				let elementContainer = document.createElement('div');
				elementContainer.className = 'project-people-container';
				td.appendChild(elementContainer);

				addImgToContainer(imgUrl, elementContainer);
				addNameToContainer(name, elementContainer);
			}

			// reviewer
			td = document.createElement('td');
			tr.appendChild(td);

			let peopleListElement = document.createElement('div');
			peopleListElement.className = 'tb-project-people-container';
			td.appendChild(peopleListElement);
			
			let reviewerList = roleInfo[projectId]['reviewer'];
			if(reviewerList.length == 0) {
				td.textContent = '-'
			}
			for(let reviewerIdx = 0; reviewerIdx < reviewerList.length; reviewerIdx++) {
				let imageFilename = reviewerList[reviewerIdx]['image'];
				let name = reviewerList[reviewerIdx]['name'];
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
}

loadmoreOpenBtn.addEventListener('click', () => {
	getMainAndRole('OPEN');
})