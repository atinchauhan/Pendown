var express = require('express');
var router = express.Router();
var mongo=require('mongodb');
var db=require('monk')('localhost/nodeblog');
router.get('/show/:category',function(req,res,next){
  var db=req.db;
  var posts=db.get('posts');
  posts.find({category: req.params.category},{},function(err,posts){
    res.render('index',{
      "title":req.params.category,
      "posts":posts
    });
  });
});



router.get('/add',function(req,res,next){
  res.render('addcategory',{
    "title":"Add Category"
  });
});
router.get('/add',function(req,res,next){
  var categories = db.get('categories');
  categories.find({},{},function(err, categories){
    res.render('addpost',{
      "title":"Add Post",
      "categories":categories
  });

  });
});

router.post('/add',function(req,res,next){
  //get form values
  var title=req.body.title;

  //formvalidation
  req.checkBody('title','title field is required').notEmpty();

  //check for errors
var errors=req.validationErrors();
if(errors){
  res.render('addcategory',{
    "errors":errors,
    "title":title
  });
}
else{
  var categories=db.get('categories');
  //submitiing to db
  categories.insert({
    "title":title
  },function(err,category){
    if(err)
    {res.send('there was an error in submiiting the category');
  }else{
    req.flash('success','category submitted');
    res.location('/');
    res.redirect('/');

  }
  });
}
});


module.exports = router;
