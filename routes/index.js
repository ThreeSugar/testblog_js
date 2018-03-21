var express = require('express');
var router = express.Router();
var Article = require('../models/blog');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()){
    // Article.find({'author': req.user.username}, null, {sort: '-date'}, function (err, article) {
    //   if (err) throw err;
    //   for(i=0; i < article.length; i++) {
    //     console.log(article[i].title);
    //     console.log(article[i]._id);
    //   }
    //   if(article){
    //     res.render('index', {article : article});
    //   } 
    //   else {
    //     res.render('index');
    //   }
    // });

    var query = {'author': req.user.username};
    var options = {
      sort:     { date: -1 },
      lean:     true,
      offset:   3 , 
      limit:   3
    };

    Article.paginate(query, options).then(function(article) {
      if(article) {
          console.log(article.docs[0].title);
          res.render('index', {article : article});
        } 
      else {
        res.render('index');
      }
  });
  } 
  else {
    res.redirect('login');
  }
});

module.exports = router;
