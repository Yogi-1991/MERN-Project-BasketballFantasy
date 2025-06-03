import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getContestsByGame, joinContest } from '../slices/contestsSlice';
import { myContestTeam } from '../slices/fantasyTeamSlice';
import { useParams, useNavigate } from 'react-router-dom';

export default function MatchContests() {
  const { gameId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { contestsData, loading, serverError } = useSelector((state) => state.contest);
  const { fantasyTeamData } = useSelector((state) => state.fantasyTeam);

  useEffect(() => {
    dispatch(getContestsByGame(gameId));
    dispatch(myContestTeam(gameId));
  }, [dispatch, gameId]);

  const handleJoin = (contest) => {
    if (!fantasyTeamData) {
      navigate(`/select-team/${gameId}`);
      return;
    }
console.log("fantasyTeamData--",fantasyTeamData)
    let invitationCode = null;
    if (contest.type === 'private') {
      invitationCode = prompt('Enter invitation code:');
      if (!invitationCode) return;
    }

    const joinContestinfo = {
        // contestId: contest._id,
        fantasyTeamId: fantasyTeamData._id,
        invitationCode
      }
    dispatch(joinContest({contestId :contest._id ,joinContestinfo}));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Contests for this Match</h2>

      {loading && <p className="text-blue-600">Joining contest...</p>}
      {serverError && <p className="text-red-600">{serverError.error}</p>}

      {contestsData.map((contest) => (
        <div key={contest._id} className="bg-white p-4 rounded shadow mb-4">
          <p><strong>Type:</strong> {contest.type}</p>
          <p><strong>Entry Fee:</strong> {contest.entryFee}</p>
          <p><strong>Prize Pool:</strong> {contest.prizePool}</p>

          <button
            onClick={() => handleJoin(contest)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {fantasyTeamData ? 'Join Contest' : 'Create Team to Join'}
          </button>
        </div>
      ))}
    </div>
  );
}
