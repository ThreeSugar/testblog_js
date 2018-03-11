var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()){
    res.render('blog/dashboard');
  } else {
    res.redirect('login');
  }

});

module.exports = router;