import { Form, Input, Button, message, Radio } from "antd";
import { Link } from "react-router-dom";
import "../../index.css";
import { createNewUser } from "../../api/userRoutes";
import { useNavigate } from "react-router-dom";
function Register() {
    const navigate = useNavigate();
    const onClickRegister = async (values) => {
        try {
            const response = await createNewUser(values);
            if (response.success) {
                message.success(response.message);
                navigate("/login");
            }
            else {
                message.error(response.message);
            }
        }
        catch (error) {
            message.error(error);
        }
    }
    return (
        <>
            <header className="App-header">
                <main className="main-area mw-500 text-center px-3">
                    <section>
                        <h1>Sign Up to start booking movies</h1>
                    </section>
                    <section>
                        <Form layout="vertical" onFinish={onClickRegister}>
                            <Form.Item
                                label="Name"
                                name="name"
                                htmlFor="name"
                                className="d-block"
                                rules={[{ required: true, message: "Name is required" }]}
                            >
                                <Input id="name" type="text" placeholder="Enter your name">
                                </Input>
                            </Form.Item>
                            <Form.Item
                                label="Email"
                                name="email"
                                htmlFor="email"
                                className="d-block"
                                rules={[{ required: true, message: "Email is required" }]}
                            >
                                <Input id="email" type="text" placeholder="Enter your Email">
                                </Input>
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                name="password"
                                htmlFor="password"
                                className="d-block"
                                rules={[{ required: true, message: "Password is required" }]}
                            >
                                <Input id="password" type="password" placeholder="Enter your password">
                                </Input>
                            </Form.Item>
                            <Form.Item
                                label="Register as a partner?"
                                name="role"
                                htmlFor="role"
                                className="d-block text-center"
                                rules={[{ required: true, message: "Role is required" }]}
                            >
                                <div className="d-flex justify-content-start">
                                    <Radio.Group name="radiogroup" className="flex-start">
                                        <Radio value={"partner"}>Yes</Radio>
                                        <Radio value={"user"}>No</Radio>
                                    </Radio.Group>
                                </div>
                            </Form.Item>
                            <Button type="primary" block htmlType="submit">Register</Button>
                        </Form>
                    </section>
                    <section>
                        <p>Already a user? <Link to="/login">Sign In here!</Link></p>
                    </section>
                </main>
            </header>
        </>
    )
}
export default Register;