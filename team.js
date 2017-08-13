// Heres where things get messy
// We're defining all of our functions that we can perform with ---> users <---
// You could split up teams, matches etc into seperate .js files

require('mongoose').model('Team');
var mongoose = require('mongoose');
var Team = mongoose.model('Team');

// For the purpose of a sample, we can make users.
module.exports = {
  createTeams: function (req, res) {
    var person = req.body;
    new Team({ id: person.id, isEliminated: person.isEliminated })
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
// parameters = request, response, next(unsure about this one)
// we query the team model and find all
// some error handling is done
// if no errors we then run a for loop, logging all records in console.
  seeTeams: function (req, res, next) {
    Team.find({}, function (err, docs) {
      if (err) {
        res.status(504);
        res.end(err);
      } else {
        for (var i = 0; i < docs.length; i++) {
         console.log('ID:', docs[i]._id, ', isEliminated:', docs[i].position);
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
