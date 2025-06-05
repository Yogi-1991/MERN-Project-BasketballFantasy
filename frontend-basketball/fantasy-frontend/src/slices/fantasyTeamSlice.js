
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const myContestTeam = createAsyncThunk('fantasyTeam/myContestTeam', async(gameId,{rejectWithValue})=>{
    try{
        console.log("gameID redux", gameId)
        const response = await axios.get(`/fantasy-team/${gameId}`,{headers:{Authorization: localStorage.getItem('token')}});
        return response.data
    }catch(err){
        console.log(err)
        return rejectWithValue({
            message: err.message,
            error: err.response?.data?.error || "Unknown error"
        })

    }
})

export const createFantasyTeam = createAsyncThunk('fantasyTeam/createFantasyTeam',async (teamData, { rejectWithValue }) => {
      try {
        const response = await axios.post('/fantasy-team', teamData, {headers:{Authorization:localStorage.getItem('token')}});
        return response.data;
      } catch (err) {        
        return rejectWithValue({
            message: err.message,
            error: err.response?.data?.error || "Unknown error"
        })

      }
    }
  );

  export const fetchMyFantasyTeams = createAsyncThunk('fantasyTeam/fetchMyFantasyTeams',async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/fantasy-team-user', {headers:{Authorization:localStorage.getItem('token')}});
      return response.data;
    } catch (err) {    
        console.log(err)    
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
        fantasyTeamByUser: [],
        loading: false,
        serverError: null
    },
    extraReducers:(builder)=>{
        //My team
        builder.addCase(myContestTeam.pending,(state,action)=>{
            state.loading = true;
            state.serverError = null;
        });
        builder.addCase(myContestTeam.fulfilled,(state,action)=>{
            state.loading = false;
            state.fantasyTeamData = action.payload;  
            state.serverError = null;
        });
        builder.addCase(myContestTeam.rejected,(state,action)=>{
            state.loading = false;
            state.serverError = action.payload

        });
        // create fanstasy team
        builder.addCase(createFantasyTeam.pending,(state,action)=>{
            state.loading = true;
            state.serverError = null;
        });
        builder.addCase(createFantasyTeam.fulfilled,(state,action)=>{
            state.loading = false;
            state.fantasyTeamData = action.payload;
            state.serverError = null;
        })
        builder.addCase(createFantasyTeam.rejected,(state,action)=>{
            state.loading = false;
            state.serverError = action.payload
        })
        //fetch my fantasy team
        builder.addCase(fetchMyFantasyTeams.pending,(state,action)=>{
            state.loading = true;
            state.serverError = null;
        });
        builder.addCase(fetchMyFantasyTeams.fulfilled,(state,action)=>{
            state.loading = false;
            state.fantasyTeamByUser = action.payload;
            state.serverError = null;
        })
        builder.addCase(fetchMyFantasyTeams.rejected,(state,action)=>{
            state.loading = false;
            state.serverError = action.payload
        })
    }
})

export default fantasyTeamSlice.reducer;