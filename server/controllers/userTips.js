var mongoose = require('mongoose');
var UserTips = mongoose.model('UserTips');

module.exports = {
  sendTips: function (req, res) {
    console.log("REQUEST SENT");
    var tips = req.body;
    //var bodyCount = Object.keys(tips).length
    console.log(tips);

    var i = 0; // we use this to skip over the round number at the start of the req.body index 0
    for (var key in req.body) {
      if (req.body.hasOwnProperty(key) && i > 0) {
        var teamName = req.body[key]; // teamNames stored here

        new UserTips({ userID: "TippinTester", roundNo: tips.roundNo, gameNo: i , teamID: teamName})
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
        // end of save
      }
      // end of if statement
      i++;
    }
    // end of for loop

    res.send("<p>SUCCESS, tips were sent to the server</p>" +
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

  },
  // get all userTips
  seeTips: function (req, res, next) {
    UserTips.find({}, function (err, docs) {
      if (err) {
        res.status(504);
        res.end(err);
      } else {
        for (var i = 0; i < docs.length; i++) {
         console.log('User :', docs[i].userID, ', Team:', docs[i].teamID);
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
