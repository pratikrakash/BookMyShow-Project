import { useEffect, useState } from "react";
import { getAllMovieInStore } from "../../api/movieRoutes";
import { message, Row, Col, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loaderReducers } from "../../slice/LoaderSlice";
import moment from "moment";

function Home() {
    const [allMovies, setAllMovies] = useState([]);
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSearchTextChange = (value) => {
        setSearchText(value);
    }
    const getAllMovies = async () => {
        try {
            dispatch(loaderReducers.showLoader());
            const response = await getAllMovieInStore();
            const message = response?.message;
            if (response.success) {
                setAllMovies(response.data);
            }
            else if (message === "Invalid token" || message === "Expired/Invalid token") {
                navigate("/login");
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
        getAllMovies();
    }, [])
    return (
        <>
            <Row className="justify-content-center" style={{ padding: "20px 15px 20px 0px" }}>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <Input placeholder="Enter movie to search" onChange={(e) => { handleSearchTextChange(e.target.value) }}>
                    </Input>
                </Col>
            </Row>
            <Row className="justify-content-center" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                {
                    (searchText.length > 0) ? (
                        allMovies.filter((movie) => (movie.movieName.toLowerCase()).includes(searchText.toLowerCase())).map((movie) => {
                            return (
                                <Col key={movie._id}>
                                    <div onClick={() => {
                                        navigate(`/movie/${movie._id}?date=${moment().format("YYYY-MM-DD")}`)
                                    }}>
                                        <img src={movie.poster} alt="Movie Poster" width={200} height={300} style={{ borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", transition: "transform 0.3s", objectFit: "contain" }} />
                                        <h3 className="cursor-pointer">{movie.movieName}</h3>
                                    </div>
                                </Col>
                            )
                        })
                    ) :
                        (
                            (allMovies.length > 0) && allMovies.map((movie) => {
                                return (
                                    <Col key={movie._id}>
                                        <div onClick={() => {
                                            navigate(`/movie/${movie._id}?date=${moment().format("YYYY-MM-DD")}`)
                                        }}>
                                            <img src={movie.poster} alt="Movie Poster" width={200} height={300} style={{ borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", transition: "transform 0.3s", objectFit: "contain" }} />
                                            <h3 className="cursor-pointer">{movie.movieName}</h3>
                                        </div>
                                    </Col>
                                )

                            })
                        )
                }
                {/* {
                    (allMovies.length > 0) && allMovies.map((movie) => {
                        return (
                            <Col key={movie._id}>
                                <div onClick={()=>{
                                    navigate(`/movie/${movie._id}?date=${moment().format("YYYY-MM-DD")}`)
                                }}>
                                    <img src={movie.poster} alt="Movie Poster" width={200} height={300} style={{ borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", transition: "transform 0.3s", objectFit: "contain" }} />
                                    <h3 className="cursor-pointer">{movie.movieName}</h3>
                                </div>
                            </Col>
                        )

                    })
                } */}
            </Row>
        </>
    )
}
export default Home;