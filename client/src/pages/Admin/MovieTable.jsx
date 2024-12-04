import { Button, message, Table } from "antd";
import { EditOutlined,DeleteOutlined } from "@ant-design/icons";
import { useEffect,useState } from "react";
import { getAllMovieInStore } from "../../api/movieRoutes";
import MovieEditForm from "./MovieEditForm";
import DeleteMovieModel from "./DeleteMovieModel";
import moment from "moment";
import { useDispatch } from "react-redux";
import { loaderReducers } from "../../slice/LoaderSlice";
function MovieTable(){
    const [allMovies,setAllMovies] = useState([]);
    const [isEditModelOpen, setEditModel] = useState(false);
    const [isDeleteModelOpen, setDeleteModel] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [formType, setFormType] = useState(null);
    const dispatch = useDispatch();
    const getAllMovies = async()=>{
        try{
            dispatch(loaderReducers.showLoader());
            const response  = await getAllMovieInStore();
            if(response.success){
                setAllMovies(response.data);
            }
        }
        catch(error){
            message.error(error);
        }
        finally{
            dispatch(loaderReducers.hideLoader());
        }
    }
    const columns = [
        {
            key:"poster",
            title:"Poster",
            dataIndex:"poster",
            render:(text,data)=>{
                return(
                    <img width="75" style={{objectFit:"cover"}}src={data.poster}/>
                )
            }
        },
        {
            key:"movieName",
            title:"Movie-Name",
            dataIndex:"movieName",
        },
        {
            key:"description",
            title:"Description",
            dataIndex:"description"
        },
        {
            key:"genre",
            title:"Genre",
            dataIndex:"genre"
        },
        {
            key:"language",
            title:"Language",
            dataIndex:"language"
        },
        {
            key:"duration",
            title:"Duration",
            dataIndex:"duration",
            render:(text)=>{
                return `${text} mins`
            }
        },
        {
            key:"releaseDate",
            title:"Release Date",
            dataIndex:"releaseDate",
            render:(_,data)=>{
                return moment(data.releaseDate).format("DD-MM-YYYY")
            }
        },
        {
            key:"action",
            title:"Action",
            render:(_,data)=>{
                return(
                    <>
                        <Button onClick={()=>{
                            setEditModel(true);
                            setSelectedItem(data);
                            setFormType("Edit Item");
                        }}><EditOutlined /></Button>
                        <Button onClick={()=>{
                            setDeleteModel(true);
                            setSelectedItem(data);
                        }}><DeleteOutlined /></Button> 
                    </>
                )
            }
        }
    ]
    useEffect(()=>{
        getAllMovies();        
    },[])
    return (
        <>
            <div className="d-flex justify-content-end">
                <Button onClick={()=>{
                    setEditModel(true);
                    setFormType("Add Item");
                }}>
                    Add Movie
                </Button>
            </div>
            <Table dataSource={allMovies} columns={columns}/>
            {
                isEditModelOpen && <MovieEditForm isEditModelOpen={isEditModelOpen} setEditModel={setEditModel} selectedItem={selectedItem} setSelectedItem={setSelectedItem} formType={formType} setFormType={setFormType} getAllMovies={getAllMovies}/>
            }
            {
                isDeleteModelOpen && <DeleteMovieModel isDeleteModelOpen={isDeleteModelOpen} setDeleteModel={setDeleteModel} selectedItem={selectedItem} setSelectedItem={setSelectedItem} getAllMovies={getAllMovies}/>
            }
        </>
    )
}
export default MovieTable;