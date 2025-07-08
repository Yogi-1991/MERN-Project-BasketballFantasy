import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

export default function ManageContests() {
  const [contests, setContests] = useState([]);
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const res = await axios.get('/admin/contests', {headers: { Authorization: localStorage.getItem('token') }});
      setContests(res.data);
    } catch (err) {
      console.error('Failed to fetch contests', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contest?')) {
      try {
        await axios.delete(`/admin/contests/${id}`, {headers: { Authorization: localStorage.getItem('token') }});
        alert('Contest deleted');
        fetchContests();
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-600">Manage Contests</h2>
        <Link
          to="/admin/contests/create"
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          + Create Public Contest
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="py-2 px-4 border">Match</th>
              <th className="py-2 px-4 border">Type</th>
              <th className="py-2 px-4 border">Entry Fee</th>
              <th className="py-2 px-4 border">Prize Pool</th>
              <th className="py-2 px-4 border">Spots</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contests.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">
                  {c.matchId?.homeTeam?.teamName} vs {c.matchId?.awayTeam?.teamName}<br />
                  {new Date(c.matchId?.matchDate).toLocaleString()}
                </td>
                <td className="py-2 px-4 border capitalize">{c.type}</td>
                <td className="py-2 px-4 border">{c.entryFee} pts</td>
                <td className="py-2 px-4 border">{c.prizePool} pts</td>
                <td className="py-2 px-4 border">{c.participants.length}/{c.totalSpots}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => navigate(`/admin/contests/edit/${c._id}`)}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!contests.length && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No contests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
