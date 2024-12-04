import { message, Modal } from "antd";
import { deleteSelectedMovie } from "../../api/movieRoutes";
import { useDispatch } from "react-redux";
import { loaderReducers } from "../../slice/LoaderSlice";
function DeleteMovieModel({isDeleteModelOpen,setDeleteModel,selectedItem, setSelectedItem,getAllMovies}){
    const dispatch = useDispatch();
    const onCancelDelete = () =>{
        setDeleteModel(false);
        setSelectedItem(null);
    }
    const onClickOkDelete = async()=>{
        try{
            dispatch(loaderReducers.showLoader());
            const movieId = selectedItem._id;
            const response = await deleteSelectedMovie(movieId);
            if(response.success){
                message.success(response.message);
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
            setDeleteModel(false);
            setSelectedItem(null);
            getAllMovies();
        }
    }
    return (
        <>
            <Modal
                title="Delete Movie?"
                open={isDeleteModelOpen}
                onCancel={onCancelDelete}
                onOk={onClickOkDelete}
            >
                <p className="pt-3 fs-18"pt-3 fs-18>Are you sure you want to delete this movie?</p>
                <p className="pb-3 fs-18">This action can't be undone and you will lose the data.</p>
            </Modal>
        </>
    )
}
export default DeleteMovieModel; 
