
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const myContestTeam = createAsyncThunk('fantasyTeam/myContestTeam', async(gameIdContetst,{rejectWithValue})=>{
    try{
        const response = await axios.get(`/fantasy-teams?gameId=${gameIdContetst}`,{headers:{Authorization: localStorage.getItem('token')}});
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue({
            message: err.message,
            error: err.response?.data?.error || "Unknown error"
        })

    }
})

export const createFantasyTeam = createAsyncThunk('fantasyTeams/createFantasyTeam',async (teamData, { rejectWithValue }) => {
      try {
        const response = await axios.post('/fantasy-teams', teamData, {headers:{Authorization:localStorage.getItem('token')}});
        return response.data;
      } catch (err) {        
        return rejectWithValue({
            message: err.message,
            error: err.response?.data?.error || "Unknown error"
        })

      }
    }
  );

const fantasyTeamSlice = createSlice({
    name:'fantasyTeam',
    initialState: {
        fantasyTeamData:null,
        loading: false,
        serverError: null
    },
    extraReducers:(builder)=>{
        //My team
        builder.addCase(myContestTeam.pending,(state,action)=>{
            state.loading = true;
        });
        builder.addCase(myContestTeam.fulfilled,(state,action)=>{
            state.loading = false;
            state.fantasyTeamData = action.payload;  
            console.log( " state.fantasyData",state.fantasyData)          
        });
        builder.addCase(myContestTeam.rejected,(state,action)=>{
            state.loading = false;
            state.serverError = action.payload
        });
        // create fanstasy team
        builder.addCase(createFantasyTeam.pending,(state,action)=>{
            loading = true;
        });
        builder.addCase(createFantasyTeam.fulfilled,(state,action)=>{
            state.loading = false;
            state.fantasyTeamData = action.payload;
        })
        builder.addCase(createFantasyTeam.rejected,(state,action)=>{
            state.loading = false;
            state.serverError = action.payload
        })

    }
})

export default fantasyTeamSlice.reducer;