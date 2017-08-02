// In this file we pretty much lay out how our app responds to requests / parses them
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var app = express();

var db = require('./db'); // getting info from db.js
var match = require('./match'); // getting info from match.js
var team = require('./team'); // getting info from team.js
var user = require('./user'); // getting info from user.js
var userTips = require('./userTips'); // getting info from userTips.js

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/tipping.html');
});

var url = "http://afltables.com/afl/seas/2017.html";
require('mongoose').model('Team');
var Team = mongoose.model('Team');

// Cheerio stuff starts
request(url, function(err, response, html) {
	var $ = cheerio.load(html);

	$('table.sortable tbody tr').each(function() {
		var children = $(this).children();

		var teamName = $(children[1]).text().trim();
		if(teamName == 'Brisbane Lions') {
			teamName = 'Brisbane';
		}
		var row = {
			"position" : $(children[0]).text().trim(),
			"gamesPlayed" : $(children[2]).text().trim(),
			"gamesWon" : $(children[3]).text().trim(),
			"gamesDrawed" : $(children[4]).text().trim(),
			"gamesLost" : $(children[5]).text().trim(),
			"percentage" : $(children[12]).text().trim(),
			"points" : $(children[13]).text().trim(),
			"isEliminated" : 'false'
		};

		if(row.gamesWon == '') {
			row.gamesWon = '0';
		}

		if(row.gamesDrawed == '') {
			row.gamesDrawed = '0';
		}

		if(row.gamesLost == '') {
			row.gamesLost = '0';
		}

		Team.update({ _id: teamName }, { $set: row }, callback);

		function callback (err, numAffected) {

		}
	});
})
// Cheerio stuff ended
var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gunblademate@gmail.com',
    pass: 'disablednotmyrealpasswordforreasons'
  },
  tls: {
    rejectUnauthorized: false
   }
});
let HelperOptions = {
  form: '"Andrew Kuzminsky" <gunblademate@gmail.com',
  to: 'kuzminskyandrew@gmail.com',
  subject: 'Hello, world!',
  text: 'EHJHJHHHHH!'
};
transporter.sendMail(HelperOptions, (error, info) => {
  if(error) {
    return console.log(error);
  }
  console.log("message was sent! " + info);
});

// Post, Get, Delete
// MATCH
app.get('/match', match.seeMatches); // when GET is called to team, we retrieve ALL teams
// USER
app.post('/user', user.createUser); // when POST is passed to the user.js file, we create a user.
app.get('/user', user.seeUsers); // when GET is called to user, retrieve all users
// USERTIPS
app.get('/userTips', userTips.seeTips); // when GET is called to userTips, retrieve all tips
// TEAM
app.get('/team', team.seeTeams); // when GET is called to team, we retrieve ALL teams

// Start our server on whatever port heroku wants or port 3000
// Cloud solution
app.listen(process.env.PORT || 3000, function () {
  console.log('App.js LOADED');
});
// Localhost solution
//app.listen(3000, function() {
//  console.log('STARTED ON LOCALHOST PORT 3000')
//})
