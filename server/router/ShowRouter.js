const { createNewShow, updateShowDetials, deleteShow, getAllShowsByTheatre, getAllTheatreByMovie, getShowById } = require("../controller/ShowsController");

const router = require("express").Router();
router.post("/createNewShow",createNewShow);
router.patch("/updateShowDetails/:showId",updateShowDetials);
router.delete("/deleteShow/:showId",deleteShow);
router.get("/getAllShowsByTheatre/:theatreId",getAllShowsByTheatre);
router.get("/getAllTheatreByMovie/:movieId/date/:date",getAllTheatreByMovie);
router.get("/getShowById/:showId",getShowById);
module.exports = router;
