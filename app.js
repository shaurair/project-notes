const express = require('express');
const app = express();
const port = 4000;

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json())

// ----------------- //
// static templates  //
// ----------------- //
app.set('view engine', 'ejs');
app.get("/", (req, res) => {
	res.render('index');
})
app.get("/log", (req, res) => {
	res.render('log');
})
app.get("/projects", (req, res) => {
	res.render('projects');
})
app.get("/project/:id", (req,res) => {
	res.render('projectId.ejs', {id: req.params.id});
})
app.get("/personal", (req, res) => {
	res.render('personal');
})
app.get("/member", (req, res) => {
	res.render('member');
})
app.get("/create-project", (req, res) => {
	res.render('createProject');
})

// ----------------- //
// routes            //
// ----------------- //
const logRouter 			= require('./routes/log');
const authRouter			= require('./routes/auth');
const memberRouter			= require('./routes/member');
const searchRouter			= require('./routes/search');
const projectRouter 		= require('./routes/project');
const groupRouter 			= require('./routes/group');
const noteRouter 			= require('./routes/note');
const notificationRouter	= require('./routes/notification');
app.use('/log', logRouter);
app.use('/auth', authRouter);
app.use('/member', memberRouter);
app.use('/search', searchRouter);
app.use('/api_project', projectRouter);
app.use('/api/group', groupRouter);
app.use('/api/note', noteRouter);
app.use('/api/notification', notificationRouter);

// app.listen(port);

// Websocket test
const server = require('http').createServer(app)
const WebSocket = require('ws')
const wss = new WebSocket.Server({ server: server })
const mapConn = new Map();
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
		try {
			const data = JSON.parse(message);
			if(data.type === 'memberId') {
				let memberId = data.memberId;
				if(!mapConn.has(memberId)) {
					mapConn.set(memberId, []);
				}
				mapConn.get(memberId).push(ws);
			}
		}
		catch(error) {'ERROR while websocket connection:', console.error(error);}
    });

	ws.on('message', ()=>{
		try {
			let informedMemberId = 1;
			mapConn.get(informedMemberId).forEach(connectedWs => {
				connectedWs.send(('Add one connection!, current total len: ' + mapConn.get(informedMemberId).length))
			});
		}
		catch(error) {'ERROR while websocket connection:', console.error(error);}
	})

	ws.on('close', ()=>{
		try {
			let informedMemberId = 1;
			const memberConnections = mapConn.get(informedMemberId);
			const connectionIndex = memberConnections.indexOf(ws);
			if(connectionIndex !== -1) {
				memberConnections.splice(connectionIndex, 1);
			}
		}
		catch(error) {'ERROR while websocket connection:', console.error(error);}
	})
})

server.listen(port);