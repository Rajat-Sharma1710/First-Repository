var express = require('express');
var router = express.Router();
var modell=require("../modules/connectdb")
var bcrypt=require("bcryptjs")
var pass_cat=require("../modules/add_category")
var pass_details=require("../modules/add_pass")
var json=require('jsonwebtoken')
var localstorage=require('node-localstorage');
const { findByIdAndDelete } = require('../modules/connectdb');

var find=pass_cat.find({});

/* GET home page. */

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

//  MIDDLEWARE TO CHECK IF USER IS CORRECTLY LOGGED IN THEN ONLY HE ACCESS ALL THE NEXT PAGES
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

//  MIDDLEWARE TO MATCH EMAIL FROM DATABASE
function checkemail(req,res,next){
  var email=req.body.email;
var user_model=modell.findOne({Email:email})
user_model.exec((err,data)=>{
  if(err) throw err
  if(data){
   return  res.render('signup', { title: 'Password Manager' ,msg:"Email already exists !"});
  }
  next();
})
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
 
      //  VIEW ALL PASSWORDS 
router.get('/',checkLogin, function(req, res, next) {
    var user=localStorage.getItem('loginname');
    modell.find({"Username":user}).exec(function(err,data){
      if(err) throw err;
      var id=data[0]._id;
    pass_details.find({"user_id":id}).exec(function(err,data){
      if(err) throw err;
      res.render('view_pass', { title: 'Password Manager',user:user ,data:data});
    })
  })
  });
  
  router.get('/delete/:id',checkLogin, function(req, res, next) {
    var user=localStorage.getItem('loginname');
    var delet=req.params.id;
    var delexe=pass_details.findByIdAndDelete(delet);
  
    delexe.exec(function(err,doc){
      if(err) throw err;
      res.redirect('/view_pass');
    })
    })
    
    router.get('/edit/:id',checkLogin, function(req, res, next) {
      var user=localStorage.getItem('loginname');
      var editpass=req.params.id;
      var editexe=pass_details.findById(editpass);                             
    
      editexe.exec(function(err,data){
        if(err) throw err;
        res.render('edit_pass', { title: 'Password Manager',user:user,data:data});
  
      })
      })
  
      router.post('/edit/', checkLogin,function(req, res, next) {
      
        var user=localStorage.getItem('loginname');
        var update=pass_details.findByIdAndUpdate(req.body.id,{password_details:req.body.passdetail});
      
      update.exec(function(err,reqs){
        if(err) throw err;
      
      res.redirect('/view_pass')
      })
      });
      module.exports = router;
