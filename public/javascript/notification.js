async function setNotification(expiredList, todayDate) {
	Notification.requestPermission().then(permission=>{
		if(permission === 'granted') {
			expiredList.forEach(project=>{
				const projectId = project['project_id'];
				const notificationProject = new Notification('Project Expiration', {
					body: `Project-${projectId} deadline has been meet!`,
					icon: '/images/logo.png',
					tag: `Project-${projectId}`,
					
				})
				notificationProject.addEventListener('click', ()=>{
					window.open(`/project/${projectId}`, '_blank');
					notificationProject.close();
				})
			})
		}
	}).then(()=>{
		localStorage.setItem('lastNotifyDate', todayDate);
	})
}

async function getExpiredProject(todayDate) {
	let token = localStorage.getItem('token');
	let response = await fetch(`/api/notification/expired`, {
		headers: {Authorization: `Bearer ${token}`}
	})
	let result = await response.json();

	if(response.ok) {
		let expiredList = result['expired'];
		setNotification(expiredList, todayDate);
	}
	else {
		alert(result["message"] + " Please redirect this page and try again.");
	}
}

function checkNotification() {
	let todayDate = getTodayDate();

	if(todayDate !== localStorage.getItem('lastNotifyDate')) {
		getExpiredProject(todayDate);
	}

	debugTest();
}

function debugTest() {
	const socket = new WebSocket('ws://' + window.location.host);
	let memberId = userInfo['id'];

	socket.addEventListener('open', function (event) {
		socket.send(JSON.stringify({
			type: 'memberId', memberId
		}));
	})

	socket.addEventListener('message', function (event) {
        console.log('message from server: ', event.data)
    })
}