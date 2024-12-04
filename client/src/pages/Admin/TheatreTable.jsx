import { useEffect, useState } from "react"
import { getAllTheatres, updateTheatre } from "../../api/theatreRoutes";
import { Button, message,Table } from "antd";

function TheatreTable(){
    const [allTheatres, setAllTheatres] = useState([]);
    const getAllTheatreList = async()=>{
        try{
            const response = await getAllTheatres();
            setAllTheatres(
                response.data.map((theatre)=>{
                    return {...theatre,key:`Theatre-${theatre._id}`}
                })
            )
        }
        catch(error){
            message.error("Failed to fetch theatre List")
        }
    }
    const updateStatus = async(theatreId,status)=>{
        try{
            const response = await updateTheatre({theatreId,isActive:status});
            if(response.success){
                message.success(response.message);
            }
            else{
                message.error(response.message)
            }
        }
        catch(error){
            message.error(error);
        }
        finally{
            getAllTheatreList();
        }
    }
    const columns = [
        {
            title:"Theatre Name",
            dataIndex:"name"
        },
        {
            title:"Theatre Address",
            dataIndex:"address"
        },
        {
            title:"Email",
            dataIndex:"email"
        },
        {
            title:"Phone No.",
            dataIndex:"phone"
        },{
            title:"status",
            dataIndex:"isActive",
            render:(_,data)=>{
                return (
                    data.isActive ? (
                        "Active"
                    ):(
                        "Pending/Blocked"
                    )
                )
            }
        },{
            title:"Action",
            render:(_,data)=>{
                return(
                    !data.isActive ? (
                        <>
                            <Button onClick={()=>{updateStatus(data._id,true)}}>Approve</Button>
                            <Button>Reject</Button>
                        </>
                    ):(
                        <>
                            <Button onClick={()=>{updateStatus(data._id,false)}}>Block</Button>
                        </>
                    )
                )
            }
        }
    ]
    useEffect(()=>{
        getAllTheatreList();
    },[])
    return (
        <>
            <Table dataSource={allTheatres} columns={columns}/>
        </>
    )
}
export default TheatreTable