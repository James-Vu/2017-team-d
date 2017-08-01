require('mongoose').model('Match');
var mongoose = require('mongoose');
var Match = mongoose.model('Match');

// This allows us to see everything in the Match Collection
// some error handling is done
// if no errors we then run a for loop, logging stuff in console.
module.exports = {
  seeMatches: function(req, res, next) {
    Match.find({ roundNo : 1 }, function (err, docs) {
      if (err) {
        res.status(504);
        res.end(err);
      } else {
        for (var i = 0; i < docs.length; i++) {
         console.log('Home Team :', docs[i].homeTeam, ', Away Team:', docs[i].awayTeam);
        }
        res.end(JSON.stringify(docs));
      }
    });
  }

// This isn't used at all yet.
/*
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
*/
}
