import { useEffect, useState } from 'react';
import axios from '../config/axios';
import { Link } from 'react-router-dom';

export default function ManageSeasons() {
  const [seasons, setSeasons] = useState([]);

  const fetchSeasons = async () => {
    const res = await axios.get('/data-entry/seasons', {headers: { Authorization: localStorage.getItem('token') }});
    setSeasons(res.data);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this season?')) {
      await axios.delete(`/data-entry/seasons/${id}`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      fetchSeasons();
    }
  };

  const toggleStatus = async (id) => {
    await axios.patch(`/data-entry/seasons/${id}/toggle`, null, {
      headers: { Authorization: localStorage.getItem('token') },
    });
    fetchSeasons();
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  return (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-orange-600 mb-4">Manage Seasons</h1>

    <Link
      to="/data-entry/seasons/create"
      className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
    >
      + Create New Season
    </Link>

    <div className="mt-6">
      {seasons.map((season) => (
        <Link
          key={season._id}
          to={`/data-entry/seasons/edit/${season._id}`}
          className="block border p-4 mb-3 rounded shadow-sm bg-white hover:bg-orange-50 transition"
        >
          <h2 className="text-xl font-semibold">{season.name}</h2>
          <p className="text-gray-600">League: {season.leagueId?.name || 'N/A'}</p>
          <p className="text-sm text-gray-500">
            {new Date(season.startDate).toLocaleDateString()} -{' '}
            {new Date(season.endDate).toLocaleDateString()}
          </p>
          <p className={`mt-1 font-medium ${season.isActive ? 'text-green-600' : 'text-red-600'}`}>
            {season.isActive ? 'Active' : 'Inactive'}
          </p>
        </Link>
      ))}
    </div>
  </div>
);
}
