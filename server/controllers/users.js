var mongoose = require("mongoose");
var User = mongoose.model("User");
var jwt = require('jsonwebtoken');
var app = require('../../app');

module.exports = function(){
  console.log("users controller loaded up");
  return {
    create: function(req, res){
      console.log(req.body);
      var newUser = new User(req.body);
      newUser.save(function(err, data){
        if(err){
          console.log(err);
          res.status(422);
          res.json(err);
        }
        else if(data && req.body.email != req.body.emailConf){
          res.status(422);
          res.json( {data:
                      {errors:
                        {email:
                          {message: "Email Addresses do not match"}}}});
        }
        else{
          console.log(data);
          res.json(data);
        }
      })
    },
    seeUsers: function (req, res, next) {
      User.find({}, function (err, docs) {
        if (err) {
          res.status(504);
          res.end(err);
        } else {
          for (var i = 0; i < docs.length; i++) {
           console.log('Name :', docs[i]._id, ', Fav:', docs[i].favouriteteam);
          }
          res.end(JSON.stringify(docs));
        }
      });
    },
    login: function(req, res){
      console.log(req.body);
      var user = User.findOne({username: req.body.username}, function(err, data){
        if(data == null){
          res.status(422);
          res.json( {data:
                      {errors:
                        {login:
                          {message: "Invalid Username or Password"}}}});
        }
        else if(data && data.validPassword(req.body.password)){
          console.log(data);

          var token = {
            expiresInMinutes: 1440
          };

          res.json({
            success: true,
            _id: data._id,
            token: token
          });
        }
        else{
          res.status(422);
          res.json( {data:
                      {errors:
                        {login:
                          {message: "Invalid Username or Password"}}}});
        }
      });
    }
  }
}();
