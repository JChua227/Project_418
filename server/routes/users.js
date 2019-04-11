const serverInfo = require('./../server.js');
const express = require('express');
const mysql = require('mysql');
const router = express.Router();
const bodyParser = require('body-parser');
const session = serverInfo.session;

router.use(bodyParser.json());
router.use(
	bodyParser.urlencoded({
		extended: true
	})
);

// DATABASE SETUP
var db = serverInfo.db;

router.use(bodyParser.json());
router.use(
	bodyParser.urlencoded({
		extended: true
	})
);

router.get('/login', (req, res) => {
	console.log(req.session.userId);
	if (req.session.userId != undefined)
		res.render('adminAddQuestions');
	else
		res.render('loginPage'); // to access this page go to /users/login
});

router.get("/register", (req, res) => {
	if (req.session.userId != undefined)
		res.redirect('adminAddQuestions');
	else
		res.render("registerPage");
});

router.post('/registers', (req, res) => {
	//res.render("registerPage"); // to access this page go to /users/register
	var username = req.body.username;
	console.log(username);
	res.end(JSON.stringify(req.body));
});

router.get('/about', (req, res) => {
	console.log(req.session);
	res.render('aboutPage');
});

router.post('/sublogin', (req, res) => {
	let userName = req.body.username;
	let passWord = req.body.password;
	let sqlQuery = 'SELECT * FROM userprofile WHERE Name="' + userName + '";';
	db.query(sqlQuery, (error, result) => {
		if (error) console.log(error);
		else {
			if (result.length == 0) {
				// User doesn't exist
				let errorMsg = "We don't recognize that username. Please register";
				res.render('loginPage', {
					errorMsg
				});
			} else {
				for (let i = 0; i < result.length; i++) {
					if (passWord == result[i].Password) {
						req.session.userId = result[i].UserProfileId;
						console.log(req.session);
						return res.render('adminAddQuestions'); //TO FIX WITH PROPER ROUTE
					}
				}

				let errorMsg = "We don't recognize that password. Please try again";
				res.render('loginPage', {
					errorMsg
				});
			}
		}
	});
});


//is this where it goes?
router.get('/QuizPage', (req, res) => {
	db.query("SELECT * FROM question JOIN choices on question.questionid=choices.questionid;",(request,results,error) => {
		if(error) console.log(error);
		res.render("QuizPage",{
			results: results
		})
	})
});

module.exports = router;