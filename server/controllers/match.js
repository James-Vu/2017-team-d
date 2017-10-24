// Authors: Andrew Kuzminsy, Luke Lo Presti
// Version: v12
// variables & dependancies
var mongoose = require('mongoose');
var Match = mongoose.model('Match');
var Team = mongoose.model('Team');
var app = require('../../app');

// For the purpose of a sample, we can make matches.
module.exports = {
  createTeams: function (req, res) {
    var match = req.body;
    new Match({ id: match.id, isEliminated: match.isEliminated })
      .save(function (err) {
        if (err) {
          res.status(504);
          res.end(err);
        } else {
          console.log('team saved');
          res.end();
        }
      });
  },
// This allows us to see all matches
// we query the match model and find all
// some error handling is done
// if no errors we then run a for loop, logging all records in console.
  seeMatches: function (req, res, next) {
    var query = req.query;
    Match.find({ roundNo : query.roundNo }, null, { sort: {gameNo: 1}}, function (err, docs) {
      if (err) {
        res.status(504);
        res.end(err);
      } else {
        for (var i = 0; i < docs.length; i++) {
         console.log('Home Team :', docs[i].homeTeamID, ', Away Team:', docs[i].awayTeamID);

        Team.find({ teamID : docs[i].homeTeamID }, function(e, r) {
          if (e) {
            console.log("FAIL");
            res.status(504);
            res.end(e);
          } else {
            console.log("SUCC");
            docs[i].homeTeamName = r.teamName;
          }
        });
        Team.find({ teamID : docs[i].awayTeamID }, function(e, r) {
          if (e) {
            console.log("FAIL");
            res.status(504);
            res.end(e);
          } else {
            console.log(r);
            console.log("SUCC");
            docs[i].awayTeamName = r.teamName;
          }
        });
      }

        console.log("HERE");

        console.log(docs);
        res.end(JSON.stringify(docs));
      }
    });
  },
// This isn't used at all yet.
  delete: function( req, res, next) {
    console.log(req.params.id);
    Match.find({ _id: req.params.id}, function(err) {
      if(err) {
        req.status(504);
        req.end();
        console.log(err);
      }
    }).remove(function (err) {
      console.log(err);
      if (err) {
        res.end(err);
      } else {
        res.end();
      }
    });
  }
}
