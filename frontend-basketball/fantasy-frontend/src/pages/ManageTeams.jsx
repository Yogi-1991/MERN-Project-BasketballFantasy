import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

export default function ManageTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTeams = async () => {
    try {
      const res = await axios.get('/data-entry/teams', {headers: { Authorization: localStorage.getItem('token') }});
      setTeams(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-600">Teams</h2>
        <Link
          to="/data-entry/teams/create"
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          + Create Team
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4 border">Logo</th>
                <th className="py-2 px-4 border">Team Name</th>
                <th className="py-2 px-4 border">Home City</th>
                <th className="py-2 px-4 border">League</th>
                <th className="py-2 px-4 border">Seasons</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">
                    {team.logoImage ? (
                      <img src={`/${team.logoImage}`} alt="logo" className="w-10 h-10 object-contain" />
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="py-2 px-4 border">{team.teamName}</td>
                  <td className="py-2 px-4 border">{team.homeCity}</td>
                  <td className="py-2 px-4 border">{team.leagueId?.name}</td>
                  <td className="py-2 px-4 border">
                    <ul className="list-none pl-4">
                      {team.seasons.map((s, i) => (
                        <li key={i}>
                          {s.seasonYear.name}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-2 px-4 border">
                    <button
                      onClick={() => navigate(`/data-entry/teams/edit/${team._id}`)}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}