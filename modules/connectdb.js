var mongoose=require("mongoose");
mongoose.connect('mongodb://localhost/pms',{useNewUrlParser: true,useCreateIndex: true, useUnifiedTopology: true,});
var conn=mongoose.connection;

var passSchema=mongoose.Schema({
    Username:{
         type:String,
         require:true,
         index:{
        unique:true     
        }
    },
    Email:{
        type:String,
        require:true,
        index:{
       unique:true     
       }
    },
    password:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

var passModel=mongoose.model("pmsModel",passSchema)
module.exports=passModel;