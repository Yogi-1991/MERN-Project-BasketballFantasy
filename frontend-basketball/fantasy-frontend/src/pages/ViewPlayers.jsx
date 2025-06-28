import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';

export default function ViewPlayers() {
  const { teamId, seasonId } = useParams();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate()

  const fetchPlayers = async () => {
    try {
      const res = await axios.get(`/data-entry/players/${teamId}/${seasonId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setPlayers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [teamId, seasonId]);

  const handleDelete = async (playerId) => {
  if (!window.confirm('Are you sure you want to delete this player?')) return;
  try {
    await axios.delete(`/data-entry/players/${playerId}`, {headers: { Authorization: localStorage.getItem('token') }});
    alert('Player deleted!');
    fetchPlayers(); 
  } catch (err) {
    console.error(err);
    alert(err.response.data.error);
  }
};

  if (loading) return <p className="p-4">Loading players...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Team Players</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Profile</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Position</th>
              <th className="border px-4 py-2">Jersey</th>
              <th className="border px-4 py-2">Nationality</th>
              <th className="border px-4 py-2">Credit</th>
              <th className="border px-4 py-2">Actions</th>

            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr key={player._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">
                  {player.profileImage ? (
                    <img src={`/${player.profileImage}`} alt="Profile" className="w-10 h-10 object-contain" />
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="border px-4 py-2">
                  {player.firstName} {player.lastName}
                </td>
                <td className="border px-4 py-2">{player.position}</td>
                <td className="border px-4 py-2">{player.jerseyNumber || '—'}</td>
                <td className="border px-4 py-2">{player.nationality || '—'}</td>
                <td className="border px-4 py-2">{player.credit}</td>
                <td className="border px-4 py-2">
  <div className="flex gap-2">
    <button
      onClick={() => handleDelete(player._id)}
      className="text-red-600 hover:underline text-sm"
    >
      Delete
    </button>

    <button
      onClick={() =>
        navigate(`/data-entry/player/edit/${player._id}`)
      }
      className="text-blue-600 hover:underline text-sm"
    >
      Edit
    </button>
  </div>
</td>
              </tr>
            ))}
            
          </tbody>
        </table>
      </div>
    </div>
  );
}
