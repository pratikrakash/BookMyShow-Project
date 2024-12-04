import { Col, Row, Form, Modal, Input, Button, message } from "antd";
import { addTheatre, updateTheatre } from "../../api/theatreRoutes";
import {useSelector} from "react-redux"

function EditAndAddTheatreModal({ isEditOrAddModalOpen, setEditOrAddModal, selectedTheatre, setSelectedTheatre, getAllTheatres, formType, setFormType }) {
    const {currentUser} = useSelector((store)=>{
        return store.User;
    })
    console.log(currentUser);
    
    const onCancel = () => {
        setEditOrAddModal(false);
        setSelectedTheatre(null);
        setFormType("");
    }
    const onSubmitAddorDelete = async(values)=>{
        try{
            if(formType === "Add Theatre"){
                const payload = {...values,owner:currentUser._id}               
                const response = await addTheatre(payload);
                if(response.success){
                    message.success(response.message);
                }
                else{
                    message.error(response.message);
                }
            }
            else if(formType === "Edit Theatre"){
                const response = await updateTheatre({theatreId:selectedTheatre._id,...values});
                if(response.success){
                    message.success(response.message);
                }
                else{
                    message.error(response.message);
                }
            }
        }
        catch(error){
            message.error(error);
        }
        finally{
            setFormType("");
            setSelectedTheatre(null);
            setEditOrAddModal(false);
            getAllTheatres();
        }
    }
    return (
        <>
            <Modal centered title={formType} open={isEditOrAddModalOpen} footer={null} onCancel={onCancel}>
                <Form layout="vertical" initialValues={selectedTheatre} onFinish={onSubmitAddorDelete}>
                    <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
                        <Col span={24}>
                            <Form.Item label="Theatre Name" name="name" rules={[{ required: true, message: "Theatre name is required" }]}>
                                <Input placeholder="Enter Theatre Name"></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
                        <Col span={24}>
                            <Form.Item label="Theatre Address" name="address" rules={[{ required: true, message: "Theatre address is required" }]}>
                                <Input placeholder="Enter Theatre Address"></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
                        <Col span={12}>
                            <Form.Item label="Phone No." name="phone" rules={[{ required: true, message: "Phone No. is required" }]}>
                                <Input placeholder="Enter Phone No."></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Email" name="email" rules={[{ required: true, message: "Email is required" }]}>
                                <Input placeholder="Enter Email"></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button block type="primary" htmlType="submit">
                            submit
                        </Button>
                        <Button onClick={onCancel}>
                            cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
export default EditAndAddTheatreModal;