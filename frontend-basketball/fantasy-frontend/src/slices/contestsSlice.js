import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const getUserContests = createAsyncThunk('contests/getUSerContests',async(_,rejectWithValue)=>{
    try{
        const response = await axios.get('/contest/joined',{headers:{Authorization:localStorage.getItem('token')}});
        return response.data
    }catch(err){
        return rejectWithValue({
            message: err.message,
            error:err.response?.data?.error || 'Unkown error'
        })

    }
})



export const joinContest = createAsyncThunk('contest/joinContest', async ({joinContestinfo}, { rejectWithValue }) => {
      try {
        const res = await axios.post('/join-contest', {joinContestinfo},{headers:{Authorization:localStorage.getItem('token')}});
        return res.data;
      } catch (err) {
        return rejectWithValue({
            message: err.message,
            error:err.response?.data?.error || 'Unkown error'
        })
      }
    }
  );

const contestsSlice = createSlice({
    name:'contest',
    initialState:{
        contestsData:[],
        newJoinedContest: null,
        loading:false,
        serverError: null
    },
    extraReducers:(builder)=>{
        //get user joind contest
        builder.addCase(getUserContests.pending,(state,action)=>{
            state.loading = true;
            state.serverError = null;
        });
        builder.addCase(getUserContests.fulfilled,(state,action)=>{
            state.loading = false;
            state.contestsData = action.payload;
            state.serverError = null;
        });
        builder.addCase(getUserContests.rejected,(state,action)=>{
            state.loading = false;
            state.serverError = action.payload?.error || "Something went wrong"
        });

        // join the constes
        builder.addCase(joinContest.pending,(state,action)=>{
            state.loading = true;
            state.serverError = null;
        });
        builder.addCase(joinContest.fulfilled,(state,action)=>{
            state.loading = false;
            state.newJoinedContest = action.payload;
            state.serverError = null;
        });
        builder.addCase(joinContest.rejected,(state,action)=>{
            state.loading = false;
            state.serverError = action.payload?.error || "Something went wrong"
        });

    }
})

export default contestsSlice.reducer;