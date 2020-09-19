var express = require('express');
var router = express.Router();
var modell=require("../modules/connectdb")
var bcrypt=require("bcryptjs")
var pass_model=require("../modules/connectdb");
var pass_cat=require("../modules/add_category")
var pass_details=require("../modules/add_pass")
var json=require('jsonwebtoken')
var localstorage=require('node-localstorage');
const { findByIdAndDelete, findById } = require('../modules/connectdb');

var find1=pass_details.find({});
/* GET home page. */

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

//  MIDDLEWARE TO CHECK IF USER IS CORRECTLY LOGGED IN THEN ONLY HE ACCESS ALL THE NEXT PAGES
function checkLogin(req,res,next){
  var a=localStorage.getItem('usertoken');
  try{
      json.verify(a,'idtoken');
  }
  catch{
        res.redirect("/");
  }
  next();
}

//  MIDDLEWARE TO MATCH EMAIL FROM DATABASE
function checkLogin(req,res,next){
  var a=localStorage.getItem('usertoken');
  try{
    if(a){
      json.verify(a,'idtoken');
  }else{
    res.redirect("/");
  }}
  catch{
        res.redirect("/");
  }
  next();
}
//  MIDDLEWARE TO MATCH NAME FROM DATABASE
function checkname(req,res,next){
  var username=req.body.username;
var user_model=modell.findOne({Username:username})
user_model.exec((err,data)=>{
  if(err) throw err
  if(data){
   return res.render('signup', { title: 'Password Manager' ,msg:"Username already exists !"});
  }
  next();
})
}
  
    // PASSWORD_CATEGORY PAGE
router.get('/', checkLogin,function(req, res, next) {
    var user=localStorage.getItem('loginname');
    var model=pass_model.find({"Username":user}).exec(function(err,data){
      if(err) throw err
     var id=data[0]._id;
    
    var find=pass_cat.find({"user_id":id})
    .exec(function(err,data){
    if(err) throw err;
  //  console.log(id)
    res.render('pass_category', { title: 'Password Manager',user:user ,data:data});
  })
})
  });
  
    // TO DELETE PASSOWRD_CATEGORY
  router.get('/delete/:id', checkLogin,function(req, res, next) {
    var find=pass_cat.find({});
  
    var user=localStorage.getItem('loginname');
    var del=req.params.id;
    var delcat=pass_cat.findByIdAndDelete(del);
  
  delcat.exec(function(err,data){
    if(err) throw err;
  
    res.redirect('/pass_category');
  })
  });
    // GO TO EDIT PAGE
  router.get('/edit/:id', checkLogin,function(req, res, next) {
    var find=pass_cat.find({});
  
    var user=localStorage.getItem('loginname');
    var get_id=req.params.id;
    var findcat=pass_cat.findById(get_id);
  
  findcat.exec(function(err,data){
    if(err) throw err;
 
    res.render('edit_category', { title: 'Password Manager',user:user ,data:data});
  })
  });
  
    // TO UPDATE AND RETURN TO PREVIOUS PAGE
  router.post('/edit/', checkLogin,function(req, res, next) {
    var find=pass_cat.find({});
  
    var user=localStorage.getItem('loginname');
    var update=pass_cat.findByIdAndUpdate(req.body.id,{password:req.body.catename});
  
  update.exec(function(err,reqs){
    if(err) throw err;
  
  res.redirect('/pass_category')
  })
  });
  
  
      module.exports = router;
