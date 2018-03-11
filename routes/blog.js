var express = require('express');
var router = express.Router();
var Article = require('../models/blog');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()){
    res.render('blog/dashboard');
  } else {
    res.redirect('../login');
  }

});

router.get('/submit', function(req, res, next){
  if(req.isAuthenticated()){
    res.render('blog/submit');
  } else {
    res.redirect('../login');
  }
})

router.post('/submit', function(req, res, next){
  var title = req.body.title;
  var summary = req.body.summary;
  var content = req.body.content;

  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('summary', 'Summary is required').notEmpty();
  req.checkBody('content', 'Content is required').notEmpty();

  var errors = req.validationErrors();

	if(errors) {
		res.render('blog/submit', {
			errors:errors
		});
  } 

  else {
    var newArticle = new Article({
			title: title,
			summary: summary,
      content: content,
      author: req.user.username,
    });

    newArticle.save(function (err) {
        if (err) throw err;
      })
      res.redirect('../');
  }

})

module.exports = router;