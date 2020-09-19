var mongoose=require("mongoose");
mongoose.connect('mongodb://localhost/pms',{useNewUrlParser: true,useCreateIndex: true, useUnifiedTopology: true,});
var conn=mongoose.connection;

var add_pass=mongoose.Schema({
   
    password_category:{
        type:String,
        require:true,
        index: {
            unique:true
        }
    },
    password_details:{
        type:String,
        require:true
    },
    user_id:{
        type:String,
    },
    date:{
        type:Date,
        default:Date.now
    }
})

var addpass=mongoose.model("pass_details",add_pass)
module.exports=addpass;