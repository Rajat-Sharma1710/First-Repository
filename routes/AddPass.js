var express = require('express');
var router = express.Router();
var modell=require("../modules/connectdb")
var bcrypt=require("bcryptjs")
var pass_cat=require("../modules/add_category")
var pass_details=require("../modules/add_pass")
var json=require('jsonwebtoken')
var localstorage=require('node-localstorage');


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
  // ADD_PASSWORD PAGE
  router.get('/',checkLogin, function(req, res, next) {
    var user=localStorage.getItem('loginname');

    modell.find({"Username":user}).exec(function(err,data){
      if(err) throw err;
      var id=data[0]._id;
     
     pass_cat.find({"user_id":id}).exec(function(err,doc){
        if(err) throw err;
      
      res.render('AddPass', { title: 'Password Manager',user:user,data:data,records:doc,msg:'' });
    })
  })
})
  
  router.post('/',checkLogin, function(req, res, next) { 
    var user=localStorage.getItem('loginname');
  // var pcat=req.body.passdetail;
   
    var addpassmodel=new pass_details({
      password_category:req.body.pass,
      password_details:req.body.passdetail,
      user_id:req.body.userid
    })
    
    addpassmodel.save(function(err,doc){
      pass_cat.find().exec(function(err,data){
        if(err) throw err;
      
        res.render('AddPass', { title: 'Password Manager',user:user,records:data,data:req.body.userid ,msg:'password details Inserted'});
      })
    })
  })
  
      module.exports = router;
