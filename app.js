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

const server 		= require('http').createServer(app);

// ----------------- //
// websocket         //
// ----------------- //
// const websocket 	= require('./utilities/websocket');
// websocket.setServer(server);

// ----------------- //
// socket io         //
// ----------------- //
const socketIo 	= require('./utilities/socket-io.js');
socketIo.setSocket(server);

server.listen(port);