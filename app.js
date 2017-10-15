// Authors: Andrew Kuzminsy, Luke Lo Presti
// Version: v12
// Package Dependancies & Variables
var express = require("express");
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require("body-parser");
var mongoose = require("./server/config/mongoose.js");
var jwt = require('jsonwebtoken');
var morgan = require('morgan');
var app = express();
var router = express.Router();


// Force HTTPS
app.get('*',function(req,res,next){
  if(req.headers['x-forwarded-proto']!='https')
  res.redirect('https://lttc.herokuapp.com'+req.url)
  else
  next() // Continue to other routes if we're not redirecting
})
// Keep the Heroku Dyno Awake
var https = require("https");
setInterval(function() {
  https.get("https://lttc.herokuapp.com");
  console.log("#### PINGING THE SERVER EVERY 20 MINUTES ####");
}, 1200000); // every 20 minutes (1200000)

// Server port
var port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// Static Directories
app.use(express.static(__dirname + "/client"));
app.use(express.static(__dirname + '/images')); // all image assets go here

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport session initialization
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
    , root    = namespace.shift()
    , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Tell the server where all our routes are & where to go when the server starts
var router = require("./server/config/routes.js")(app, passport);
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/login.html');
});


// data pulling
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

// pulls data about teams
var url = "http://www.afl.com.au/ladder";
require('mongoose').model('Team');
var Team = mongoose.model('Team');

request(url, function(error, response, html) {
  if (!error && response.statusCode == 200) {
    var $ = cheerio.load(html);
    $('table#ladder-table.ladder.zebra tbody tr').each(function(i, element){
      var children = $(this).children();

      var position = $(children[0]).text().trim();
      if(position != "") {
        var team = $(children[1]).text().trim();
        var teamID = team.split(/\s+/g)[0].trim();
        var teamName = team.replace(teamID, '').replace(teamID, '').trim();
        var gamesPlayed = $(children[3]).text().trim();
        var gamesWon = $(children[4]).text().trim();
        var gamesLost = $(children[5]).text().trim();
        var gamesDrawn = $(children[6]).text().trim();
        var pointsFor = $(children[7]).text().trim();
        var pointsAgainst = $(children[8]).text().trim();
        var percentage = $(children[9]).text().trim();
        var points = $(children[12]).text().trim();
        var eliminated = false;

        var team = {
          teamID: teamID,
          teamName: teamName,
          position: parseInt(position),
          gamesPlayed: parseInt(gamesPlayed),
          gamesWon: parseInt(gamesWon),
          gamesLost: parseInt(gamesLost),
          gamesDrawn: parseInt(gamesDrawn),
          pointsFor: parseInt(pointsFor),
          pointsAgainst: parseInt(pointsAgainst),
          percentage: parseInt(percentage),
          points: parseInt(points),
          isEliminated: eliminated
        };
        //console.log(team);
        Team.update({ teamID: teamID }, { $set: team }, callback);

        function callback (err, numAffected) {
          //console.log(numAffected);
        }
      }
    });
  }
})

// load odds data from excel spreadsheet
var XLSX = require('xlsx');
var workbook = XLSX.readFile('afl.xlsx');
var sheet_name_list = workbook.SheetNames;
var odds = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
var matchOdds = [];

for(var i = 0, len = odds.length; i < len; i++) {
  if(odds[i].Date.substring(7,9) >= 17) {
    matchOdds.push(odds[i]);
  }
}


// pulls data about matches
var season = 2017;
var roundNo = 1;
var currentRoundNo = 2;
var matchesToSave = [];

require('mongoose').model('Match');
var Match = mongoose.model('Match');
async = require('async');

async.whilst(function() {
  return roundNo <= currentRoundNo;
},
function (next) {
  var url = "http://www.afl.com.au/fixture?roundId=CD_R2017014" + ((roundNo < 10) ? + "0" : "") + roundNo + "#tround";
  console.log(url);

  request(url, function(error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var gameNo = 1;
      $('#tround table.fancy-zebra.fixture tbody tr th').each(function(i, element){
        //DATE NEEDS TO BE FIXED

        var date = $(this).text();
        var game = $(this).parent().next();
        var dsplit = date.split(',')[1].trim();
        var dsplit = dsplit.split(' ')[0] + " " + parseInt(dsplit.split(' ')[1]);
        console.log(dsplit);

        while(typeof $(game).children().first()[0] != "undefined" && $(game).children().first().prop("tagName") == "TD") {
          var homeTeam = $(game).find('.match .team-logos .home').text();
          var awayTeam = $(game).find('.match .team-logos .away').text();
          var homeScore = $(game).find('.match .team-names .home .score').text();
          var awayScore = $(game).find('.match .team-names .away .score').text();
          var time = $(game).find('.venue-time .time').text();
          var location = $(game).find('.venue-time .venue').text();

          if(time.indexOf('PM') != -1) {
            time = time.replace('PM', '');
            time = (parseInt(time.split(':')[0]) + 12) + ":" + time.split(':')[1] + ":00 GMT+1000 (Melbourne Time)";
          }
          var dateString = dsplit + " " + season + " " + time;
          var d = new Date(dateString);
          // another way could be useful
          //var homeScore = $(game).find('.match .team-names .home .score').text();

          var match_data = {
            roundNo: roundNo,
            gameNo: gameNo,
            matchDate: d,
            matchLocation: location,
            homeTeamID: homeTeam,
            awayTeamID: awayTeam,
            homeScore: homeScore,
            awayScore: awayScore,
            homeOdds: -1,
            awayOdds: -1
          };

          //console.log(match);
          matchesToSave.push(match_data);


          gameNo++;
          game = $(game).next();

        }
      });
    }
    if(roundNo < currentRoundNo){
      roundNo++;
      next();
    }
    else {
      async.eachSeries(matchesToSave, function(m, callback) {
        //console.log(m);
        if(m != null) {
          for(var i = 0, len = matchOdds.length; i < len; i++) {
            //console.log(matchOdds[i]);
            if(matchOdds[i]['Home Team'].charAt(0) == m.homeTeamID.charAt(0) &&
				matchOdds[i]['Away Team'].charAt(0) == m.awayTeamID.charAt(0) &&
				matchOdds[i].Venue.charAt(0) == m.matchLocation.charAt(0) &&
				matchOdds[i].used != true) {
              m.homeOdds = matchOdds[i]['Home Odds'];
              m.awayOdds = matchOdds[i]['Away Odds'];
              matchOdds.used = true;
            }
          }
        }
		
		// if match exists, update it, otherwise save it to the database
        Match.findOne({ roundNo: m.roundNo, gameNo: m.gameNo}, function(err, doc){
          if(err) {
            return handleError(err);
          }
          else if(doc == null) {
            var match = new Match(m);
            match.save(function (err) {
              if (err) return handleError(err);
            });
          }
          else {
            Match.update({_id: doc._id}, m, function (err, res) {
              console.log(err);
              console.log(res);
            });
          }
        });
        callback();
      });
    }

  })
},
function (err) {

});

// exposes app contents to the entire server
module.exports = app;
// listen on port 3000
app.listen(port);
console.log('Express app listening on http://localhost:' + port);
