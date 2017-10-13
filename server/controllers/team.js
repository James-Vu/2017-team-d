// Authors: Andrew Kuzminsy, Luke Lo Presti
// Version: v12
// variables & dependancies
var mongoose = require('mongoose');
var Team = mongoose.model('Team');

// For the purpose of a sample, we can make new teams.
module.exports = {
  createTeams: function (req, res) {
    var team = req.body;
    new Team({ id: team.id, isEliminated: team.isEliminated })
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
// This allows us to see all teams
// we query the team model and find all
// some error handling is done
// if no errors we then run a for loop, logging all records in console.
  seeTeams: function (req, res, next) {
    Team.find({}, function (err, docs) {
      console.log(req);
      if (err) {
        res.status(504);
        res.end(err);
      } else {
        for (var i = 0; i < docs.length; i++) {
         //console.log('ID:', docs[i].teamID, ', postition:', docs[i].position);
        }
        res.end(JSON.stringify(docs));
      }
    });
  },
// This isn't used at all yet.
  delete: function( req, res, next) {
    console.log(req.params.id);
    Team.find({ _id: req.params.id}, function(err) {
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
