import axios from "axios";
import { useNavigate } from "react-router-dom";
export const axiosInstance = axios.create({
    baseURL:"/bms",
    headers:"application/json"
})
axiosInstance.interceptors.request.use((config)=>{
    const token = localStorage.getItem("tokenForBms");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},(error)=>{
    console.log("error occured while setting token header");
    return Promise.reject(error);   
})

const handleExpiredToken = (navigate)=>{
    alert("Session timed-out. You need to login again!");
    localStorage.removeItem("tokenForBms");
    navigate("/login");
}

export const setAxiosInterceptors = (navigate)=>{
    axiosInstance.interceptors.response.use((response)=>{
        const message = response?.data?.message;
        if(message === "Invalid token" || message === "Expired/Invalid token"){
            handleExpiredToken(navigate);
        }
        return response;
    },(error)=>{
        if(error.response?.status === 401){
            handleExpiredToken();
        }
        return Promise.reject(error);
    })  
}