import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

export default function ManageSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const navigate = useNavigate();

  const fetchSchedules = async () => {
    const res = await axios.get('/data-entry/schedules', {
      headers: { Authorization: localStorage.getItem('token') }
    });
    setSchedules(res.data);
  };

  const fetchSeasons = async () => {
    const res = await axios.get('/data-entry/seasons', {
      headers: { Authorization: localStorage.getItem('token') }
    });
    setSeasons(res.data);
  };

  useEffect(() => {
    fetchSchedules();
    fetchSeasons();
  }, []);

  const formatLocalDate = (d) => {
    const date = new Date(d);
    return date.getFullYear() + '-' +
      String(date.getMonth() + 1).padStart(2, '0') + '-' +
      String(date.getDate()).padStart(2, '0');
  };

  const filteredSchedules = schedules.filter((s) => {
    const seasonMatch = selectedSeason ? s.seasonYear._id === selectedSeason : true;
    const dateMatch = selectedDate ? formatLocalDate(s.matchDate) === selectedDate : true;
    return seasonMatch && dateMatch;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-600">Manage Schedule</h2>
        <Link
          to="/data-entry/schedules/create"
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          + Add Match
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="border p-2 rounded w-40"
          >
            <option value="">All Seasons</option>
            {seasons.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Match Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Season</th>
              <th className="py-2 px-4 border">Home</th>
              <th className="py-2 px-4 border">Away</th>
              <th className="py-2 px-4 border">Venue</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.map((match) => (
              <tr key={match._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">
                  {new Date(match.matchDate).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </td>
                <td className="py-2 px-4 border">{match.seasonYear?.name}</td>
                <td className="py-2 px-4 border">{match.homeTeam?.teamName}</td>
                <td className="py-2 px-4 border">{match.awayTeam?.teamName}</td>
                <td className="py-2 px-4 border">{match.venue || '—'}</td>
                <td className="py-2 px-4 border capitalize">{match.status}</td>
                <td className="py-2 px-4 border">
                  <button
                    onClick={() => navigate(`/data-entry/schedules/edit/${match._id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
            {!filteredSchedules.length && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No matches found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
