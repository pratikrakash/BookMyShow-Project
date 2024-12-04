import {Form,Input,Button, message} from "antd";
import {Link} from "react-router-dom";
import { loginUser } from "../../api/userRoutes";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loaderReducers } from "../../slice/LoaderSlice";
function Login(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(()=>{
        if(localStorage.getItem("tokenForBms")){
            navigate("/");
        }
    },[])
    const onClickLogin = async(values)=>{
        try{
            dispatch(loaderReducers.showLoader());
            const response = await loginUser(values);
            if(response.success){
                message.success(response.message);
                localStorage.setItem("tokenForBms",response.token);
                navigate("/");
            }
            else{
                message.error(response.message);
            }
        }
        catch(error){
            message.error(error);
        }
        finally{
            dispatch(loaderReducers.hideLoader());
        }
    }
    return (
        <>
            <header className="App-header">
                <main className="main-area mw-500 text-center px-3">
                    <section>
                        <h1>Login to Book my show</h1>
                    </section>
                    <section>
                        <Form layout="vertical" onFinish={onClickLogin}>
                            <Form.Item
                                label="Email"
                                name="email"
                                htmlFor="email"
                                rules={[{required:true, message:"E-mail is required"}]}
                            >
                                <Input id="email" type="text" placeholder="Enter your email"></Input>
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                name="password"
                                htmlFor="password"
                                rules={[{required:true,message:"Password is required"}]}
                            >
                                <Input id="password" type="password" placeholder="Enter your password"></Input>
                            </Form.Item>
                            <Button type="primary" block htmlType="submit" style={{ fontSize: "1rem", fontWeight: "600" }}>Login</Button>
                        </Form>
                    </section>
                    <section>
                        <p>New user? <Link to="/register">Register Here!</Link></p>
                    </section>
                    <section>
                        <p>Forgot Password?<Link to="/forget">Click here to change your password</Link></p>
                    </section>
                </main>
            </header>
        </>
    )
}
export default Login;