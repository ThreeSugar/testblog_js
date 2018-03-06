var express = require('express');
var router = express.Router();
var User = require('../models/users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login');
});

passport.use(new LocalStrategy(
  {usernameField: 'email'},
  function(username, password, done) {
    User.findOne({email:username}, function(err, user){
      if(err) {
        console.log(err);
      }
      if(!user){
        console.log('no user');
        return done(null, false, {message: 'Unknown User'});
      }

      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) {
          console.log(err);
        }
        if(isMatch){
          console.log('password match');
          return done(null, user);
        } else {
          console.log('password invaild');
          return done(null, false, {message: 'Invalid password'});
        }
      });
    });    
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});


router.post('/',  passport.authenticate('local', {failureRedirect:'/login', failureFlash: true}),
  function(req, res) {

  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('password', 'Password is required').notEmpty();

  var errors = req.validationErrors();

	if(errors) {
    console.log(errors);
		res.render('login', {
			errors:errors
		});
  } 

  else {
    res.redirect('/');
  }
});
  


module.exports = router;