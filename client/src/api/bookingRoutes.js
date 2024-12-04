import { axiosInstance } from ".";

export const makePayement = async(payload)=>{
    try{
        const response = await axiosInstance.post("/bookings/makePayment",payload);
        return response.data;
    }
    catch(error){
        return error;
    }
}
export const bookSeats = async(payload)=>{
    try{
        const response = await axiosInstance.post("/bookings/bookSeats",payload);
        return response.data;
    }
    catch(error){
        return error;
    }
}
export const getAllSeatsForUser = async()=>{
    try{
        const response = await axiosInstance.get(`/bookings/getAllBookingsForUser`);
        return response.data;
    }
    catch(error){
        return error;
    }
}
export const makePayementAndBookSeats = async(payload)=>{
    try{
        const response = await axiosInstance.post("/bookings/makePayementAndBookSeats", payload);
        return response.data;
    }
    catch(error){
        return error;
    }
}