import { axiosInstance } from ".";
export const getAllMovieInStore= async()=>{
    try{
        const response = await axiosInstance.get("/movies/getAllMovies");
        return response.data;
    }
    catch(error){
        return error;
    }
}
export const addNewMovie = async(payload)=>{
    try{
        const response = await axiosInstance.post("/movies/addNewMovie",payload);
        return response.data;
    }
    catch(error){
        return error;
    }
}
export const updateMovie = async(payload)=>{
    try{
        const response = await axiosInstance.patch("/movies/updateMovieDetails",payload);
        return response.data;
    }
    catch(error){
        return error;
    }
}
export const deleteSelectedMovie = async(movieId)=>{
    try{
        const response = await axiosInstance.delete(`/movies/deleteMovie/${movieId}`);
        return response.data;
    }
    catch(error){
        return error;
    }
}
export const getMovieById = async(movieId)=>{
    try{
        const response = await axiosInstance.get(`movies/getMovieById/${movieId}`);
        return response.data;
    }
    catch(error){
        return error;
    }
}