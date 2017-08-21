// App.js launches with our server, and handles packages & requests.
// it is the heart of our application

// Requiring Packages
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

// Our own JS files
var db = require('./db'); // loading db.js
var match = require('./match'); // loading match.js
var team = require('./team'); // loading team.js
var user = require('./user'); // loading user.js
var userTips = require('./userTips'); // loading userTips.js

// Force HTTPS
app.get('*',function(req,res,next){
  if(req.headers['x-forwarded-proto']!='https')
    res.redirect('https://lttc.herokuapp.com'+req.url)
  else
    next() /* Continue to other routes if we're not redirecting */
})

// Feed our webserver a page to display when it starts (This is the homepage)
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/web/tipping.html');
});

// Directories
app.use(express.static(__dirname + '/images')); // all image assets go here
app.use(express.static(__dirname + '/web')); // all html & angularJS assets go here

//var user = "user1";
//var pass = "test";
var User = mongoose.model('User');
var query = User.findOne({ '_id': 'user1' });

// selecting the `name` and `occupation` fields
query.select('_id password');

// execute the query at a later time
query.exec(function (err, user) {
	if(user !== null) {
		if (err) return handleError(err);
		console.log('%s %s', user._id, user.password)
		app.get('/', function (req, res) {
		res.sendFile(__dirname + '/tipping.html');
		});
	}
	else {
		app.get('/', function (req, res) {
		res.sendFile(__dirname + '/login.html');
		});
	}
})


// Web scrapping with cheerio can probably be moved to Team.js
var url = "http://afltables.com/afl/seas/2017.html";
require('mongoose').model('Team');
var Team = mongoose.model('Team');

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

// Post, Get, Delete requests
// MATCH
app.post('/match', match.createTeams); // when POST is called to team, we create a team
app.get('/match', match.seeMatches); // when GET is called to team, we retrieve ALL teams
app.delete('/match/:_id', match.delete); // when DELETE is called
// USER
app.get('/user', user.seeUsers); // when GET is called to user, retrieve all users
// USERTIPS
app.get('/userTips', userTips.seeTips); // when GET is called to userTips, retrieve all tips
// TEAM
app.post('/team', team.createTeams); // when POST is called to team, we create a team
app.get('/team', team.seeTeams); // when GET is called to team, we retrieve ALL teams
app.delete('/team/:_id', team.delete); // when DELETE is called to teams provided with an ID we remove the specific team (in reality this would be an update)

// Research into these
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.bodyParser());

app.post('/', function(req, res) {
  res.send("<p>SUCCESS, tips were sent to the server</p>" +
		   "<p> Match 1: " + req.body.match1 + "</p>" +
		   "<p> Match 2: " + req.body.match2 + "</p>" +
		   "<p> Match 3: " + req.body.match3 + "</p>" +
		   "<p> Match 4: " + req.body.match4 + "</p>" +
		   "<p> Match 5: " + req.body.match5 + "</p>" +
		   "<p> Match 6: " + req.body.match6 + "</p>" +
		   "<p> Match 7: " + req.body.match7 + "</p>" +
		   "<p> Match 8: " + req.body.match8 + "</p>" +
		   "<p> Match 9: " + req.body.match9 + "</p>");
});

//app.get('/team', team.seeTeams);
// Start our server on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});
//localhost
/*
app.listen(3000, function() {
	console.log('STARTED ON LOCALHOST PORT 3000')
});
*/
