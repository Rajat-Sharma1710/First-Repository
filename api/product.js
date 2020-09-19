var express = require('express');
var multer = require('multer');
var router = express.Router();
var product=require("../modules/product")

var storage=multer.diskStorage({
  destination:"./public/productFiles/",
  filename:(req,file,cb)=>{
    cb(null,Date.now()+'-'+file.originalname)
  }
})
var upload=multer({storage:storage}).single('files');
router.get('/',function(req,res){
   
    product.find().
   exec().then(data=>{
       res.status(200).json({
           message:'OK',
           data:data
       })
   }).
   catch(err=>{
       res.json(err)
   })
})

router.post('/add',upload,function(req,res){
  console.log(req.file);

var pro_model=new product({
    product_name:req.body.name,
    price:req.body.price,
    quantity:req.body.quan,
  })

  pro_model.save().then(doc=>{
    res.status(201).json({
            message:"Inserted succesfully",
            result:doc
  })
}).catch(err=>{
    res.json(err);
  })
})
module.exports=router;

