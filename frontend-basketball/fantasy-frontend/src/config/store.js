import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice";
import scheduleReducer from '../slices/scheduleSlice';
import contestsReducer from '../slices/contestsSlice';
import fantasyReducer from '../slices/fantasyTeamSlice';
import fantasyPointsReducer from '../slices/fantasyPointsSlice';
import playersReducer from '../slices/playersSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        schedule: scheduleReducer,
        contest: contestsReducer,
        fantasyTeam : fantasyReducer,
        fantasyPoints : fantasyPointsReducer,
        players : playersReducer
    }
});

export default store;