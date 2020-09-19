var express = require('express');
var router = express.Router();

var pass_cat=require("../modules/add_category")
var find=pass_cat.find({},{'date':0,'__v':0 });

router.get('/',function(req,res){
    find.exec(function(err,data){
        if(err) throw err;
        res.send(data);
          })
})

router.post('/add',function(req,res){
    var add_model=new pass_cat({
        password:req.body.pass
      })
      // add_model.save(function(err,doc){
      //     if(err) throw err;
      //     res.status(201).json({
      //       message:"Inserted succesfully",
      //       result:doc
      //     })
      // })
      add_model.save().then(doc=>{
        res.status(201).json({
                message:"Inserted succesfully",
                result:doc
      })
    }).catch(err=>{
        res.json(err);
      })
    })
  


router.put('/update/:id',function(req,res){
   var getid=req.params.id;
  pass_cat.findById(getid,function(err,data){
      if(err) throw err;
      data.password=req.body.pass?req.body.pass:data.password;
      data.save(function(err){
        if(err) throw err;
        res.send("Update data using PUT method");
      })
  })
})

router.delete('/del/:id',function(req,res){
    var getid=req.params.id;
  pass_cat.findByIdAndDelete(getid,function(err,data){
      if(err) throw err; 
        res.send("DELETE data successfully");      
  })
})

module.exports=router;