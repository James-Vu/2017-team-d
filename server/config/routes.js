var users = require('./../controllers/users.js');
var match = require('./../controllers/match.js');
var team = require('./../controllers/team.js');
var userTips = require('./../controllers/userTips.js');
var email = require('./../controllers/email.js');
var express = require('express');
var router = express.Router();

module.exports = function(app){
  console.log('routes imported');

  app.post('/users', users.create);
  app.post('/login', users.login);
  app.post('/userTips', userTips.sendTips);

  // Data Pulling Routes
  app.get('/users', users.seeUsers); // when GET is called to user, retrieve all users
  app.get('/match', match.seeMatches); // when GET is called to match, we retrieve ALL matches
  app.get('/userTips', userTips.seeTips); // when GET is called to userTips, retrieve all tips
  app.get('/team', team.seeTeams); // when GET is called to team, we retrieve ALL teams
  // Post Email Route
  app.post('/email', email.sendEmail); // when POST is called to email, we send an Email
}

router.post('/login', function(req, res) {
  if(req.success) {
    res.redirect("tipping.html");
  }
});

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
