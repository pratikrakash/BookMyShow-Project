const { makePayement, getAllBookingsForUser, bookSeats, makePayementAndBookSeats } = require("../controller/BookingsController");

const router = require("express").Router();
router.post("/makePayment",makePayement);
router.get("/getAllBookingsForUser",getAllBookingsForUser);
router.post("/bookSeats",bookSeats);
router.post("/makePayementAndBookSeats",makePayementAndBookSeats)

module.exports = router;