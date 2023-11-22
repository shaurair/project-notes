const searchNoteProjectIdBtn = document.getElementById('search-note-project-id');
const searchNoteProjectIdInput = document.getElementById('search-note-id');
const noNoteElement = document.getElementById('no-note');
const noteListContainer = document.querySelector('.personal-list');
const loadmoreBtn = document.getElementById('loadmore-note-button');
const ALLOW = {
	ALLOW_ACTION: 0,
	REJECT_ACTION: 1
}
let nextPage = 0;

async function initPersonal() {
	await getUser();

	if(userInfo == null) {
		location.href = '/';
	}
	else {
		personalOptBtn.classList.add('in-personal');
		showMemberNav();
		getNotes();
	}
}

async function getNotes() {
	let token = localStorage.getItem('token');
	let response = await fetch(`/api/note/notes?nextPage=${nextPage}`, {
								headers: {Authorization: `Bearer ${token}`}
							});
	let result = await response.json();

	if(response.ok) {
		nextPage = result['nextPage'];
		setNote(result['note']);
		if(nextPage == null) {
			loadmoreBtn.classList.add('unseen');
		}
		else {
			loadmoreBtn.classList.remove('unseen');
		}
	}
	else {
		alert('something went wrong while loading notes, please redirect and try again');
	}
}

function setNote(noteList) {
	if(noteList.length == 0) {
		noNoteElement.classList.remove('unseen')
	}
	else {
		noteList.forEach(note => {
			let projectId = note['project_id'];
			let projectSummary = note['summary'];
			let noteText = note['note'];

			let noteContainer = document.createElement('div');
			noteContainer.className = 'note';
			noteListContainer.appendChild(noteContainer);

			// title (project summary)
			let elementHead =  document.createElement('div');
			elementHead.className = 'note-head';
			noteContainer.appendChild(elementHead);

			let element =  document.createElement('div');
			element.className = 'note-title';
			let linkElement = document.createElement('a');
			linkElement.className = 'hyperlink project-text';
			linkElement.href = `/project/${projectId}`;
			linkElement.target = '_blank';
			linkElement.textContent = `project-${projectId}: ${projectSummary}`;
			element.appendChild(linkElement);
			elementHead.appendChild(element);

			// note
			let elementNote = document.createElement('div');
			noteContainer.appendChild(elementNote);
			let noteInput = document.createElement('textarea');
			noteInput.className = 'input-note';
			noteInput.dir = 'ltr';
			noteInput.value = noteText;
			elementNote.appendChild(noteInput);

			// waiting or success hint
			let waitingElement = document.createElement('div');
			waitingElement.className = 'submit-status-place unseen';
			addWaitingChild(waitingElement);
			elementNote.appendChild(waitingElement);

			let successElement = document.createElement('div');
			successElement.className = 'submit-status-place unseen';
			addSuccessChild(successElement);
			elementNote.appendChild(successElement);

			// actions
			let elementAction =  document.createElement('div');
			elementAction.className = 'note-button-group';
			noteContainer.appendChild(elementAction);

			let saveBtnContainer = document.createElement('div');
			saveBtnContainer.className = 'note-text-button-container';

			let saveBtn = document.createElement('button');
			saveBtn.className = 'note-text-button';
			saveBtn.textContent = 'Save';
			saveBtnContainer.appendChild(saveBtn);
			elementAction.appendChild(saveBtnContainer);

			let deleteBtn = document.createElement('div');
			deleteBtn.className = 'note-delete-icon mouseover';
			elementAction.appendChild(deleteBtn);

			noteInput.addEventListener('input', ()=>{
				successElement.classList.add('unseen');
				if(noteInput.value != noteText) {
					saveBtn.classList.add('note-save-enable');
					saveBtn.value = ALLOW.ALLOW_ACTION;
				}
				else {
					saveBtn.classList.remove('note-save-enable');
					saveBtn.value = ALLOW.REJECT_ACTION;
				}
			})

			saveBtn.addEventListener('click', async ()=>{
				if(saveBtn.value == ALLOW.ALLOW_ACTION) {
					waitingElement.classList.remove('unseen');

					let note = noteInput.value;
					let result = await updateNote(projectId, note);

					waitingElement.classList.add('unseen');

					if(result === 'ok') {
						successElement.classList.remove('unseen');
						saveBtn.classList.remove('note-save-enable');
					}
					else {
						alert(result + " Please redirect this page and try again.");
					}
				}
			})

			deleteBtn.addEventListener('click', async ()=>{
				let userConfirm = confirm('Are you sure to delete this note?');
				if(userConfirm) {
					successElement.classList.add('unseen');
					let result = await deleteNote(projectId);

					if(result === 'ok') {
						noteListContainer.removeChild(noteContainer);
					}
					else {
						alert(result + " Please redirect this page and try again.");
					}
				}
			})
		});
	}
}

function addWaitingChild(container) {
	let element = document.createElement('span');
	element.className = 'waiting-text';
	element.textContent = 'Updating';
	container.appendChild(element);

	element = document.createElement('img');
	element.className = 'submit-status';
	element.src = '/images/waiting.gif';
	container.appendChild(element);
}

function addSuccessChild(container) {
	let element = document.createElement('img');
	element.className = 'submit-status';
	element.src = '/images/checked.png';
	container.appendChild(element);

	element = document.createElement('span');
	element.className = 'success-text';
	element.textContent = 'Successfully updated.';
	container.appendChild(element);
}

async function updatePersonalNote() {
	let note = personalNoteInput.value;
	let result = await updateNote(projectId, note);

	if(result === 'ok') {
		currentPersonalNote = note;
		updateNoteWait.classList.add('unseen');
		updateNoteSuccess.classList.remove('unseen');
		saveNoteBtn.classList.remove('note-save-enable');
		isAllowDeleteNote = true;
	}
	else {
		alert(result + " Please redirect this page and try again.");
	}
}

searchNoteProjectIdBtn.addEventListener('click', ()=> {
	let projectId = Number(searchNoteProjectIdInput.value);
	if(Number.isInteger(projectId) && projectId > 0) {
		// TODO
	}
	else {
		alert('please input a project id');
	}
})

loadmoreBtn.addEventListener('click', ()=>{
	getNotes();
})