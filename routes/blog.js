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

router.get('/view', function(req, res, next){
  if(req.isAuthenticated()){
    res.render('view');
  } else {
    res.redirect('../login');
  }
})

router.get('/submit', function(req, res, next){
  if(req.isAuthenticated()){
    res.render('blog/submit');
  } else {
    res.redirect('../login');
  }
})

router.get('/edit', function(req, res, next){
  if(req.isAuthenticated()){
    Article.find({'author': req.user.username}, function(err, article){
      if(err) throw err;
      if(article){
        res.render('blog/edit', {article:article})
      } else {
        res.render('blog/edit');
      }
    })
  }
  else {
    res.redirect('../login');
  }
})

//order matters, those GET routes with params should be placed last?

router.get('/:id', function(req, res, next) {
  var blog_id = req.params.id;
  Article.findById(blog_id, function(err, article){
    if (err) throw err;
    if (article) {
      res.render('view', {article:article});
    }
  })
});

router.get('/edit/:id', function(req, res, next) {
  var blog_id = req.params.id;
  Article.findById(blog_id, function(err, article){
    if (err) throw err;
    if (article) {
      res.render('blog/update', {article:article});
    }
  })
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

router.post('/edit/:id', function(req, res, next) {
  var blog_id = req.params.id;

  var title = req.body.title;
  var summary = req.body.summary;
  var content = req.body.content;

  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('summary', 'Summary is required').notEmpty();
  req.checkBody('content', 'Content is required').notEmpty();

  var errors = req.validationErrors();

	if(errors) {
    Article.findById(blog_id, function(err, article){
      if (err) throw err;
      if(article){
        res.render('blog/update', {
          errors:errors, article: article
        });
      }
    })
  } 

  else {
    Article.findById(blog_id, function(err, article){
      if (err) throw err;
      if (article) {
        article.title = title;
        article.summary = summary;
        article.content = content;
        article.save(function(err){
          console.log(err);
        });
        req.flash('blog_update', 'Successfully updated article!');
        res.redirect('../../blog/edit');
      }
    })
  }
})


module.exports = router;