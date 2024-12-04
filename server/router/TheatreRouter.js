const { addTheatre, editTheatre, deleteTheatre, getAllTheatres, getTheatresByOwner } = require("../controller/TheatreController");
const router = require("express").Router();
router.post("/addNewTheatre",addTheatre);
router.patch("/updateTheatre",editTheatre);
router.delete("/deleteTheatre/:theatreId",deleteTheatre);
router.get("/getAllTheatres",getAllTheatres);
router.get("/getTheatresByOwner",getTheatresByOwner)
module.exports = router;