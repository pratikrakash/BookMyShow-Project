import {createSlice, current} from "@reduxjs/toolkit";
const UserSlice = createSlice({
    name:"user",
    initialState:{
        currentUser:{}
    },
    reducers:{
        setCurrentUser:(state,actions)=>{
            state.currentUser = actions.payload;
        }
    }
});
export default UserSlice.reducer;
export const userReducers = UserSlice.actions;