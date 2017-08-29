var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("./server/config/mongoose.js")
var jwt = require('jsonwebtoken');

var app = express();
var router = express.Router();

// Force HTTPS
app.get('*',function(req,res,next){
  if(req.headers['x-forwarded-proto']!='https')
    res.redirect('https://lttctest.herokuapp.com'+req.url)
  else
    next() // Continue to other routes if we're not redirecting
})

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + "/client"));
app.use(express.static(__dirname + '/images')); // all image assets go here

var router = require("./server/config/routes.js")(app);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/register.html');
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

app.set('superSecret', "secrettoken");

// Post, Get, Delete requests
// TEAM
//app.delete('/team/:_id', team.delete); // when DELETE is called to teams provided with an ID we remove the specific team (in reality this would be an update)

app.post('/', function(req, res) {
  res.send("<p>SUCCESS, tips were sent to the server</p>" +
		   "<p> Match 1: " + req.body.match1 + "</p>" +
		   "<p> Match 2: " + req.body.match2 + "</p>" +
		   "<p> Match 3: " + req.body.match3 + "</p>" +
		   "<p> Match 4: " + req.body.match4 + "</p>" +
		   "<p> Match 5: " + req.body.match5 + "</p>" +
		   "<p> Match 6: " + req.body.match6 + "</p>" +
		   "<p> Match 7: " + req.body.match7 + "</p>" +
		   "<p> Match 8: " + req.body.match8 + "</p>" +
		   "<p> Match 9: " + req.body.match9 + "</p>");
});

module.exports = app;
// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express app listening on port 3000');
});
