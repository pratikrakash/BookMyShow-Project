const movieModel = require("../model/MovieModel");
const getMovieById = async (req, res) => {
    try {
        const { movieId } = req?.params;
        const response = await movieModel.findById(movieId);
        if (response) {
            res.send({
                success: true,
                message: "Movie details fetched",
                data: response
            })
        }
        else {
            res.send({
                success: false,
                message: "Movie no longer is available"
            })
        }
    }
    catch (error) {
        res.send({
            success: false,
            message: "Movie no longer is available"
        })
    }
}
const getAllMovieDetails = async (req, res) => {
    try {
        const movieList = await movieModel.find();
        res.send({
            success: true,
            message: "Retrieved all movie details",
            data: movieList
        })
    }
    catch (error) {
        res.send({
            success: true,
            message: "Failed to fetch all movie details"
        })
    }
}
const updateMovieDetails = async (req, res) => {
    try {
        const updatedMovieDetails = await movieModel.findByIdAndUpdate(req?.body?.movieId, req?.body, { new: true });
        res.send({
            success: true,
            message: "Updated Movie details",
            data: updatedMovieDetails,
        })
    }
    catch (error) {
        res.send({
            success: true,
            message: "Failed to update movie"
        })
    }
}
const deleteMovie = async (req, res) => {
    try {
        const { movieId } = req?.params;
        await movieModel.findByIdAndDelete(movieId);
        res.send({
            success: true,
            message: "Movie deleted successfully"
        })
    }
    catch (error) {
        res.send({
            success: false,
            message: "Failed to delete movie"
        })
    }
}
const addMovie = async (req, res) => {
    try {
        const newMovie = new movieModel(req?.body);
        await newMovie.save();
        res.status(201).send({
            success: true,
            message: "New movie added successfully"
        })
    }
    catch (error) {
        res.status(401).send({
            success: false,
            message: "Failed to add new movie"
        })
    }
}
module.exports = {
    getMovieById,
    getAllMovieDetails,
    updateMovieDetails,
    deleteMovie,
    addMovie
}