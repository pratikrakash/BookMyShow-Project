import {Form,Input,Button, message} from "antd";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { generateOtp } from "../api/userRoutes";
function ForgetPassword(){
    const navigate = useNavigate();
    const onSendOTP = async(values)=>{
        try{
            const response = await generateOtp(values);
            if(response.success){
                message.success(response.message);
                navigate("/resetPassword");
            }
            else if(response.message === "Please use the otp send over email"){
                message.error(response.message);
                navigate("/resetPassword");
            }
        }
        catch(error){
            message.error(error.message);
        }
    }
    useEffect(()=>{
        if(localStorage.getItem("tokenForBMS")){
            navigate("/");
        }
    },[])
    return (
        <>
            <header className="App-header">
                <main className="main-area mw-500 text-center px-3">
                    <section className="left-section">
                        <h1>Forget Password</h1>
                    </section>
                    <section className="right-section">
                        <Form layout="vertical" onFinish={onSendOTP}>
                            <Form.Item
                                label="Email"
                                name="email"
                                htmlFor="email"
                                rules={[{required:true,message:"Email is required"}]}
                            >
                                <Input id="email" placeholder="Enter your email"></Input>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">Send OTP</Button>
                            </Form.Item>
                        </Form>
                    </section>
                </main>
            </header>
        </>
    )
}
export default ForgetPassword;