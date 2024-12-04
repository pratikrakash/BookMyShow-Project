import {
    Routes,
    Route
} from "react-router-dom";
import Home from "../components/home/Home";
import Login from "../components/login/Login";
import Register from "../components/register/Register";
import AppHeader from "../components/appHeader/AppHeader";
import Partner from "../pages/Partner/Partner";
import Admin from "../pages/Admin/Admin";
import Profile from "../pages/Profile/Profile";
import SingleMovie from "../components/SingleMovie";
import BookShow from "../components/BookShow";
import ForgetPassword from "../components/forgetPassword";
import ResetPassword from "../components/ResetPassword";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAxiosInterceptors } from "../api";
import { useSelector } from "react-redux";
function AppRoutes() {
    const navigate = useNavigate();
    const { isLoading } = useSelector((store) => {
        return store.Loader;
    });
    useEffect(() => {
        setAxiosInterceptors(navigate);
    }, [navigate]);
    return (
        <>
            {
                isLoading && (
                    <div className="loader-container">
                        <div className="loader"></div>
                    </div>
                )
            }
            <Routes>
                <Route path="/" element={<AppHeader><Home /></AppHeader>}></Route>
                <Route path="/partner" element={<AppHeader><Partner /></AppHeader>}></Route>
                <Route path="/admin" element={<AppHeader><Admin /></AppHeader>}></Route>
                <Route path="/profile" element={<AppHeader><Profile /></AppHeader>}></Route>
                <Route path="/movie/:movieId" element={<AppHeader><SingleMovie /></AppHeader>}></Route>
                <Route path="/book-show/:showId" element={<AppHeader><BookShow /></AppHeader>}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Register />}></Route>
                <Route path="/forget" element={<ForgetPassword />}></Route>
                <Route path="/resetPassword" element={<ResetPassword />}></Route>
            </Routes>
        </>
    )
}
export default AppRoutes;