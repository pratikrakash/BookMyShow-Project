import { useEffect, useState } from "react";
import { getMovieById } from "../api/movieRoutes";
import { useParams } from "react-router-dom";
import { Input, message, Row, Col, Divider } from "antd";
import moment from "moment";
import { CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getAllTheatreForMovie } from "../api/showRoutes";
import { useDispatch } from "react-redux";
import { loaderReducers } from "../slice/LoaderSlice";

function SingleMovie() {
    const { movieId } = useParams();
    const [movieDetails, setMovieDetails] = useState([]);
    const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
    const [shows, setShows] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const onChangeDate = (event) => {
        setDate(event.target.value);
        navigate(`/movie/${movieId}?${event.target.value}`)
    }
    const getMovieDetails = async () => {
        try {
            dispatch(loaderReducers.showLoader());
            const response = await getMovieById(movieId);
            if (response.success) {
                setMovieDetails(response.data);
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
    const getAllShows = async () => {
        try {
            dispatch(loaderReducers.showLoader());
            const response = await getAllTheatreForMovie(movieId, date);
            if (response.success) {
                setShows(response.data);
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
    useEffect(() => {
        getMovieDetails();
    }, []);
    useEffect(() => {
        getAllShows();
    }, [date]);
    return (
        <div className="inner-container" style={{ paddingTop: "20px" }}>
            {
                movieDetails && (
                    <div className="d-flex single-movie-div">
                        <div className="flex-Shrink-0 me-3 single-movie-img">
                            <img src={movieDetails.poster} width={150} alt="Movie Poster" />
                        </div>
                        <div className="w-100">
                            <h1 className="mt-0">{movieDetails.movieName}</h1>
                            <p className="movie-data">
                                Language:<span>{movieDetails.language}</span>
                            </p>
                            <p className="movie-data">
                                Genre:<span>{movieDetails.genre}</span>
                            </p>
                            <p className="movie-data">
                                Release Date: <span>{moment(movieDetails.releaseDate).format("YYYY-MM-DD")}</span>
                            </p>
                            <p className="movie-data">
                                Duration: <span>{movieDetails.duration} Minutes</span>
                            </p>
                            <hr />
                            <div className="d-flex flex-column-mob align-items-center mt-3">
                                <label className="me-3 flex-shrink-0">Choose Date:</label>
                                <Input type="date" className="max-width-300 mt-8px-mob" value={date} min={moment().format("YYYY-MM-DD")} prefix={<CalendarOutlined />} onChange={onChangeDate} />
                            </div>
                        </div>
                    </div>
                )
            }
            {
                (shows.length>0) && (
                    <div className="theatre-wrapper mt-3 pt-3">
                        <h2>Shows</h2>
                        {
                            shows.map((show) => {
                                return (
                                    <div key={show._id}>
                                        <Row key={show._id} gutter={24}>
                                            <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                                                <h3>{show.name}</h3>
                                                <p>{show.address}</p>
                                            </Col>
                                            <Col xs={{ span: 24 }} lg={{ span: 16 }}>
                                                <ul className="show-ul">
                                                    {
                                                        (show.shows.sort((a,b)=>{
                                                            moment(a.time,"HH:mm") - moment(b.time,"HH:mm")
                                                        })).map((singleShow)=>{
                                                            return (
                                                                <li key={singleShow._id} onClick={()=>{
                                                                    navigate(`/book-show/${singleShow._id}`)
                                                                }}>{moment(singleShow.time,"HH:mm").format("hh:mm a")}</li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </Col>
                                        </Row>
                                        <Divider/>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
        </div>
    )
}
export default SingleMovie;