import { useEffect, useState } from "react";
import { getAllSeatsForUser } from "../../api/bookingRoutes";
import { Row, Col,Card, message } from "antd";
import { Link } from "react-router-dom";
import moment from "moment";
import { useDispatch } from "react-redux";
import { loaderReducers } from "../../slice/LoaderSlice";

function Bookings() {
    const [allBookings, setAllBookings] = useState([]);
    const dispatch = useDispatch();
    const getAllBookings = async () => {
        try {
            dispatch(loaderReducers.showLoader());
            const response = await getAllSeatsForUser();
            if (response.success) {
                setAllBookings(response.data);
            }
            else {
                message.error(response.message);
            }
        }
        catch (error) {
            message.error(error.message);
        }
        finally{
            dispatch(loaderReducers.hideLoader());
        }
    }
    console.log(allBookings);
    useEffect(() => {
        getAllBookings();
    }, []);
    return (
        <>
            {
                (allBookings.length >0)? (
                    allBookings.map((booking)=>{
                        return (
                            <>
                                <Row gutter={24}>
                                    <Col key={booking._id} xs={{span:24}} lg={{span:12}}>
                                        <Card className="mb-3">
                                            <div className="d-flex flex-column-mob">
                                                <div className="flex-shrink-0">
                                                    <img src={booking.show.movie.poster} alt="Movie Poster" width={100}/>
                                                </div>
                                                <div className="show-details flex-1">
                                                    <h3 className="mt-0 mb-0">{booking.show.movie.movieName}</h3>
                                                    <p>Theatre: <b>{booking.show.theatre.name}</b></p>
                                                    <p>Seats: <b>{booking.seats.join(", ")}</b></p>
                                                    <p>
                                                        Date & Time: 
                                                        <b>
                                                            {moment(booking.show.date).format("YYYY-MM-DD")}{" "}
                                                            {moment(booking.show.time,"HH:mm").format("hh:mm A")}
                                                        </b>
                                                    </p>
                                                    <p>
                                                        Amount: 
                                                        <b>
                                                            Rs.{booking.show.ticketPrice}
                                                        </b>
                                                    </p>
                                                    <p>
                                                        Booking ID:{" "}
                                                        <b>
                                                            {booking.transactionId}
                                                        </b>
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                </Row>
                            </>
                        )
                    })
                ):(
                    <div>
                        <h1>You have no bookings available</h1>
                        <Link to="/">Click here to start booking.</Link>
                    </div>
                )
            }
        </>
    )
}
export default Bookings;
