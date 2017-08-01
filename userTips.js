require('mongoose').model('UserTips');
var mongoose = require('mongoose');
var UserTips = mongoose.model('UserTips');

// This allows us to see all tips by users
// some error handling is done
// if no errors we then run a for loop, logging all records in console.
module.exports = {
  seeTips: function (req, res, next) {
    UserTips.find({}, function (err, docs) {
      if (err) {
        res.status(504);
        res.end(err);
      }
      else {
        for (var i = 0; i < docs.length; i++) {
         console.log('User :', docs[i].userID, ', Team:', docs[i].teamID);
        }
        res.end(JSON.stringify(docs));
      }
    });
  }
}
