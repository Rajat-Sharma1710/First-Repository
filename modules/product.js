var mongoose =require('mongoose')
mongoose.connect('mongodb://localhost/pms',{useNewUrlParser: true, useCreateIndex: true});
var conn=mongoose.connection;

var pro_sch=mongoose.Schema({
   
    product_name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true,
    }
})

var pro_model=mongoose.model("product_API",pro_sch)
module.exports=pro_model;