import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect,useState } from 'react';
import { useDispatch } from 'react-redux';
import { getUserContests } from '../slices/contestsSlice';
import {myContestTeam} from '../slices/fantasyTeamSlice';
import {getLeaderboardPoints} from '../slices/fantasyPointsSlice';

export default function ContestDetails(){

    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [showMyTeam, setShowMyTeam] = useState(false);
    
    const {contestId} = useParams();
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getUserContests());      

    },[dispatch, contestId])
    

    const { contestsData} = useSelector((state)=>{
        return state.contest;
    })

    const {fantasyTeamData} = useSelector((state)=>{
        return state.fantasyTeam
        })

        if(fantasyTeamData){
            console.log("FantasTema data",fantasyTeamData)
        }

    const {fantasyPointsData, serverError} = useSelector((state)=>{
            return state.fantasyPoints
        })    

        

    if (!contestsData || contestsData.length === 0) {
        return <p>Loading contest data...</p>;
      }

    const contest = contestsData.find((c)=>{       
        return c._id === contestId;
    })    

    if(!contest){
        return <p>Contest not found</p>        
    }    

        const handleViewMyTeam = (gameId) => {
            if (!showMyTeam) {
              dispatch(myContestTeam(gameId));
            }
            setShowMyTeam(!showMyTeam);
            setShowLeaderboard(false);
          };   

    
    const handleViewLeaderboard = (contestId) => {
        if (!showLeaderboard) {
          dispatch(getLeaderboardPoints(contestId));
        }
        setShowLeaderboard(!showLeaderboard);
        setShowMyTeam(false);
      };

    

    return(
        <div className="p-6">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">Contest: {contest.name}</h2>
          <p className="mb-2">Type: {contest.type}</p>
          <p className="mb-2">Entry Fee: ₹{contest.entryFee}</p>
          <p className="mb-2">Prize Pool: ₹{contest.prizePool}</p>
          <p className="mb-2">Participants: {contest.participants.length}</p>
    
          <div className="mt-6 space-x-4">
            <button                 
                    onClick={()=>{
                        handleViewLeaderboard(contest._id)
                        console.log("contest._id",contest._id)
                     }}                 
                 className="bg-orange-600 text-white px-4 py-2 rounded"
            >
                 {showLeaderboard ? "Hide Leaderboard" : "View Leaderboard"}
             </button>

            <button
                 onClick={()=>{
                    if (contest?.gameId?._id) {
                        handleViewMyTeam(contest.gameId._id);
                      } else {
                        console.error("Game ID not available for this contest");
                      }
                    }}
                    className="bg-gray-700 text-white px-4 py-2 rounded"
             >
                {showMyTeam ? "Hide My Team" : "View My Team"}
            </button>

            {showMyTeam && fantasyTeamData?.players?.length > 0 && (
  <div className="mt-6 bg-white p-6 rounded shadow border border-orange-200">
    <h3 className="text-2xl font-bold text-orange-600 mb-4">Your Fantasy Team</h3>
    
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {fantasyTeamData.players.map((p) => {
        const { firstName, lastName, position, credits, teamLogo, jerseyNumber } = p.playerInfo;

        return (
          <div key={p.playerInfo._id} className="bg-gray-50 p-4 rounded-lg shadow-md relative hover:shadow-lg transition-shadow">
            {/* Highlight Captain / Vice Captain */}
            {p.isCaptain && (
              <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow">C</span>
            )}
            {p.isViceCaptain && (
              <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow">VC</span>
            )}

            {/* Player Team Logo (if available) */}
            {teamLogo && (
              <div className="flex justify-center mb-2">
                <img src={teamLogo} alt="Team Logo" className="w-10 h-10 rounded-full border" />
              </div>
            )}

            <div className="text-center">
              <p className="font-semibold text-gray-800">{firstName} {lastName}</p>
              {jerseyNumber && <p className="text-xs text-gray-500">#{jerseyNumber}</p>}
              <p className="text-sm text-gray-600">{position}</p>
              {credits && <p className="text-sm text-green-600 font-medium">Credits: {credits}</p>}
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}


        {showLeaderboard && fantasyPointsData ? (
            <div className="mt-6 bg-white p-4 rounded shadow">
                 <h3 className="text-xl font-semibold text-green-600 mb-2">Leaderboard</h3>
                    <ul>
                     {fantasyPointsData.entries?.map((entry, index) => (
                        <li key={entry.userId._id} className="py-1 flex justify-between">
                          <span>{index + 1}. {entry.userId.name}</span>
                            <span>{entry.totalPoints} pts</span>
                         </li>
                        ))}
                    </ul>
            </div>
        ) : serverError ? (<div className="flex items-center justify-center min-h-screen bg-orange-50">
            <div className="bg-white shadow-md rounded-lg p-8 text-center border border-orange-200">
            <h2 className="text-2xl font-bold text-red-600 mb-4">{serverError.error}</h2>
            </div>
        </div>) : null
        
                 }           

        </div>
        </div>
      );
}