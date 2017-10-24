// Authors: Andrew Kuzminsy, Luke Lo Presti
// Version: v12
// variables & dependancies
var mongoose = require('mongoose');
var UserTips = mongoose.model('UserTips');

module.exports = {
  sendTips: function (req, res) {
    console.log(req.body);
    // array filled with all possible matches in the req.body
    var matchArray = [req.body.match1, req.body.match2, req.body.match3,
      req.body.match4, req.body.match5, req.body.match6,
      req.body.match7, req.body.match8, req.body.match9];
    // array filled with all the possible games in the req.body
    var gameArray = [req.body.game1, req.body.game2, req.body.game3,
      req.body.game4, req.body.game5, req.body.game6,
      req.body.game7, req.body.game8, req.body.game9];

      // runs for each match in the match array (up to a maximum of 9 times)
      for (var i = 0; i < matchArray.length; i++) {
        // if the array isn't empty proceed
        if (matchArray[i] != undefined) {
          // assign the teamName that was tipped by the user in the match
          var teamName = matchArray[i];
          // assing the gameNo that was tipped on by the user in the match
          var gameNo = gameArray[i];
          // create a new UserTips object with the information provided by the post request body
          // saving the tip (UserTip) to the database.
          var userTip = UserTips({ username: req.body.username, roundNo: req.body.roundNo, gameNo: gameNo, teamID: teamName})
          UserTips.findOne({ username: req.body.username, roundNo: req.body.roundNo, gameNo: gameNo }, function(err, doc) {
            if(err) { return handleError(err); }
            else if(doc == null) {
              userTip.save(function (err) {
                if (err) {
                  res.status(504);
                  res.end(err);
                }
                else {
                  console.log('tip saved');
                  res.end();
                }
              });
            }
            else {
              userTips.update({_id: doc._id}, { teamID: teamName }, function (err, res) {

              });
            }
          });
/*
          .save(function (err) {
            if (err) {
              res.status(504);
              res.end(err);
            }
            else {
              console.log('tip saved');
              res.end();
            }
          });
*/
        }

      }
      // Print out the entire contents of the post request body
      /*
    res.send("<p>SUCCESS, tips were sent to the server</p>" +
         "<p> username: " + req.body.username + "</p>" +
         "<p> Round #: " + req.body.roundNo + "</p>" +
         "<p> Match 1: " + req.body.match1 + "</p>" +
         "<p> Match 2: " + req.body.match2 + "</p>" +
         "<p> Match 3: " + req.body.match3 + "</p>" +
         "<p> Match 4: " + req.body.match4 + "</p>" +
         "<p> Match 5: " + req.body.match5 + "</p>" +
         "<p> Match 6: " + req.body.match6 + "</p>" +
         "<p> Match 7: " + req.body.match7 + "</p>" +
         "<p> Match 8: " + req.body.match8 + "</p>" +
         "<p> Match 9: " + req.body.match9 + "</p>");
         */
    // redirect the tipper to the tippingSubmit page.
    res.redirect("tippingSubmit.html")

  },
  // get all userTips
  seeTips: function (req, res, next) {
    UserTips.find({}, null, { sort: {username: 1, roundNo: 1, gameNo: 1}}, function (err, docs) {
      if (err) {
        res.status(504);
        res.end(err);
      } else {
        for (var i = 0; i < docs.length; i++) {
         //console.log('User :', docs[i].userID, ', Team:', docs[i].teamID);
        }
        res.end(JSON.stringify(docs));
      }
    });
  },
// Use this to delete buggy tips, not really needed
  delete: function( req, res, next) {
    console.log(req.params.id);
    UserTips.find({ userID: undefined}, function(err) {
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
