import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMatchPlayers } from '../slices/playersSlice';
import {createFantasyTeam} from '../slices/fantasyTeamSlice';

const MAX_PLAYERS = 8;
const MAX_CREDIT = 100;

export default function SelectPlayers() {
  const { gameId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { playersData, loading, ServerError } = useSelector(state => state.players);
  const {fantasyTeamData} = useSelector(state =>  state.fantasyTeam);

  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [captainId, setCaptainId] = useState('');
  const [viceCaptainId, setViceCaptainId] = useState('');
  const [totalCredit, setTotalCredit] = useState(0);
  const [teamName, setTeamName] = useState('');


  useEffect(() => {
    if (gameId) dispatch(fetchMatchPlayers(gameId));
  }, [dispatch, gameId]);

  const handleSelect = (player) => {
    const isAlreadySelected = selectedPlayers.some(p => p._id === player._id);

    if (isAlreadySelected) {
      setSelectedPlayers(prev => prev.filter(p => p._id !== player._id));
      setTotalCredit(prev => prev - player.credit);
      if (captainId === player._id) setCaptainId('');
      if (viceCaptainId === player._id) setViceCaptainId('');
    } else {
      if (selectedPlayers.length >= MAX_PLAYERS) return alert(`You can only select ${MAX_PLAYERS} players.`);
      if (totalCredit + player.credit > MAX_CREDIT) return alert(`Credit limit exceeded!`);

      setSelectedPlayers(prev => [...prev, player]);
      setTotalCredit(prev => prev + player.credit);
    }
  };

  const handleSubmit = () => {
    if (selectedPlayers.length !== MAX_PLAYERS) 
      {
        return alert(`Select exactly ${MAX_PLAYERS} players.`);
      }
    if (!captainId || !viceCaptainId) 
      {
        return alert(`Assign captain and vice-captain.`);
      }
    if (captainId === viceCaptainId)
      {
         return alert(`Captain and Vice-captain cannot be the same.`);
      }
    if (!teamName.trim()) 
      {
      return alert("Please enter a team name.");
    }

    // const fantasyTeam = {
    //   gameId,
    //   players: selectedPlayers.map(p => p._id),
    //   captain: captainId,
    //   viceCaptain: viceCaptainId
    // };

    const players = selectedPlayers.map(playerId => ({
      playerId,
      isCaptain: playerId === captainId,
      isViceCaptain: playerId === viceCaptainId
    }));

    // TODO: Dispatch action or call API to save fantasyTeam
    dispatch(createFantasyTeam({gameId,teamName, players }))
    console.log("new fanstay team",fantasyTeamData)
    navigate('/contest')
    // console.log("Submitting fantasy team:", fantasyTeam);
  };

  if (loading) return <p>Loading players...</p>;
  if (ServerError) return <p className="text-red-500">{ServerError.error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Select Your Fantasy Team</h2>
      <div className="mb-4">
        <p><strong>Selected:</strong> {selectedPlayers.length}/{MAX_PLAYERS}</p>
        <p><strong>Credits Used:</strong> {totalCredit}/{MAX_CREDIT}</p>
      </div>

      <div className="mb-6 text-center">
  <input
    type="text"
    value={teamName}
    onChange={(e) => setTeamName(e.target.value)}
    placeholder="Enter your fantasy team name"
    className="border rounded px-4 py-2 w-full max-w-md mx-auto shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
</div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {playersData.map(player => {
          const isSelected = selectedPlayers.some(p => p._id === player._id);
          return (
            <div
              key={player._id}
              className={`cursor-pointer border rounded p-3 ${isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
              onClick={() => handleSelect(player)}
            >
              <img
                src={player.profileImage || '/placeholder.png'}
                alt={`${player.firstName} ${player.lastName}`}
                className="w-full h-28 object-cover rounded"
              />
              <div className="mt-2 text-center space-y-1">
                <p className="font-bold">{player.firstName} {player.lastName}</p>
                <p className="text-sm text-gray-500">{player.position}</p>
                <p className="text-sm text-gray-700">Credit: {player.credit}</p>
                <p className="text-sm text-gray-600">Team: {player.teamId?.teamName}</p>
              </div>
              {isSelected && (
                <div className="mt-2 space-x-2 flex justify-center">
                  <label>
                    <input
                      type="radio"
                      name="captain"
                      checked={captainId === player._id}
                      onChange={() => setCaptainId(player._id)}
                    /> C
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="viceCaptain"
                      checked={viceCaptainId === player._id}
                      onChange={() => setViceCaptainId(player._id)}
                    /> VC
                  </label>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit Fantasy Team
        </button>
      </div>
    </div>
  );
}
