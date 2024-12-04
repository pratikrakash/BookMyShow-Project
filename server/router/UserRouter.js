const express = require("express");
const { createNewUser, loginUser, getCurrentUserDetails, generateOtp, resetPassword } = require("../controller/UserController");
const {validateToken} = require("../middleware/authorizationMiddleware");
const router = express.Router();
router.post("/loginUser",loginUser)
router.post("/createNewUser",createNewUser);
router.get("/getCurrentUserDetails",validateToken,getCurrentUserDetails);
router.post("/generateOtp",generateOtp);
router.post("/resetPassword",resetPassword);
module.exports = router;
