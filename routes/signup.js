var express = require('express');
var router = express.Router();
var User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('signup');
});

router.post('/', function(req, res, next) {
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
  
  var errors = req.validationErrors();

	if(errors) {
    console.log(errors);
		res.render('signup', {
			errors:errors
		});
  } 

  else {
    var newUser = new User({
			email: email,
			username: username,
			password: password
    });

    User.findOne({"$or" : [{'email': newUser.email}, {'username': newUser.username}]}).exec(
      function(err, user){
        if(user){
          res.render('signup', {message:'Email or Username already exist!'});
        } else {
          User.createUser(newUser, function(err){
            console.log(err);
          });
          res.redirect('/login')
        }
      });
  }

});

module.exports = router;