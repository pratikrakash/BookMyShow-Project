const bcrypt = require("bcrypt");
const userModel = require("../model/UserModel");
const jsonwebtoken = require("jsonwebtoken");
const emailHelper = require("../utilities/emailHelper");
const createNewUser = async(req,res)=>{
    try{
        const email = req?.body?.email;
        const usersWithEmail = await userModel.findOne({email:email});
        if(!usersWithEmail){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req?.body?.password,salt);
            req.body.password = hashedPassword;
            const newUser = new userModel(req?.body);
            await newUser.save();
            res.send({
                success:true,
                message:"New user registered successfully"
            })
        }
        else{
            res.send({
                success: false,
                message:`User with email-id ${email} already exists`
            })
        }
    }
    catch(error){
        res.send({
            success:false,
            message:"Error occured while creating new user"
        })
    }
}
const loginUser = async(req,res)=>{
    try{
        const userDetails = await userModel.findOne({email:req?.body?.email});
        if(userDetails){
            const match = await bcrypt.compare(req?.body?.password,userDetails.password);           
            if(match){
                const token = jsonwebtoken.sign({userId:userDetails._id},process.env.PRIVATE_KEY,{expiresIn:"1d"});
                res.send({
                    success:true,
                    message:"You have successfully logged-in",
                    token: token
                })
            }
            else{
                res.send({
                    success:false,
                    message:"Incorrect password"
                })
            }
        }
        else{
            res.send({
                success:false,
                message:`User with email ${req?.body?.email} does not exists`
            })
        }
    }
    catch(error){
        res.send({
            success:false,
            message:"Error occured while logging in"
        })
    }
}
const getCurrentUserDetails = async(req,res)=>{
    try{
        const userId = req.body.userId;
        const userDetails = await userModel.findById(userId).select("-password");
        if(userDetails){
            res.send({
                success:true,
                message:"Extracted user details",
                userDetails
            })
        }
        else{
            res.send({
                success:false,
                message:`User no longer available`
            })
        }
    }
    catch(error){
        res.send({
            success:false,
            message:`Failed to get user details`
        })
    }
}
const generateOtp = async(req,res)=>{
    try{
        const {email} = req?.body;
        const user = await userModel.findOne({email:email});
        if(!user){
            res.send({
                success:false,
                message:"User does not exists"
            })
        }
        else{
            if(user.otp &&  user.otpExpiresAt>Date.now()){
                res.send({
                    success:false,
                    message:"Please use the otp send over email"
                })
            }
            else{
                const otp = Math.floor(Math.random()*100000)+90000;
                const expiresAt = Date.now()+10*60*1000;
                user.otp = otp;
                user.otpExpiresAt = expiresAt;
                await user.save();
                await emailHelper("otp.html",user.email,{
                    name:user.name,
                    otp:user.otp
                });
                res.send({
                    success:true,
                    message:"OTP sent to your email"
                })
            }
        }
    }
    catch(error){

    }
}
const resetPassword = async(req,res)=>{
    try{
        const {password,otp}=req?.body;
        const user = await userModel.findOne({otp:otp});
        if(!user){
            res.send({
                success:false,
                message:"Invalid OTP"
            })
        }
        else{
            if(user.otpExpiresAt < Date.now()){
                res.send({
                    success:false,
                    message:"OTP is expired"
                })
            }
            else{
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password,salt);
                user.password = hashedPassword;
                user.otp="";
                user.otpExpiresAt=null;
                await user.save();
                res.send({
                    success:true,
                    message:"Password Reset successful, please login now!"
                })
            }
        }
    }
    catch(error){
        res.send({
            success:false,
            message:"Failed to reset password"
        })
    }
}
module.exports = {
    createNewUser,
    loginUser,
    getCurrentUserDetails,
    generateOtp,
    resetPassword
}