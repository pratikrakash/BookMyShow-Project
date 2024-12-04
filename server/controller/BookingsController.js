const { populate } = require("dotenv");
const bookingsModel = require("../model/BookingsModel");
const showsModel = require("../model/ShowsModel");
const stripe = require("stripe")(process.env.STRIPE_KEY);
const emailHelper = require("../utilities/emailHelper");
const { default: mongoose } = require("mongoose");

const makePayement = async (req, res) => {
    try {
        const { token, amount } = req?.body;
        let currentCustomer = null;
        const customers = await stripe.customers.list({
            email: token.email,
            limit: 1
        });
        if (customers.data.length > 0) {
            currentCustomer = customers.data[0];
        }
        else {
            const createNewCustomer = async () => {
                return await stripe.customers.create({
                    source: token.id,
                    email: token.email
                })
            }
            currentCustomer = await createNewCustomer();
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            customer: currentCustomer.id,
            payment_method_types: ["card"],
            receipt_email: token.email,
            description: "This token is assigned to the movie"
        });
        const transactionId = paymentIntent.id;
        res.send({
            success: true,
            message: "Transaction successfull",
            data: transactionId
        })
    }
    catch (error) {
        res.send({
            success: false,
            message: "Transaction failed"
        })
    }
}
const bookSeats = async (req, res) => {
    try {
        const newBooking = new bookingsModel(req?.body);
        await newBooking.save();
        const { show } = req?.body;
        const showDetails = await showsModel.findById(show);
        const updatedSeats = [...showDetails.bookedSeats, ...req.body.seats];
        await showsModel.findByIdAndUpdate(show, { bookedSeats: updatedSeats });
        const bookingDetails = await bookingsModel.findById(newBooking._id)
            .populate("user")
            .populate("show")
            .populate({
                path: "show",
                populate: ({
                    path: "movie",
                    model: "movies"
                })
            })
            .populate({
                path: "show",
                populate: ({
                    path: "theatre",
                    model: "theatres"
                })
            });
        await emailHelper("ticketTemplate.html", bookingDetails.user.email, {
            name: bookingDetails.user.name,
            movie: bookingDetails.show.movie.movieName,
            theatre: bookingDetails.show.theatre.name,
            date: bookingDetails.show.date,
            time: bookingDetails.show.time,
            seats: bookingDetails.seats,
            amount: bookingDetails.seats.length * bookingDetails.show.ticketPrice,
            transactionId: bookingDetails.transactionId,
        });
        res.send({
            success: true,
            message: "Seats booked successfully, ticket sent to your email"
        })
    }
    catch (error) {
        res.send({
            success: false,
            message: "Failed to book seats"
        })
    }
}
const makePayementAndBookSeats = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    let paymentIntent;
    try {
        const { token, amount, show, seats } = req?.body;
        let currentCustomer;
        const customer = await stripe.customers.list({
            email: token.email,
            limit: 1
        });
        if (customer.data.length > 0) {
            currentCustomer = customer.data[0];
        }
        else {
            currentCustomer = await stripe.customers.create({
                email: token.email,
                source: token.id
            })
        }
        paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            customer: currentCustomer.id,
            payment_method_types: ["card"],
            receipt_email: token.email,
            description: "This token is assigned to the movie"
        })
        const transactionId = paymentIntent.id;
        const bookedShow = await showsModel.findById(show).populate("movie").session(session);
        const ifSeatsBooked = seats.some((seat) => bookedShow.bookedSeats.includes(seat));
        if (ifSeatsBooked) {
            throw new Error("The selected seats are already booked");
        }
        const updatedBookedSeats = [...bookedShow.bookedSeats, ...seats];
        await showsModel.findByIdAndUpdate(show, { bookedSeats: updatedBookedSeats });
        const newBooking = new bookingsModel({...req?.body, transactionId});
        await newBooking.save({session});
        const bookingDetails = await bookingsModel.findById(newBooking._id)
            .populate("user")
            .populate("show")
            .populate({
                path: "show",
                populate: ({
                    path: "movie",
                    model: "movies"
                })
            })
            .populate({
                path: "show",
                populate: ({
                    path: "theatre",
                    model: "theatres"
                })
            })
            .session(session);
        await session.commitTransaction();
        session.endSession();
        res.send({
            success:true,
            message:"Seats booked successfully, ticket will be sent to your email",
        });
        await emailHelper("ticketTemplate.html", bookingDetails.user.email, {
            name: bookingDetails.user.name,
            movie: bookingDetails.show.movie.movieName,
            theatre: bookingDetails.show.theatre.name,
            date: bookingDetails.show.date,
            time: bookingDetails.show.time,
            seats: bookingDetails.seats,
            amount: bookingDetails.seats.length * bookingDetails.show.ticketPrice,
            transactionId: bookingDetails.transactionId,
        });
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.send({
            success:false,
            message:"Failed to book your seat"
        })
    }
}
const getAllBookingsForUser = async (req, res) => {
    try {
        const userId = req?.body?.userId;
        const allBookings = await bookingsModel.find({ user: userId })
            .populate("user")
            .populate("show")
            .populate({
                path: "show",
                populate: {
                    path: "movie",
                    model: "movies"
                }
            })
            .populate({
                path: "show",
                populate: {
                    path: "theatre",
                    model: "theatres"
                }
            })
        if (allBookings.length === 0) {
            res.send({
                success: true,
                message: "No tickets for the user",
                data: []
            })
        }
        else {
            res.send({
                success: true,
                message: "All tickets for user",
                data: allBookings
            })
        }
    }
    catch (error) {
        res.send({
            success: false,
            message: "Failed to get all the tickets for the user"
        })
    }
}
module.exports = {
    makePayement,
    bookSeats,
    getAllBookingsForUser,
    makePayementAndBookSeats
}