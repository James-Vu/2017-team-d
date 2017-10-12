var mongoose = require('mongoose');
var UserTips = mongoose.model('UserTips');

module.exports = {
  sendTips: function (req, res) {
    //var bodyCount = Object.keys(tips).length
    var matchArray = [req.body.match1, req.body.match2, req.body.match3,
      req.body.match4, req.body.match5, req.body.match6,
      req.body.match7, req.body.match8, req.body.match9];

    var gameArray = [req.body.game1, req.body.game2, req.body.game3,
      req.body.game4, req.body.game5, req.body.game6,
      req.body.game7, req.body.game8, req.body.game9];

      for (var i = 0; i < matchArray.length; i++) {
        if (matchArray[i] != undefined) {
          var teamName = matchArray[i];
          var gameNo = gameArray[i];
          new UserTips({ userID: req.body.username, roundNo: req.body.roundNo, gameNo: gameNo , teamID: teamName})
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

        }

      }
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
    res.redirect("tippingSubmit.html")

  },
  // get all userTips
  seeTips: function (req, res, next) {
    UserTips.find({}, function (err, docs) {
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
