import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getShowById } from "../api/showRoutes";
import { message, Row, Col, Card, Button } from "antd";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import { bookSeats, makePayement, makePayementAndBookSeats } from "../api/bookingRoutes";
import {useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loaderReducers } from "../slice/LoaderSlice";

function BookShow() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {currentUser} = useSelector((store)=>{
        return store.User;
    });    
    const { showId } = useParams();
    const [showDetails, setShowDetails] = useState({});
    const [selectedSeats, setSelectedseats] = useState([]);
    const getShowDetails = async () => {
        try {
            const response = await getShowById(showId);
            if (response.success) {
                setShowDetails(response.data);
            }
            else {
                message.error(response.message);
            }
        }
        catch (error) {
            message.error(error.message);
        }
    }
    const displayAllSeats = () => {
        const totalSeats = showDetails.totalSeats;
        const rows = totalSeats / 10;
        const columns = Math.ceil(totalSeats / rows);
        return (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div className="w-100 max-width-600 mx-auto mb-25px">
                    <div className="screen-div"></div>
                    <p className="text-center mb-10px">Screen in on this side, you will watch towards here</p>
                    <ul className="seat-ul justify-content-center">
                        {
                            Array.from(Array(rows).keys()).map((row) => {
                                return Array.from(Array(columns).keys()).map((column) => {
                                    const seatNumber = row * columns + column + 1;
                                    let seatClass = "seat-btn";
                                    if ((showDetails.bookedSeats).includes(seatNumber)) {
                                        seatClass += " booked";
                                    }
                                    else if (selectedSeats.includes(seatNumber)) {
                                        seatClass += " selected";
                                    }
                                    return (
                                        <li key={seatNumber}>
                                            <button
                                                onClick={() => {
                                                    if (!(selectedSeats.includes(seatNumber))) {
                                                        setSelectedseats([...selectedSeats, seatNumber])
                                                    }
                                                    else {
                                                        setSelectedseats(selectedSeats.filter((seat) => {
                                                            return seat != seatNumber;
                                                        }))
                                                    }
                                                }}
                                                className={seatClass}>
                                                {seatNumber}
                                            </button>
                                        </li>
                                    )
                                })
                            })
                        }
                    </ul>
                </div>
            </div>
        )
    }
    // const bookSelectedSeats = async(transactionId)=>{
    //     try{
    //         const response = await bookSeats({
    //             show:showDetails._id,
    //             user:currentUser._id,
    //             seats:selectedSeats,
    //             transactionId:transactionId
    //         });
    //         if(response.success){
    //             message.success(response.message);
    //             navigate("/profile");
    //         }
    //         else{
    //             message.error(response.message);
    //         }
    //     }
    //     catch(error){
    //         message.error(error.message);
    //     }
    // }
    // const onToken = async(token)=>{
    //     try{
    //         const amount = selectedSeats.length * showDetails.ticketPrice;
    //         const response = await makePayement({token,amount});
    //         if(response.success){
    //             bookSelectedSeats(response.data);
    //             message.success(response.message);
    //         }
    //         else{
    //             message.error(response.message);
    //         }   
    //     }
    //     catch(error){
    //         message.error(error.message);
    //     }
    // }
    const PayAndBook = async(token)=>{
        try{
            dispatch(loaderReducers.showLoader());
            const amount = selectedSeats.length * showDetails.ticketPrice;
            const response = await makePayementAndBookSeats({
                token,
                amount,
                show: showDetails._id,
                user: currentUser._id,
                seats:selectedSeats
            });
            if(response.success){
                message.success(response.message);
                navigate("/profile");
            }
            else{
                message.error(response.error);
            }
        }
        catch(error){
            message.error(error.message);
        }
        finally{
            dispatch(loaderReducers.hideLoader());
        }
    }
    useEffect(() => {
        getShowDetails();
    }, [])
    return (
        <>
            {
                (Object.entries(showDetails).length > 0) && (
                    <Row gutter={24}>
                        <Col span={24}>
                            <Card title={
                                <div className="movie-title-details">
                                    <h1>{showDetails.movie.movieName}</h1>
                                    <p>Theatre: {showDetails.theatre.name},{showDetails.theatre.address}</p>
                                </div>
                            }
                                extra={
                                    <div className="show-name py-3">
                                        <h3><span>{showDetails.name}</span></h3>
                                        <h3><span>Date & Time:{" "}{moment(showDetails.date).format("YYYY-MM-DD")},{moment(showDetails.time, "HH:mm").format("HH:mm A")}</span></h3>
                                        <h3><span>Ticket Price:{" "}{showDetails.ticketPrice}</span></h3>
                                        <h3>
                                            <span>Total Seats:{" "}{showDetails.totalSeats}</span>
                                            <span>&nbsp;|&nbsp;Available Seats:{" "}{showDetails.totalSeats - (showDetails.bookedSeats).length}</span>
                                        </h3>
                                    </div>
                                }
                                style={{ width: "100%" }}
                            >
                                {displayAllSeats()}
                            </Card>
                        </Col>
                    </Row>
                )
            }
            {
                (selectedSeats.length > 0) && (
                    <StripeCheckout
                        token={PayAndBook}
                        amount={selectedSeats.length * showDetails.ticketPrice}
                        billingAddress
                        stripeKey="pk_test_51QJp5LKPQHS6qPulzVf5k6j4tMDr5BO0xYObSrfGCxNhZXLzPYQ3z3nFFFwbrfJnNAWCnmCmdFK1RPmiWIlnS60000KQxhc3Ze"
                    >
                        <div className="max-width-600 mx-auto">
                            <Button type="primary" shape="round" size="large" block>Pay Now</Button>
                        </div>
                    </StripeCheckout>
                )
            }
        </>
    )
}
export default BookShow;