async function setDeadlineNotification(expiredList, todayDate) {
	Notification.requestPermission().then(permission=>{
		if(permission === 'granted') {
			expiredList.forEach(project=>{
				const projectId = project['project_id'];
				const notificationProject = new Notification('Project Expiration', {
					body: `Project-${projectId} deadline has been meet!`,
					icon: '/images/logo.png',
					tag: `Project-${projectId}-deadline`,
					
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
		setDeadlineNotification(expiredList, todayDate);
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

	setWebSocketNotification();
}

function setWebSocketNotification() {
	let wsHead = (PORT == PORT_OPT.HTTP) ? 'ws://' : 'wss://';
	const socket = new WebSocket(wsHead + window.location.host);
	let memberId = userInfo['id'];

	socket.addEventListener('open', function (event) {
		socket.send(JSON.stringify({
			type: 'memberId', memberId
		}));
	})

	socket.addEventListener('message', function (event) {
		setUpdateNotification(event.data);
    })
}

async function setUpdateNotification(message) {
	let messageInfo = JSON.parse(message);
	let projectId = messageInfo.projectId;
	let messageText = messageInfo.message;

	Notification.requestPermission().then(permission=>{
		if(permission === 'granted') {
			const notificationUpdateProject = new Notification('Project Update', {
				body: messageText,
				icon: '/images/logo.png'
				
			})
			notificationUpdateProject.addEventListener('click', ()=>{
				window.open(`/project/${projectId}`, '_blank');
				notificationUpdateProject.close();
			})
		}
	})
}