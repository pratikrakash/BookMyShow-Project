import { Layout, Menu, message } from "antd";
import { Header } from "antd/es/layout/layout";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HomeOutlined, UserOutlined, ProfileOutlined, LogoutOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { userReducers } from "../../slice/UserSlice";
import { getCurrentUserDetails } from "../../api/userRoutes";
import { loaderReducers } from "../../slice/LoaderSlice";
function AppHeader({ children }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((store) => {
        return store.User.currentUser;
    });
    const navItems = [
        {
            key: "home",
            label: (
                <span onClick={() => { navigate("/",{replace:true}) }}>Home</span>
            ),
            icon: <HomeOutlined />
        },
        {
            key: "profile",
            label: user && user.name,
            icon: <UserOutlined />,
            children: [
                {
                    label: (<span onClick={() => {
                        if (user.role === "partner") {
                            navigate("/partner");
                        }
                        else if (user.role === "admin") {
                            navigate("/admin");
                        }
                        else {
                            navigate("/profile");
                        }
                    }}>My Profile</span>),
                    icon: <ProfileOutlined />
                },
                {
                    label: (
                        <span onClick={()=>{
                            localStorage.removeItem("tokenForBms");
                            navigate("/login");
                        }}>Logout</span>
                    ),
                    icon: <LogoutOutlined />
                }
            ]
        }
    ]
    const getUserDetails = async () => {
        try {
            dispatch(loaderReducers.showLoader());
            const response = await getCurrentUserDetails();
            if (response.success) {
                dispatch(userReducers.setCurrentUser(response.userDetails));
            }
            else if(response.message === "Invalid Token" || response.message === "Expired/Invalid token" ){
                localStorage.removeItem("tokenForBms");
                navigate("/login");
            }
        }
        catch (error) {
            message.error(error);
        }
        finally{
            dispatch(loaderReducers.hideLoader());
        }
    }
    useEffect(() => {
        if(!(localStorage.getItem("tokenForBms"))){
            navigate("/login");
        }
        else{
            getUserDetails();
        }
    }, []);
    return (
        <>
            {
                user && (<>
                    <Layout>
                        <Header className="d-flex justify-content-between"
                            style={{
                                position: "sticky",
                                top: 0,
                                width: "100%",
                                zIndex: 1,
                                alignItems: "center"
                            }}
                        >
                            <h2 className="text-white m-0"
                                style={{
                                    cursor: "pointer"
                                }}
                                onClick={() => {
                                    navigate("/");
                                }}
                            >Welcome to BookMyShow</h2>
                            <Menu theme="dark" mode="horizontal" items={navItems}></Menu>
                        </Header>
                    </Layout>
                    <div>
                        {children}
                    </div>
                </>)
            }
        </>
    )
}
export default AppHeader