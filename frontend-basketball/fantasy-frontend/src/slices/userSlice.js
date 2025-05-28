
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const fetchUserdetails = createAsyncThunk('user/fetchUserdetails',async(_,{rejectWithValue})=>{
    try{
        const response = await axios.get('/user',{headers:{Authorization:localStorage.getItem('token')}});
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue ({
            msg: err.response?.data?.error || 'Falied to fecth the user details'
        })
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: null,
        isLoggedIn: false,
        serverError:null
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchUserdetails.fulfilled,(state,action)=>{
            state.userData = action.payload;
            state.isLoggedIn = true;
        });
        builder.addCase(fetchUserdetails.rejected,(state,action)=>{
            state.serverError = action.payload
        })
    },
    reducers:{
        login:(state,action)=>{
            state.userData = action.payload;
            state.isLoggedIn = true;
            console.log("login Slice")
        },
        logout:(state)=>{
            state.userData = null;
            state.isLoggedIn = false;
        }
    }
})

export const {login,logout} = userSlice.actions;
export default userSlice.reducer;