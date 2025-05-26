
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        data: null,
        isLoggedIn: false
    },
    reducers:{
        login:(action,state)=>{
            state.data = action.payload;
            state.isLoggedIn = true;
        },
        logout:(state)=>{
            state.data = null;
            state.isLoggedIn = false;
        }
    }
})

export const {login,logout} = userSlice.actions;
export default userSlice.reducer;