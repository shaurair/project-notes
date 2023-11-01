const express = require('express');
const app = express();
const port = 4000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get("/", (req, res) => {
	res.render('index');
})
app.get("/log", (req, res) => {
	res.render('log');
})
app.get("/projects", (req, res) => {
	res.render('projects');
})
app.get("/personal", (req, res) => {
	res.render('personal');
})
app.get("/member", (req, res) => {
	res.render('member');
})

app.listen(port);