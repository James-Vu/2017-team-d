// Authors: Andrew Kuzminsy, Luke Lo Presti
// Version: v12
// variables & dependancies
var mongoose = require("mongoose");
var User = mongoose.model("User");
var jwt = require('jsonwebtoken');
var app = require('../../app');
var express 	= require('express');
var exp = express();

// expose this function to the entire server
module.exports = function(){
  console.log("users controller loaded up");
  return {
    // REGISTER
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
    // Get all users in the database.
    seeUsers: function (req, res, next) {
      User.find({}, function (err, docs) {
        if (err) {
          res.status(504);
          res.end(err);
        } else {
          res.end(JSON.stringify(docs));
        }
      });
    },
  }
}();
