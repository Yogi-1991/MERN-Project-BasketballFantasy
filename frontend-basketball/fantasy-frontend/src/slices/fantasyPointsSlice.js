
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const getLeaderboardPoints = createAsyncThunk('fantasyPoints/getLeaderboardPoints',async(contestId,{rejectWithValue})=>{
    try{
        const response = await axios.get(`/leaderboard/${contestId}`,{headers:{Authorization:localStorage.getItem('token')}})
        return response.data
    }catch(err){
        console.log(err);
        return rejectWithValue({
            message: err.msg,
            error: err.response?.data?.error || "Unknown error"
        })

    }

})

const fantasyPointsSlice = createSlice({
    name:'fantasyPoints',
    initialState:{
        fantasyPointsData: null,
        loading: false,
        serverError: null
    },
    extraReducers:(builder)=>{
        builder.addCase(getLeaderboardPoints.pending,(state,action)=>{
            state.loading = true;
        });
        builder.addCase(getLeaderboardPoints.fulfilled,(state,action)=>{
            state.loading = false;
            state.fantasyPointsData = action.payload;
        });
        builder.addCase(getLeaderboardPoints.rejected,(state,action)=>{
            state.loading = false;
            state.serverError = action.payload;
        })
    }
})

export default fantasyPointsSlice.reducer;