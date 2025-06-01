import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../config/axios';
export const fetchMatchPlayers = createAsyncThunk('players/fetchMatchPlayers', async(gameId, {rejectWithValue}) => {
    try {
        console.log("matchId", gameId)

      const response = await axios.get(`/fantasy/players/${gameId}`,{headers:{Authorization:localStorage.getItem('token')}});
      console.log("playerAXios", response.data.players)
      return response.data.players;

    } catch (err) {
      return rejectWithValue({
        message : err.msg,
        error: err.response.data.error
      });
    }
  }
);

const playersSlice = createSlice({
  name: 'players',
  initialState: {
    playersData: [],
    loading: false,
    ServerError: null,
  },
  extraReducers: builder => {
    builder.addCase(fetchMatchPlayers.pending, (state) => {
        state.loading = true;
      })
    builder.addCase(fetchMatchPlayers.fulfilled, (state, action) => {
        state.loading = false;
        state.playersData = action.payload;
      })
    builder.addCase(fetchMatchPlayers.rejected, (state, action) => {
        state.loading = false;
        state.ServerError = action.payload;
      });
  }
});

export default playersSlice.reducer;
