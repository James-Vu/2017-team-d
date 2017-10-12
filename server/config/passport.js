// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
// load up the user model
var User = require('./../models/userModel.js');

module.exports = function(passport) {
  // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'username' :  username }, function(err, data) {
          // if there are any errors, return the error before anything else
          if(err) throw error;

          if(data == null){
            return done(null, false, {message: 'Invalid Username or Password' });
          }
            // if the user is found but the password is wrong
            if (!data.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, data);
            res.send(username);
        });

    }));
}
