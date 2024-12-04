import { Button, Form, message, Modal, Table, Row, Col, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { createNewShow, deleteShow, getShowsByTheatre, updateShow } from "../../api/showRoutes";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import { getAllMovieInStore } from "../../api/movieRoutes";
import { useDispatch } from "react-redux";
import { loaderReducers } from "../../slice/LoaderSlice";

function ShowModel({ isShowModelOpen, setShowModel, selectedTheatre, setSelectedTheatre }) {
    const [showsForTheatre, setShowsForTheatre] = useState([]);
    const [selectedShow, setSelectedShow] = useState(null);
    const [modalView, setModalView] = useState("table");
    const [allMovies, setAllMovies] = useState([]);
    const handleCancel = () => {
        setShowModel(false);
        setSelectedShow(null);
    }
    const getAllMovies = async () => {
        try {
            const response = await getAllMovieInStore();
            if (response.success) {
                setAllMovies(response.data);
            }
            else {
                message.error(response.message);
            }
        }
        catch (error) {
            message.error(error);
        }
    }
    const getAllShowsForSelectedTheatre = async () => {
        try {
            const response = await getShowsByTheatre(selectedTheatre._id);
            if (response.success) {
                setShowsForTheatre(response.data);
            }
            else {
                message.error(response.message);
            }
        }
        catch (error) {
            message.error(error);
        }
    }
    const onClickSubmit = async(values)=>{        
        try{
            if(modalView === "Add"){
                const response = await createNewShow({...values,theatre:selectedTheatre._id});
                if(response.success){
                    message.success(response.message);
                }
                else{
                    message.error(response.message);
                }                
            }
            else if(modalView === "Edit"){
                const response = await updateShow({...values,theatre:selectedTheatre._id},selectedShow._id);
                if(response.success){
                    message.success(response.message);
                }
                else{
                    message.error(response.message);
                }
            }
        }
        catch(error){
            message.error(error.message);
        }
        finally{
            getAllShowsForSelectedTheatre();
            setModalView("table");
        }
    }
    const handleDelete = async()=>{
        try{
            const response = await deleteShow(selectedShow._id);
            if(response.success){
                message.success(response.message);
            }
            else{
                message.error(response.message);
            }
        }
        catch(error){
            message.error(error.message);
        }
        finally{
            setSelectedShow(null);
            setModalView("table");
            getAllShowsForSelectedTheatre();
        }
    }
    const columns = [
        {
            title: "Show Name",
            dataIndex: "name"
        },
        {
            title: "Show Date",
            dataIndex: "date",
            render: (_, data) => {
                return moment(data.date).format("YYYY-MM-DD")
            }
        }, {
            title: "Show Time",
            dataIndex: "time",
            render: (text) => {
                return moment(text, "HH:mm").format("hh:mm A")
            }
        }, {
            title: "Movie",
            dataIndex: "movie",
            render: (_, data) => {
                return data.movie.movieName
            }
        }, {
            title: "Ticket Price",
            dataIndex: "ticketPrice"
        }, {
            title: "Total Seats",
            dataIndex: "totalSeats"
        }, {
            title: "Available Seats",
            render: (_, data) => {
                return (data.totalSeats - (data.bookedSeats).length)
            }
        }, {
            title: "Actions",
            render: (_, data) => {
                return (
                    <>
                        <Button onClick={() => {
                            setModalView("Edit")
                            setSelectedShow({
                                ...data,
                                date: moment(data.date).format("YYYY-MM-DD"),
                                movie: data.movie._id,
                            });
                        }}><EditOutlined /></Button>
                        <Button onClick={()=>{
                            setModalView("Delete");
                            setSelectedShow(data);
                        }}><DeleteOutlined /></Button>
                    </>
                )
            }
        }
    ]
    useEffect(() => {

        getAllShowsForSelectedTheatre();
        getAllMovies();
    },[]);
    return (
        <>
            <Modal
                centered
                title={selectedTheatre.name}
                open={isShowModelOpen}
                onCancel={handleCancel}
                width={1200}
                footer={null}
            >
                {
                    modalView === "table" && (
                        <>
                            <Button type="primary" onClick={() => {
                                setModalView("Add");
                            }}>Add Show</Button>
                            <Table dataSource={showsForTheatre} columns={columns}></Table>
                        </>
                    )
                }
                {
                    (modalView === "Add" || modalView === "Edit") && (
                        <>
                            <Form
                                layout="vertical"
                                initialValues={modalView === "Edit"? selectedShow:{}}
                                onFinish={onClickSubmit}
                            >
                                <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
                                    <Col span={8}>
                                        <Form.Item label="Name" name="name" rules={[{ required: true, message: "Show name is required" }]}>
                                            <Input placeholder="Enter Show Name"></Input>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="Date" htmlFor="date" name="date" rules={[{ required: true, message: "Date is required" }]}>
                                            <Input id="date" type="date" placeholder="Enter Show Name"></Input>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label="Show Timing" htmlFor="time" name="time" rules={[{ required: true, message: "Time is required" }]}>
                                            <Input id="time" type="time" placeholder="Enter Time"></Input>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
                                    <Col span={12}>
                                        <Form.Item label="Movie Name" htmlFor="movie" name="movie" className="d-block" rules={[{ required: true, message: "Movie Name is Required" }]}>
                                            <Select
                                                id="movie"
                                                name="movie"
                                                placeholder="Select a movie"
                                                options={allMovies.map((movie)=>({
                                                    key:movie._id,
                                                    value:movie._id,
                                                    label:movie.movieName
                                                }))}
                                            ></Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
                                    <Col span={12}>
                                        <Form.Item label="Price" htmlFor="price" name="ticketPrice" rules={[{required:true,message:"Price is required"}]}>
                                            <Input id="price" placeholder="Enter Price"></Input>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Total Seats" htmlFor="seats" name="totalSeats" rules={[{required:true,message:"Total Seats is required"}]}>
                                            <Input id="seats" placeholder="Enter total seats"></Input>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item>
                                    <Button onClick={()=>{
                                        setModalView("table");
                                        setSelectedShow(null);
                                    }}>
                                        Go Back
                                    </Button>
                                    <Button type="primary" htmlType="submit">Submit</Button>
                                </Form.Item>
                            </Form>
                        </>
                    )
                }
                {
                    (modalView === "Delete") && (
                        <>
                            <p className="pt-3 fs-18"pt-3 fs-18>Are you sure you want to delete this show?</p>
                            <p className="pb-3 fs-18">This action can't be undone and you will lose the data.</p>
                            <Button htmlType="submit" onClick={handleDelete} type="primary">Delete</Button>
                            <Button htmlType="submit" onClick={()=>{
                                setModalView("table");
                                setSelectedShow(null);
                            }} type="primary">Cancel</Button>
                        </>
                    )
                }
            </Modal>
        </>
    )
}
export default ShowModel;