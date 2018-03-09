var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	req.logout();
	req.flash('logout', 'Successfully logged out!');
	res.redirect('/login');
});

module.exports = router;