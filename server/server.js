const express = require("express");
const app = express();
const connectToDb = require("./configuration/db");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");
const userRouter = require("./router/UserRouter");
const movieRoute = require("./router/MovieRouter");
const theatreRoute = require("./router/TheatreRouter");
const showRoute = require("./router/ShowRouter");
const bookingsRoute = require("./router/BookingRouter");
const { validateToken } = require("./middleware/authorizationMiddleware");
require('dotenv').config();
const port = process.env.PORT;
connectToDb();
const clientBuildPath = path.join(__dirname,"../client/dist");
app.use(express.static(clientBuildPath));
const limiter = rateLimit({
    windowMs:15*60*1000,
    max:100,
    message:"You have sent too many requests. Please wait for 15 minutes"
})
app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "example.com"], // Allow scripts from 'self' and example.com
        styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles (unsafe)
        imgSrc: ["'self'", "data:", "example.com"], // Allow images from 'self', data URLs, and example.com
        connectSrc: ["'self'", "api.example.com"], // Allow connections to 'self' and api.example.com
        fontSrc: ["'self'", "fonts.gstatic.com"], // Allow fonts from 'self' and fonts.gstatic.com
        objectSrc: ["'none'"], // Disallow object, embed, and applet elements
        upgradeInsecureRequests: [], // Upgrade insecure requests to HTTPS
      },
    })
  );
app.use(express.json());
app.use(mongoSanitize());
app.use("/bms",limiter);
app.use("/bms/users",userRouter);
app.use("/bms/movies",validateToken,movieRoute);
app.use("/bms/theatre",validateToken,theatreRoute);
app.use("/bms/shows",validateToken,showRoute);
app.use("/bms/bookings",validateToken,bookingsRoute);

app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
})