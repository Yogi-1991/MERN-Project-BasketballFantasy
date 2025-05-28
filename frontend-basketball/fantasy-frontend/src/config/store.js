import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import scheduleReducer from '../slices/scheduleSlice';
import contestsReducer from '../slices/contestsSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        schedule: scheduleReducer,
        contests: contestsReducer
    }
});

export default store;