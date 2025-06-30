import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';

export default function CreateSchedule() {
  const [seasons, setSeasons] = useState([]);
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({
    seasonYear: '',
    matchDate: '',
    homeTeam: '',
    awayTeam: '',
    venue: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const seasonRes = await axios.get('/admin/seasons', {
        headers: { Authorization: localStorage.getItem('token') }
      });
      const teamRes = await axios.get('/data-entry/teams', {
        headers: { Authorization: localStorage.getItem('token') }
      });
      setSeasons(seasonRes.data);
      setTeams(teamRes.data);
    };
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/data-entry/schedules', form, {headers: { Authorization: localStorage.getItem('token') }});
      alert('Match created');
      navigate('/data-entry/schedules');

    } catch (err) {
      console.error(err);
      alert('Error creating match');
    }
  };

  const filteredAwayTeams = teams.filter(t => t._id !== form.homeTeam);

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Add Match</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={form.seasonYear}
          onChange={(e) => handleChange('seasonYear', e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Season</option>
          {seasons.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="datetime-local"
          value={form.matchDate}
          onChange={(e) => handleChange('matchDate', e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <select
          value={form.homeTeam}
          onChange={(e) => {
            handleChange('homeTeam', e.target.value);
            handleChange('awayTeam', ''); // Reset away if home changes
          }}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Home Team</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.teamName}
            </option>
          ))}
        </select>

        <select
          value={form.awayTeam}
          onChange={(e) => handleChange('awayTeam', e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Away Team</option>
          {filteredAwayTeams.map((t) => (
            <option key={t._id} value={t._id}>
              {t.teamName}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={form.venue}
          onChange={(e) => handleChange('venue', e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Venue (optional)"
        />

        <button
          type="submit"
          className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
        >
          Save Match
        </button>
      </form>
    </div>
  );
}
