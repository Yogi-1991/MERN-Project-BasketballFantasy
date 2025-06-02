// src/components/JoinContestCard.jsx
import { useDispatch, useSelector } from 'react-redux';
import { joinContest } from '../slices/contestsSlice';
import { useState } from 'react';

const JoinContestCard = ({ contest, fantasyTeams }) => {
  const dispatch = useDispatch();
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [invitationCode, setInvitationCode] = useState('');

  const handleJoin = () => {
    if (!selectedTeamId) {
      alert('Please select a fantasy team to join');
      return;
    }

    const joinContestinfo = {
        contestId: contest._id,
        fantasyTeamId: selectedTeamId,
        invitationCode: contest.type === 'private' ? invitationCode : undefined,
      }

    dispatch(joinContest(joinContestinfo));
  };

  return (
    <div className="p-4 border rounded-xl shadow bg-white">
      <h3 className="font-bold">{contest.name}</h3>
      <p>Entry Fee: ₹{contest.entryFee}</p>

      <select
        value={selectedTeamId}
        onChange={(e) => setSelectedTeamId(e.target.value)}
        className="mt-2 p-1 border rounded"
      >
        <option value="">Select Your Fantasy Team</option>
        {fantasyTeams.map((team) => (
          <option key={team._id} value={team._id}>
            {team.teamName}
          </option>
        ))}
      </select>

      {contest.type === 'private' && (
        <input
          type="text"
          placeholder="Invitation Code"
          value={invitationCode}
          onChange={(e) => setInvitationCode(e.target.value)}
          className="mt-2 p-1 border rounded w-full"
        />
      )}

      <button
        onClick={handleJoin}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Join Contest
      </button>
    </div>
  );
};

export default JoinContestCard;
