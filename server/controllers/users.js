var mongoose = require("mongoose");
var User = mongoose.model("User");
var jwt = require('jsonwebtoken');
var app = require('../../app');
var express 	= require('express');
var exp = express();


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
          res.end(JSON.stringify(docs));
        }
      });
    },
  }
}();
