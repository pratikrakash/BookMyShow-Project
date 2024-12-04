const mongoose = require("mongoose");
const movieSchema = mongoose.Schema({
    movieName:{
        type:"String",
        required:true,
        unique:true
    },
    description:{
        type:"String",
        required:true
    },
    duration:{
        type:"Number",
        required:true
    },
    genre:{
        type:"String",
        required:true
    },
    language:{
        type:"String",
        required:true
    },
    releaseDate:{
        type:"Date",
        required:true
    },
    poster:{
        type:"String",
        required:true
    }
});
module.exports = mongoose.model("movies",movieSchema);