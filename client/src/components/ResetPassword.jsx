import {Form,Input,Button, message} from "antd";
import { resetPassword } from "../api/userRoutes";
import { useNavigate } from "react-router-dom";
function ResetPassword(){
    const navigate = useNavigate();
    const onResetPassword = async(values)=>{
        try{
            const response = await resetPassword(values);
            if(response.success){
                message.success(response.message);
                navigate("/login");
            }
            else if(response.message === "OTP is expired"){
                message.error(response.message);
                navigate("/forget")
            }
            else{
                message.error(response.message);
            }
        }
        catch(error){
            message.error(error.message);
        }
    }
    return (
        <>
            <header className="App-header">
                <main className="main-area mw-500 text-center px-3">
                    <section className="left-section">
                        <h1>Reset your password</h1>
                    </section>
                    <section className="right-section">
                        <Form layout="vertical" onFinish={onResetPassword}>
                            <Form.Item
                                label="OTP"
                                name="otp"
                                htmlFor="otp"
                                rules={[{required:true,message:"OTP is required"}]}
                            >
                                <Input id="otp" placeholder="Enter OTP here"></Input>
                            </Form.Item>
                            <Form.Item
                                label="New Password"
                                name="password"
                                htmlFor="password"
                                rules={[{required:true,message:"Please enter new password"}]}
                            >
                                <Input id="password" placeholder="Enter your new password"></Input>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">Reset</Button>
                            </Form.Item>

                        </Form>
                    </section>
                </main>
            </header>
        </>
    )
}
export default ResetPassword;