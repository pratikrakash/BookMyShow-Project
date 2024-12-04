import { axiosInstance } from ".";
export const createNewShow = async(payload)=>{
    try{
        const response = await axiosInstance.post("/shows/createNewShow",payload);
        return response.data;
    }
    catch(error){
        return error
    }
}
export const updateShow = async(payload, showId)=>{
    try{
        const response = await axiosInstance.patch(`/shows/updateShowDetails/${showId}`,payload);
        return response.data;
    }
    catch(error){
        return error;
    }
}
export const deleteShow = async(showId)=>{
    try{
        const response = await axiosInstance.delete(`/shows/deleteShow/${showId}`);
        return response.data;
    }
    catch(error){
        return error;
    }
}
export const getShowsByTheatre = async(showId)=>{
    try{
        const response = await axiosInstance.get(`/shows/getAllShowsByTheatre/${showId}`);
        return response.data;
    }
    catch(error){
        return error;
    }
}
export const getAllTheatreForMovie = async(movieId,date)=>{
    try{
        const response = await axiosInstance.get(`/shows/getAllTheatreByMovie/${movieId}/date/${date}`);
        return response.data;
    }
    catch(error){
        return error;
    }
}
export const getShowById = async(showId)=>{
    try{
        const response = await axiosInstance.get(`/shows/getShowById/${showId}`);
        return response.data;
    }
    catch(error){
        return error;
    }
}