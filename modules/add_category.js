var mongoose=require("mongoose");
mongoose.connect('mongodb://localhost/pms',{useNewUrlParser: true, useCreateIndex: true});
var conn=mongoose.connection;

var add_passcat=mongoose.Schema({
   
    password:{
        type:String,
        required:true,
        index: {
            unique:true
        }
    },
    user_id:{
        type:String,
        
    },
    date:{
        type:Date,
        default:Date.now
    }
  
})

var passCat=mongoose.model("pass_category",add_passcat)
module.exports=passCat;