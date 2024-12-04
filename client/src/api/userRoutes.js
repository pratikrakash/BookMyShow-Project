import { axiosInstance } from ".";
export const createNewUser = async(payload)=>{
    try{
        const response = await axiosInstance.post("/users/createNewUser",payload);
        return response.data;
    }
    catch(error){
        return error;
    }
}
export const loginUser = async(payload)=>{
    try{
        const response = await axiosInstance.post("/users/loginUser",payload);
        return response.data;
    }
    catch(error){
        return error;
    }
}
export const getCurrentUserDetails = async()=>{
    try{
        const response = await axiosInstance.get("/users/getCurrentUserDetails");
        return response.data;
    }
    catch(error){
        return error;
    }
}
export const generateOtp = async(payload)=>{
    try{
        const response = await axiosInstance.post("/users/generateOtp",payload);
        return response.data;
    }
    catch(error){
        return error;
    }
}
export const resetPassword = async(payload)=>{
    try{
        const response = await axiosInstance.post("/users/resetPassword",payload);
        return response.data;
    }
    catch(error){
        return error;
    }
}