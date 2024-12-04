const { timeStamp } = require("console");
const mongoose = require("mongoose");
const { type } = require("os");
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["admin","partner","user"],
        default:"user"
    },
    otp:{
        type:String
    },
    otpExpiresAt:{
        type:Date
    }
},{
    timeStamp:true
});
const userModel = mongoose.model("Users",userSchema);
module.exports = userModel;
