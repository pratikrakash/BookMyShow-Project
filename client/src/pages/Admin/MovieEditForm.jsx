import { Button, Col, Form, Input, message, Modal, Row, Select } from "antd";
import { addNewMovie, updateMovie } from "../../api/movieRoutes";
import moment from "moment";
import { useDispatch } from "react-redux";
import { loaderReducers } from "../../slice/LoaderSlice";
function MovieEditForm({ isEditModelOpen, setEditModel, selectedItem, setSelectedItem, formType, setFormType, getAllMovies }) {
    const dispatch = useDispatch();
    if(selectedItem){
        selectedItem.releaseDate=moment(selectedItem.releaseDate).format("YYYY-MM-DD");
    }
    const handleCancel = () => {
        setEditModel(false);
        setSelectedItem(null);
        setFormType(null);
    }
    const onFinishAddOrDelete = async (values) => {
        try {
            dispatch(loaderReducers.showLoader());
            if (formType === "Add Item") {
                const response = await addNewMovie(values);
                if (response.success) {
                    message.success(response.message);
                }
                else {
                    message.error(response.message);
                }
            }
            else if (formType === "Edit Item") {
                const movieId = selectedItem._id;
                const response = await updateMovie({ ...values, movieId })
                if (response.success) {
                    message.success(response.message);
                }
                else {
                    message.error(response.error)
                }
            }
        }
        catch (error) {
            message.error(error);
        }
        finally {
            dispatch(loaderReducers.hideLoader())
            getAllMovies();
            handleCancel();
        }
    }
    return (
        <>
            <Modal
                centered
                title={formType}
                open={isEditModelOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form layout="vertical" initialValues={selectedItem} onFinish={onFinishAddOrDelete}>
                    <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
                        <Col span={24}>
                            <Form.Item
                                label="Movie Name"
                                name="movieName"
                                rules={[{ required: true, message: "Please enter some name" }]}
                            >
                                <Input placeholder="Enter movie Name"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[{ required: true, message: "Please enter sdescription" }]}
                            >
                                <Input placeholder="Enter description"></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
                        <Col span={8}>
                            <Form.Item
                                label="Duration"
                                name="duration"
                                rules={[{ required: true, message: "enter movie duration" }]}
                            >
                                <Input placeholder="Enter duration"></Input>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Language"
                                name="language"
                                rules={[{ required: true, message: "Select language" }]}
                            >
                                <Select
                                    placeholder="Select Language"
                                    options={[
                                        { value: "English", label: "English" },
                                        { value: "Hindi", label: "Hindi" },
                                        { value: "Punjabi", label: "Punjabi" },
                                        { value: "Telugu", label: "Telugu" },
                                        { value: "Bengali", label: "Bengali" },
                                        { value: "German", label: "German" },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="Release date"
                                name="releaseDate"
                                rules={[{ required: true, message: "Mention movie release date" }]}
                            >
                                <Input type="date"></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={{ xs: 6, sm: 10, md: 12, lg: 16 }}>
                        <Col span={8}>
                            <Form.Item
                                label="Genre"
                                name="genre"
                                rules={[{ required: true, message: "Select genre" }]}
                            >
                                <Select
                                    placeholder="Select Movie"
                                    options={[
                                        { value: "Action", label: "Action" },
                                        { value: "Comedy", label: "Comedy" },
                                        { value: "Horror", label: "Horror" },
                                        { value: "Love", label: "Love" },
                                        { value: "Patriot", label: "Patriot" },
                                        { value: "Bhakti", label: "Bhakti" },
                                        { value: "Thriller", label: "Thriller" },
                                        { value: "Mystery", label: "Mystery" },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <Form.Item
                                label="Poster URL"
                                name="poster"
                                rules={[{ required: true, message: "Provide Poster URL" }]}
                            >
                                <Input placeholder="Enter poster url"></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button
                            block
                            type="primary"
                            htmlType="submit"
                        >
                            submit
                        </Button>
                        <Button className="mt-3" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
export default MovieEditForm;