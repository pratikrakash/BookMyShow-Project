import { axiosInstance } from ".";
export const getAllTheatres = async()=>{
    try{
        const response = await axiosInstance.get("/theatre/getAllTheatres");
        return response.data;
    }
    catch(error){

    }
}
export const getAllTheatresByOwner = async () => {
    try {
        const response = await axiosInstance.get("/theatre/getTheatresByOwner");
        return response.data;
    }
    catch (error) {
        return error;
    }
}
export const deleteTheatre = async(theatreId)=>{
    try{
        const response  = await axiosInstance.delete(`/theatre/deleteTheatre/${theatreId}`);
        return response.data;
    }
    catch(error){
        return error;
    }
}
export const addTheatre = async(payload)=>{
    try{
        const response = await axiosInstance.post("/theatre/addNewTheatre",payload);
        return response.data;
    }
    catch(error){
        return error;
    }
}
export const updateTheatre = async(payload)=>{
    try{
        const response = await axiosInstance.patch("/theatre/updateTheatre",payload);
        return response.data;
    }
    catch(error){
        return error;
    }
}