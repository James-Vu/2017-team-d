require('mongoose').model('Team');
var mongoose = require('mongoose');
var Team = mongoose.model('Team');

// This allows us to see all Teams
// we query the team model and find all
// some error handling is done
// if no errors we then run a for loop, logging all records in console.
module.exports = {
  seeTeams: function (req, res, next) {
    Team.find({}, function (err, docs) {
      if (err) {
        res.status(504);
        res.end(err);
      }
      else {
        for (var i = 0; i < docs.length; i++) {
         console.log('ID:', docs[i]._id, ', isEliminated:', docs[i].position);
        }
        res.end(JSON.stringify(docs));
      }
    });
  }
}
