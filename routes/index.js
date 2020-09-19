var express = require('express');
var router = express.Router();
var modell=require("../modules/connectdb")
var bcrypt=require("bcryptjs")
var pass_cat=require("../modules/add_category")
var pass_details=require("../modules/add_pass")
var json=require('jsonwebtoken')
var session=require('express-session')
var localstorage=require('node-localstorage');
const { findByIdAndDelete } = require('../modules/connectdb');

var find=pass_cat.find({});
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

    //  LOGIN PAGE
router.get('/', function(req, res, next) {
  // console.log( req.session.getname)
  var user=localStorage.getItem('loginname');
   if(user){
     res.redirect('/dashboard')
   }
   else{
  res.render('login', { title: 'Password Manager',msg:'' });
  }
});

      // GO TO DASHBOARD PAGE AFTER SUCCESSFULL LOGIN
router.post('/', function(req, res, next) {
var Username=req.body.uname;
var password=req.body.password;

if(Username=='' || password==''){
 return res.render('login', { title: 'Password Manager',msg:'Invalid username or password !' });

}
if(Username=='' && password==''){
  return res.render('login', { title: 'Password Manager',msg:'Invalid username or password !' });

}
var finduser=modell.findOne({Username:Username})
finduser.exec((err,data)=>{

  if(data!=null && data!=''){
    var getpass=data.password;
    var getname=data.Username;
    var getid=data._id;
    if(password!=getpass){
      res.render('login', { title: 'Password Manager',msg:'Invalid username or password !' });
    }
    
    else {
      var token=json.sign({id:getid},'idtoken');
      localStorage.setItem('usertoken',token);
      localStorage.setItem('loginname',Username);
     
  
  res.redirect('/dashboard')
    }  }
 else {
  res.render('login', { title: 'Password Manager',msg:'Invalid username or password !' });

 }
})
});

//  SIGNUP PAGE
router.get('/signup', function(req, res, next) {
  var user=localStorage.getItem('loginname');
   if(user){
     res.redirect('/dashboard')
   }
   else{
  res.render('signup', { title: 'Password Manager',msg:'' });
   }
}); 
  // TO ADD DATA USING SIGNUP PAGE
router.post('/signup',checkname,checkemail, function(req, res, next) {
  var password=req.body.password;
  var cpassword=req.body.Cpassword;

  if(password!=cpassword){
    res.render('signup', { title: 'Password Manager' ,msg:"Password not matched !"});
  }
  else{
  var x=new modell({
  Username:req.body.username,
  Email:req.body.email,
  password:req.body.password,
  Cpassword:req.body.Cpassword
  })
  // password=bcrypt.hashSync(req.body.password,10);

  x.save((err,doc)=>{
    if(err) throw err;
    res.render('signup', { title: 'Password Manager' ,msg:"user registered successfully"});
  
  });
 
}
  });
  //  LOGOUT PAGE
router.get('/logout', function(req, res, next) {
localStorage.removeItem('usertoken');
localStorage.removeItem('loginname');
res.redirect("/");
});
module.exports = router;
