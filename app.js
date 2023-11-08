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
	res.render('create-project');
})

// ----------------- //
// routes            //
// ----------------- //
const logRouter = require('./routes/log');
const authRouter = require('./routes/auth');
const memberRouter = require('./routes/member');
app.use('/log', logRouter);
app.use('/auth', authRouter);
app.use('/member', memberRouter);

app.listen(port);