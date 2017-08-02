require('mongoose').model('User');
var mongoose = require('mongoose');
var User = mongoose.model('User');

// Here is a method which creates users
// upon successful creation they are saved to the database and a message displayed.
module.exports = {
  createUser: function (req, res) {
    var person = req.body; // gets the body of the request sent to the
                           // method from the front end
    // Make a new user object
    new User({ _id: person.id, password: person.password , email: person.email,
    favouriteTeam: person.favouriteTeam, currentWins: person.currentWins,
    currentLosses: person.currentLosses, currentDraws: person.currentDraws,
    userGroup: person.userGroup, emailOptOut: person.emailOptOut})

    // Save the user to the database
      .save(function (err) {
        if (err) {
          res.status(504);
          res.end(err);
        }
        else {
          console.log('user made & saved to db');
          res.end();
        }
      });
  },
// This method gets ALL users in our databases USER collection (from a query)
// some error handling is done
// if no errors we then run a for loop, logging all records in console.
// so we can see what is being pulled.
  seeUsers: function (req, res, next) {
    User.find({}, function (err, docs) {
      if (err) {
        res.status(504);
        res.end(err);
      }
      else {
        for (var i = 0; i < docs.length; i++) {
         console.log('Name :', docs[i]._id, ', Fav:', docs[i].favouriteTeam);
        }
        res.end(JSON.stringify(docs)); // respond with the content of doc
      }
    });
  }

// A delete method, it's not used currently so you can ignore it.
/*
  delete: function( req, res, next) {
    console.log(req.params.id);
    User.find({ _id: req.params.id}, function(err) {
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
