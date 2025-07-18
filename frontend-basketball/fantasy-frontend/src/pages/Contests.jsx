
import { useEffect, useState } from 'react';
import axios from '../config/axios';

import { useDispatch,useSelector } from 'react-redux';
import JoinContestCard from '../components/JoinContestCard';
import {myContestTeam} from '../slices/fantasyTeamSlice';

export default function  Contests(){

    const dispatch = useDispatch();
    const [contests, setContests] = useState([]);
    const [selectedContest, setSelectedContest] = useState(null);
  
    const { fantasyTeamData, loading } = useSelector((state) => state.fantasyTeam); // adjust path as needed
  
    // Fetch contests on mount
    useEffect(() => {
      const fetchContests = async () => {
        try {
          const res = await axios.get('/contests/', {
            headers: { Authorization: localStorage.getItem('token') },
          });
          setContests(res.data);
        } catch (err) {
          console.error('Failed to load contests', err);
        }
      };
      fetchContests();
    }, []);
  
    // Handle contest selection
    const handleSelectContest = (contest) => {
      setSelectedContest(contest);
      console.log(contes)
      dispatch(myContestTeam(contest.gameId));
    };
  
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Available Contests</h2>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contests.map((contest) => (
            <div
              key={contest._id}
              className="border p-4 rounded shadow cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectContest(contest)}
            >
              <h3 className="text-lg font-semibold">{contest.name}</h3>
              <p>Entry Fee: ₹{contest.entryFee}</p>
              <p>Type: {contest.type}</p>
            </div>
          ))}
        </div>
  
        {selectedContest && (
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-2">Join Contest: {selectedContest.name}</h2>
  
            {loading === false ? (
              <p>Loading your teams...</p>
            ) : fantasyTeamData.length > 0 ? (
              <JoinContestCard contest={selectedContest} fantasyTeams={fantasyTeamData} />
            ) : (
              <p className="text-sm text-gray-500">No fantasy teams found for this match.</p>
            )}
          </div>
        )}
      </div>
    );
  };