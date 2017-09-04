var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("./server/config/mongoose.js");
var jwt = require('jsonwebtoken');

var app = express();
var router = express.Router();

/*
// Force HTTPS
app.get('*',function(req,res,next){
  if(req.headers['x-forwarded-proto']!='https')
    res.redirect('https://lttc.herokuapp.com'+req.url)
  else
    next() // Continue to other routes if we're not redirecting
})
// Keep the Dyno Awake
var https = require("https");
setInterval(function() {
    https.get("https://lttc.herokuapp.com");
    console.log("#### PINGING THE SERVER EVERY 20 MINUTES ####");
}, 1200000); // every 20 minutes (1200000)
*/

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/client"));
app.use(express.static(__dirname + '/images')); // all image assets go here

var router = require("./server/config/routes.js")(app);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/login.html');
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

app.set('superSecret', "secrettoken");

// Post, Get, Delete requests
// TEAM
//app.delete('/team/:_id', team.delete); // when DELETE is called to teams provided with an ID we remove the specific team (in reality this would be an update)

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


// pulls data about matches

var season = 2017;
var roundNo = 1;
var currentRoundNo = 24;


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
            gameNo: gameNo++,
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
          var match = new Match(match_data);
          Match.findOne({ roundNo: match.roundNo, gameNo: match.gameNo }, function(error, match) {
            if(error){
              console.log(error);
            }
            else if(match == null){
              console.log('no such match');
              match.save( function(error, data) {
                if(error) {
                  //res.json(error);
                }
                else{
                  //res.json(_data);
                }
              });
            }
            else{
              Match.update({ roundNo: match.roundNo, gameNo: match.gameNo }, { $set: match_data }, callback);

              function callback (err, numAffected) {
                //console.log(numAffected);
              }
            }
          })
          game = $(game).next();
        }
      });
    }
    roundNo++;
    next();
  })

},
function (err) {

});

module.exports = app;
// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express app listening on port 3000');
});
