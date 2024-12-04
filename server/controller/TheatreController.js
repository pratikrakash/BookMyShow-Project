const theatreModel = require("../model/TheatreModel");
const addTheatre = async(req,res)=>{
    try{
        const newTheatre = new theatreModel(req?.body);
        await newTheatre.save();
        res.send({
            success:true,
            message:"new theatre added"
        })
    }
    catch(error){
        res.send({
            success:false,
            message:"failed to add new theatre"
        })
    }
}
const editTheatre = async(req,res)=>{
    try{
        const response = await theatreModel.findByIdAndUpdate(req?.body?.theatreId,req?.body,{new:true});
        res.send({
            success:true,
            message:"Theatre details updated successfully",
            data:response
        })
    }
    catch(error){
        res.send({
            success:false,
            message:"failed to update theatre details"
        })
    }
}
const deleteTheatre = async(req,res)=>{
    try{
        const {theatreId} = req?.params;
        await theatreModel.findByIdAndDelete(theatreId);
        res.send({
            success:true,
            message:"Theatre deleted successfully"
        })
    }
    catch(error){
        res.send({
            success:false,
            message:"Failed to delete theatre"
        })
    }
}
const getAllTheatres = async(req,res)=>{
    try{
        const allTheatres = await theatreModel.find({});
        res.send({
            success:true,
            message:"All theatre details fetched",
            data:allTheatres
        })
    }
    catch(error){
        res.send({
            success:false,
            message:"Failed to fetch all theatres"
        })
    }
}
const getTheatresByOwner = async(req,res)=>{
    try{
        const ownerId = req?.body.userId;
        const allTheatres = await theatreModel.find({owner:ownerId});
        res.send({
            success:true,
            message:"All theatre details fetched",
            data:allTheatres
        })
    }
    catch(error){
        res.send({
            success:false,
            message:"Failed to fetch theatres"
        })
    }
}
module.exports = {
    addTheatre,
    editTheatre,
    deleteTheatre,
    getAllTheatres,
    getTheatresByOwner
}