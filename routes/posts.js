var express = require('express');
var router = express.Router();
var mongo=require('mongodb');
var db=require('monk')('localhost/nodeblog');


router.get('show/:id',function(req,res,next){
  var posts=db.get('posts');
  posts.findById(req.params.id,function(err,post){
    res.render('show',{
      "post":post
  });
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
  var category=req.body.category;
  var body=req.body.body;
  var author=req.body.author;
  var date=new Date();
  if(req.files.mainimage){

    var mainImageName         =req.files.mainimage.name;

  }
  else{
    var mainImageName            ='noimage.png';
  }
  //formvalidation
  req.checkBody('title','title field is required').notEmpty();
  req.checkBody('body','body field is required');
  //check for errors
var errors=req.validationErrors();
if(errors){
  res.render('addpost',{
    "errors":errors,
    "title":title,
    "body":body
  });
}
else{
  var posts=db.get('posts');
  //submitiing to db
  posts.insert({
    "title":title,
    "body":body,
    "category":category,
    "date":date,
    "author":author,
    "mainimage":mainImageName
  },function(err,post){
    if(err)
    {res.send('there was an error in submiiting the form');
  }else{
    req.flash('success','post submitted');

    res.location('/');
    res.redirect('/');

  }
  });
}
});

module.exports = router;
