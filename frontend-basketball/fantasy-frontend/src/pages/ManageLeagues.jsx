import { useEffect, useState } from 'react';
import axios from '../config/axios';
import { Link } from 'react-router-dom';

export default function ManageLeagues() {
  const [leagues, setLeagues] = useState([]);

  const fetchLeagues = async () => {
    try {
      const res = await axios.get('/data-entry/leagues', {headers: { Authorization: localStorage.getItem('token') }});
      setLeagues(res.data);
      console.log("check bolean",res.data)
    } catch (err) {
      console.error(err);
      alert('Failed to fetch leagues');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try{
    const res = await axios.put(`/data-entry/league/status/${id}`, {isActive: !currentStatus},{headers: { Authorization: localStorage.getItem('token') }});
    console.log("toggle",res.data)
    }catch(err){
        console.log(err)
    }
    fetchLeagues();

  };


  useEffect(() => {
    fetchLeagues();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-600">Manage Leagues</h2>
        <Link
          to="/data-entry/leagues/create"
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          + Add League
        </Link>
      </div>

      {leagues.length === 0 ? (
        <p>No leagues found.</p>
      ) : (
        <table className="w-full table-auto border border-collapse">
  <thead className="bg-orange-100">
    <tr>
      <th className="border px-4 py-2">Logo</th>
      <th className="border px-4 py-2">Name</th>
      <th className="border px-4 py-2">Country</th>
      <th className="border px-4 py-2">Status</th>
      <th className="border px-4 py-2">Actions</th>
    </tr>
  </thead>
  <tbody>
    {leagues.map((league) => (
      <tr key={league._id} className="text-sm">
        <td className="border px-4 py-2">
          {league.logo ? (
            <img
              src={`http://localhost:3040${league.logo}`}
              alt="logo"
              className="h-8 w-8 object-contain"
            />
          ) : (
            <span className="text-gray-400 italic">N/A</span>
          )}
        </td>
        <td className="border px-4 py-2 font-medium">{league.name}</td>
        <td className="border px-4 py-2">{league.country || '-'}</td>
        <td className="border px-4 py-2">
          <button
            onClick={() => {
              const confirm = window.confirm(
                'Are you sure you want to change the status?'
              );
              if (confirm) {
                toggleStatus(league._id, league.isActive);
              }
            }}
            className={`px-3 py-1 rounded text-xs font-semibold ${
              league.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {league.isActive ? '✅ Enabled' : '❌ Disabled'}
          </button>
        </td>
        <td className="border px-4 py-2 space-x-3">
          <Link
            to={`/data-entry/leagues/edit/${league._id}`}
            className="text-blue-600 hover:underline"
          >
            Edit
          </Link>
        </td>
      </tr>
    ))}
  </tbody>
</table>
      )}
    </div>
  );
}
