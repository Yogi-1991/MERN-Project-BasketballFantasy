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



export const joinContest = createAsyncThunk('contest/joinContest', async ({contestId,joinContestinfo }, { rejectWithValue }) => {
      try {
        const response = await axios.put(`/join-contest/${contestId}`, {...joinContestinfo},{headers:{Authorization:localStorage.getItem('token')}});
        console.log("redux data join contets", response.data)
        return response.data;
      } catch (err) {
        return rejectWithValue({
            message: err.message,
            error:err.response?.data?.error || 'Unkown error'
        })
      }
    }
  );

  export const getContestsByGame = createAsyncThunk('contest/getContestsByGame',async(gameId,{rejectWithValue})=>{
        try{
            const resposne = await axios.get(`/contest/${gameId}`, {headers:{Authorization:localStorage.getItem('token')}});
            console.log("contest list for the game", resposne.data)
            return resposne.data
        }catch(err){
            console.log(err);
            return rejectWithValue({
                message : err.msg,
                error: err.response?.data?.error || "Unknown error"
            })

        }
  })

const contestsSlice = createSlice({
    name:'contest',
    initialState:{
        contestsData:[],
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
            const updated = action.payload;
            const index = state.contestsData.findIndex(c => c._id === updated._id);
            if (index !== -1) {
                state.constestByGame[index] = updated;
            } else {
            state.constestByGame.push(updated); 
            state.serverError = null;
            }
        });
        builder.addCase(joinContest.rejected,(state,action)=>{
            state.loading = false;
            state.serverError = action.payload?.error || "Something went wrong"
        });

        //get contest by game ID
        builder.addCase(getContestsByGame.pending, (state) => {
            state.loading = true;
            state.serverError = null;
        });
        builder.addCase(getContestsByGame.fulfilled, (state, action) => {
            state.loading = false;
            state.contestsData = action.payload;
            state.serverError = null;
        });
        builder.addCase(getContestsByGame.rejected, (state, action) => {
            state.loading = false;
            state.serverError = action.payload
        });

    }
})

export default contestsSlice.reducer;