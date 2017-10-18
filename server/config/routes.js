// Authors: Andrew Kuzminsy, Luke Lo Presti
// Version: v12
// variables, dependancies & package dependancies
var users = require('./../controllers/users.js');
var match = require('./../controllers/match.js');
var team = require('./../controllers/team.js');
var userTips = require('./../controllers/userTips.js');
var email = require('./../controllers/email.js');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var app = express();
var path = require('path');

require("./passport.js")(passport);
// expose our routes to the entire server,
// so NodeJS & Express know what to do when we encounter a particular request to a url
module.exports = function(app, passport){
  console.log('routes imported');

  app.get('/tippingUser', function(req, res){
    console.log("ROUTING: " + req.user.username);
    console.log("email: " + req.user.email)
    res.send(req.user);
  });

  app.post('/users', users.create);

  // show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});
  // process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/tipping.html', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash: true
	}));
  app.post('/userTips', userTips.sendTips);

  // Data Pulling Routes (PROTECTED)
  app.get('/users', isLoggedIn, users.seeUsers); // when GET is called to user, retrieve all users
  app.get('/match', isLoggedIn, match.seeMatches); // when GET is called to match, we retrieve ALL matches
  app.get('/userTips', isLoggedIn, userTips.seeTips); // when GET is called to userTips, retrieve all tips
  app.get('/team', isLoggedIn, team.seeTeams); // when GET is called to team, we retrieve ALL teams
  app.post('/email', email.sendBroadcast); // when POST is called to email, we send an Email
  app.post('/emailAll', email.sendEmail);
  // Logout
	app.get('/logout', function(req, res) {
    var username = req.user.username;
    req.logout();
		res.redirect('/');
    console.log("LOGGING OUT " + username);
	});
}
// check if the request is authenticated.
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	// if they arent logged in / authenticated redirect them to the home page
	res.redirect('/');
}
router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});

router.get('/tipping', function(req, res) {
  res.sendFile('tipping.html');
});
