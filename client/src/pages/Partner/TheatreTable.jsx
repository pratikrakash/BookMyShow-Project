import { Button, message, Table } from "antd";
import { useEffect, useState } from "react";
import { getAllTheatresByOwner } from "../../api/theatreRoutes";
import { EditOutlined,DeleteOutlined } from "@ant-design/icons";
import DeleteTheatreModal from "./DeleteTheatreModal";
import EditAndAddTheatreModal from "./EditAndAddTheatreModal";
import ShowModel from "./ShowModel";
import { useDispatch } from "react-redux";
import { loaderReducers } from "../../slice/LoaderSlice";

function TheatreTable(){
    const [theatreList,setAllTheatreList] = useState([]);
    const [isDeleteModalOpen,setDeleteModel] = useState(false);
    const [isEditOrAddModalOpen, setEditOrAddModal] = useState(false);
    const [isShowModelOpen, setShowModel] = useState(false);
    const [selectedTheatre, setSelectedTheatre] = useState(null);
    const [formType,setFormType] = useState("");
    const dispatch = useDispatch();
    const getAllTheatres = async()=>{
        try{
            dispatch(loaderReducers.showLoader());
            const response = await getAllTheatresByOwner();
            if(response.success){
                setAllTheatreList(
                    response.data.map((theatre)=>{
                        return {...theatre,key:`Theatre${theatre._id}`}
                    })
                )
            }
            else{
                message.error(response.message);
            }
        }
        catch(error){
            message.error(error.message);
        }
        finally{
            dispatch(loaderReducers.hideLoader());
        }
    }
    useEffect(()=>{
        getAllTheatres();
    },[]);
    const columns = [
        {
            title:"Theatre Name",
            dataIndex:"name"
        },
        {
            title:"Address",
            dataIndex:"address"
        },
        {
            title:"Phone No.",
            dataIndex:"phone"
        },
        {
            title:"Email",
            dataIndex:"email"
        },
        {
            title:"Actions",
            render:(_,data)=>{
                return (
                    <>
                        <Button onClick={()=>{
                            setEditOrAddModal(true);
                            setSelectedTheatre(data);
                            setFormType("Edit Theatre");
                        }}><EditOutlined/></Button>
                        <Button onClick={()=>{
                            setDeleteModel(true);
                            setSelectedTheatre(data);
                        }}><DeleteOutlined/></Button>
                        {
                            data.isActive && (
                                <Button onClick={()=>{
                                    setShowModel(true);
                                    setSelectedTheatre(data);
                                }}>shows</Button>
                            )
                        }
                    </>
                )
            }
        }
    ]
    return (
        <>
            <div className="d-flex justify-content-end">
                <Button onClick={()=>{
                    setFormType("Add Theatre");
                    setEditOrAddModal(true);
                }}>Add Theatre</Button>
            </div>
            <Table dataSource={theatreList} columns={columns}></Table>
            {
                isEditOrAddModalOpen && <EditAndAddTheatreModal isEditOrAddModalOpen={isEditOrAddModalOpen} setEditOrAddModal={setEditOrAddModal} selectedTheatre={selectedTheatre} setSelectedTheatre={setSelectedTheatre} getAllTheatres={getAllTheatres} formType={formType} setFormType={setFormType}/>
            }
            {
                isDeleteModalOpen && <DeleteTheatreModal isDeleteModalOpen={isDeleteModalOpen} setDeleteModel={setDeleteModel} selectedTheatre={selectedTheatre} setSelectedTheatre={setSelectedTheatre} getAllTheatres={getAllTheatres}/>
            }
            {
                isShowModelOpen && <ShowModel isShowModelOpen={isShowModelOpen} setShowModel={setShowModel} selectedTheatre={selectedTheatre} setSelectedTheatre={setSelectedTheatre}/>
            }
        </>
    )
}
export default TheatreTable;