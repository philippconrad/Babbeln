var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var User             = require('../models/user');
var session          = require('express-session');
var jwt              = require('jsonwebtoken');
var secret           = 'babbelnweb';

module.exports = function(app, passport){

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(session({secret: 'keyboard cat', resave: false, saveUnitialized: true, cookie: {secure: false}}));

  passport.serializeUser(function(user, done){
    token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn : '24h'});
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    });
  });

  passport.use(new FacebookStrategy({
    clientID: '1394184257270992',
    clientSecret: '6f6bc317bfa28e98bf0fc1141a5bdade',
    callbackURL: "http://localhost:8000/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({email: profile._json.email}).select('username password email').exec(function(err, user){
        if (err) done(err);

        if (user && user != null){
          done(null, user);
        } else {
          done(err);
        }
      });
    }
  ));


  passport.use(new TwitterStrategy({
      consumerKey: 'yqK4ZwpusKzP8YgoZYiSXGMCZ',
      consumerSecret: 'j5Ew8j7bfyP2BhL8ZLA92MX6s9tUc0818bUQ7PIsSOZeXQJ1uN',
      callbackURL: "http://localhost:8000/auth/twitter/callback",
      userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"
    },
    function(token, tokenSecret, profile, done) {
      User.findOne({email: profile.emails[0].value}).select('username password email').exec(function(err, user){
        if (err) done(err);

        if (user && user != null){
          done(null, user);
        } else {
          done(err);
        }
      });
    }
  ));

  passport.use(new GoogleStrategy({
      clientID: '188271088712-vvnsf8hlkag2laanllbjcgjv43m1vvhq.apps.googleusercontent.com',
      clientSecret: '0ih2aIC13W40hkf7ASZRhxyN',
      callbackURL: "http://localhost:8000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({email: profile.emails[0].value}).select('username password email').exec(function(err, user){
        if (err) done(err);

        if (user && user != null){
          done(null, user);
        } else {
          done(err);
        }
      });
    }
  ));

  app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

  app.get('/auth/twitter', passport.authenticate('twitter'));

  app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'profile', 'email'] }));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {failureRedirect: '/facebookerror'}), function(req, res){
    res.redirect('/facebook/' + token);
  });

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {failureRedirect: '/twittererror' }), function(req, res){
    res.redirect('/twitter/' + token);
  });

  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/googleerror' }), function(req, res) {
    res.redirect('/google/' + token);
  });

  return passport;
}
