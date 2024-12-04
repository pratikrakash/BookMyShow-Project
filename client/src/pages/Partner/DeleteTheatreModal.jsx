import { message, Modal } from "antd";
import { deleteTheatre } from "../../api/theatreRoutes";

function DeleteTheatreModal({isDeleteModalOpen,setDeleteModel,selectedTheatre,setSelectedTheatre,getAllTheatres}){
    function handleCancel(){
        setDeleteModel(false);
        setSelectedTheatre(null);
    }
    async function onClickOkDelete(){
        try{
            const response = await deleteTheatre(selectedTheatre._id);
            if(response.success){
                message.success(response.message);
            }
            else{
                message.error(response.error);
            }
        }
        catch(error){
            message.error(error)
        }
        finally{
            setDeleteModel(false);
            setSelectedTheatre(null);
            getAllTheatres();
        }
    }
    return (
        <>
            <Modal
                title="Delete Theatre?"
                open={isDeleteModalOpen}
                onCancel={handleCancel}
                onOk={onClickOkDelete}
            >
                <p className="pt-3 fs-18"pt-3 fs-18>Are you sure you want to delete this movie?</p>
                <p className="pb-3 fs-18">This action can't be undone and you will lose the data.</p>
            </Modal>
        </>
    )
}
export default DeleteTheatreModal;