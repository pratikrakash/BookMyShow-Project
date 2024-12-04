const express = require("express");
const { addMovie, getAllMovieDetails, updateMovieDetails, deleteMovie, getMovieById } = require("../controller/MovieController");
const router = express.Router();
router.post("/addNewMovie",addMovie);
router.get("/getAllMovies",getAllMovieDetails);
router.get("/getMovieById/:movieId",getMovieById);
router.patch("/updateMovieDetails",updateMovieDetails);
router.delete("/deleteMovie/:movieId",deleteMovie);
module.exports = router;