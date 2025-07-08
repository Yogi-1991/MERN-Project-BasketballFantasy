import { useEffect, useState } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

 

export default function CreateContestPage() {

const userRole = useSelector((state) => state.user.userData?.role);

  const [games, setGames] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    gameId: '',
    entryFee: 0,
    prizePool: 0,
    maxPlayers: 2,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get('/data-entry/schedules', {
          headers: { Authorization: localStorage.getItem('token') },
        });

        // Filter upcoming games based on local time
        const now = new Date();
        const upcomingMatches = res.data.filter((match) => {
          const matchDate = new Date(match.matchDate);
          return matchDate > now;
        });

        setGames(upcomingMatches);
      } catch (err) {
        console.error(err);
        alert('Failed to load match list');
      }
    };

    fetchGames();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url =
      userRole === 'admin'
        ? '/admin/contests/create-public'
        : '/user/contests/create-private';

    try {
      const res = await axios.post(url, formData, {
        headers: { Authorization: localStorage.getItem('token') },
      });

      alert(`Contest created successfully!`);
      navigate('/contests');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to create contest');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">
        {userRole === 'admin' ? 'Create Public Contest' : 'Create Private Contest'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold">Match</label>
          <select
            name="gameId"
            value={formData.gameId}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select Upcoming Match</option>
            {games.map((g) => (
              <option key={g._id} value={g._id}>
                {g.homeTeam?.teamName} vs {g.awayTeam?.teamName} —{' '}
                {new Date(g.matchDate).toLocaleString()}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold">Contest Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold">Entry Fee</label>
            <input
              type="number"
              name="entryFee"
              value={formData.entryFee}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              min={0}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Prize Pool</label>
            <input
              type="number"
              name="prizePool"
              value={formData.prizePool}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              min={0}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold">Max Players</label>
          <input
            type="number"
            name="maxPlayers"
            value={formData.maxPlayers}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            min={2}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
        >
          Create Contest
        </button>
      </form>
    </div>
  );
}
