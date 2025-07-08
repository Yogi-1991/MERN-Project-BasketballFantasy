import { useState, useEffect } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';

export default function ManageLineupsStats() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchMatches = async () => {
    try {
      const res = await axios.get('/data-entry/schedule/live-coverage', {
        headers: { Authorization: localStorage.getItem('token') },
      });
      setMatches(res.data.filter(m => ['final'].includes(m.status)));
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert('Failed to load matches.');
      setLoading(false);
    }
  };

  fetchMatches();
}, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Completed Matches</h2>
      {loading ? (
        <p>Loading...</p>
      ) : matches.length === 0 ? (
        <p>No live matches available.</p>
      ) : (
        <ul className="space-y-2">
          {matches.map(m => (
            <li
              key={m._id}
              className="border rounded p-4 flex justify-between items-center hover:bg-gray-50"
            >
              <div>
                <strong>{new Date(m.matchDate).toLocaleString()}</strong> :{' '}
                {m.homeTeam?.teamName} vs {m.awayTeam?.teamName}
              </div>
              <button
                onClick={() => navigate(`/data-entry/live-coverage/${m._id}`)}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                Add Game Stats
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
