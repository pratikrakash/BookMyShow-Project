const showModel = require("../model/ShowsModel");
const createNewShow = async (req, res) => {
    try {
        const newShow = new showModel(req?.body);
        newShow.save();
        res.send({
            success: true,
            message: "New show created successfully"
        })
    }
    catch (error) {
        res.send({
            success: false,
            message: "Failed to add new show"
        })
    }
}
const updateShowDetials = async (req, res) => {
    try {
        const { showId } = req?.params;
        const updatedShow = await showModel.findByIdAndUpdate(showId, req?.body, { new: true });
        res.send({
            success: true,
            message: "Show details updated successfully",
            updatedShow
        })
    }
    catch (error) {
        res.send({
            success: false,
            message: "Failed to update show details"
        })
    }
}
const deleteShow = async (req, res) => {
    try {
        const { showId } = req?.params;
        await showModel.findByIdAndDelete(showId);
        res.send({
            success: true,
            message: "Deleted show successfully"
        })
    }
    catch (error) {
        res.send({
            success: false,
            message: "Failed to delete the show"
        })
    }
}
const getAllShowsByTheatre = async (req, res) => {
    try {
        const { theatreId } = req?.params;
        const allShowsByTheatre = await showModel.find({ theatre: theatreId }).populate("movie");
        if (allShowsByTheatre.length) {
            res.send({
                success: true,
                message: "Fetched all shows for this theatre",
                data: allShowsByTheatre
            })
        }
        else {
            res.send({
                success: false,
                message: "Could not find any show for this theatre"
            })
        }
    }
    catch (error) {
        res.send({
            success: false,
            message: "Failed to fetch shows for this theatre"
        })
    }
}
const getAllTheatreByMovie = async (req, res) => {
    try {
        const { movieId, date } = req?.params;
        const shows = await showModel.find({ movie: movieId, date: date }).populate("theatre");
        let uniqueTheatres = [];
        shows.forEach((show)=>{
            const isTheatreInList = uniqueTheatres.find((theatre)=>{
                return theatre._id === show.theatre._id
            });
            if(!isTheatreInList){
                const allShows = shows.filter((eachShow)=>{
                    if(eachShow.theatre._id === show.theatre._id){
                        return true;
                    }
                    else{
                        return false;
                    }
                });
                uniqueTheatres.push({
                    ...show.theatre._doc,
                    shows:allShows
                })
            }
        })
        res.send({
            success: true,
            message: "Shows for this movie",
            data: uniqueTheatres
        })
    }
    catch (error) {
        res.send({
            success: false,
            message: "Failed to find shows for this theatre"
        })
    }
}
const getShowById = async(req,res)=>{
    try{
        const {showId} = req?.params;
        const response = await showModel.findById(showId).populate("movie").populate("theatre");
        if(response){
            res.send({
                success:true,
                message:"Show details fetched",
                data:response
            })
        }
        else{
            res.send({
                success:false,
                message:"No show for this show id"
            })
        }
    }
    catch(error){
        res.send({
            success:false,
            message:"Failed to fetch show details"
        })
    }
}
module.exports = {
    createNewShow,
    updateShowDetials,
    deleteShow,
    getAllShowsByTheatre,
    getAllTheatreByMovie,
    getShowById
}