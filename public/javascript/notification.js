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
	let now = new Date();
	let year = now.getFullYear();
	let month = (now.getMonth() + 1).toString().padStart(2, '0');
	let day = now.getDate().toString().padStart(2, '0');
	let formattedDate = `${year}-${month}-${day}`;

	if(formattedDate !== localStorage.getItem('lastNotifyDate')) {
		getExpiredProject(formattedDate);
	}
}