
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from '../config/axios';


export const scheduleUpcoming = createAsyncThunk('schedule/scheduleUpcoming',async(_,{rejectWithValue})=>{
    try{
        const response = await axios.get('/schedule/upcoming',{headers:{Authorization: localStorage.getItem('token')}});
            console.log(response)
            return response.data
    }catch(err){
        console.log(err);
        return rejectWithValue({
            message: err.message,
            error: err.response?.data?.error || 'Unknown error'
        })

    }
})

const scheduleSlice = createSlice({
    name:'schedule',
    initialState:{
        scheduleData:[],
        loading: false,
        serverError: null
    },
    extraReducers:(builder)=>{
        builder.addCase(scheduleUpcoming.pending,(state)=>{
            state.loading = true;
        });
        builder.addCase(scheduleUpcoming.fulfilled,(state,action)=>{
            state.loading = false;
            state.scheduleData = action.payload;
        });
        builder.addCase(scheduleUpcoming.rejected,(state,action)=>{
            state.loading = false;
            state.serverError = action.payload;
            
        });
    }
})

export default scheduleSlice.reducer;