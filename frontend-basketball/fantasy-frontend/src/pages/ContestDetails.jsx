import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getUserContests } from '../slices/contestsSlice';

export default function ContestDetails(){
    const {contestId} = useParams();
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getUserContests());
    },[dispatch])

    const { contestsData} = useSelector((state)=>{
        return state.contest;
    })

    const contest = contestsData.find((c)=>{
        return c._id === contestId;
    })

    if(!contest){
        return <p>Contest not found</p>
    }

    return(
        <div className="p-6">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">Contest: {contest.name}</h2>
          <p className="mb-2">Type: {contest.type}</p>
          <p className="mb-2">Entry Fee: ₹{contest.entryFee}</p>
          <p className="mb-2">Prize Pool: ₹{contest.prizePool}</p>
          <p className="mb-2">Participants: {contest.participants.length}</p>
    
          <div className="mt-6 space-x-4">
            <button className="bg-orange-600 text-white px-4 py-2 rounded">View Leaderboard</button>
            <button className="bg-gray-700 text-white px-4 py-2 rounded">View My Team</button>
          </div>
        </div>
      );
}