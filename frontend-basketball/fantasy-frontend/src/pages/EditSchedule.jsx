import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

export default function EditSchedule() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState(null);
  const [form, setForm] = useState({
    matchDate: '',
    homeTeam: '',
    awayTeam: '',
    venue: '',
    kickOffTime: '',
    seasonYear: ''
  });
  const [teams, setTeams] = useState([]);
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
    try {
      const [matchRes, teamRes, seasonRes] = await Promise.all([
        axios.get(`/data-entry/schedules/${matchId}`, {
          headers: { Authorization: localStorage.getItem('token') }
        }),
        axios.get('/data-entry/teams', {
          headers: { Authorization: localStorage.getItem('token') }
        }),
        axios.get('/admin/seasons', {
          headers: { Authorization: localStorage.getItem('token') }
        })
      ]);

      const match = matchRes.data;
      setSchedule(match);
      setForm({
        matchDate: match.matchDate.split('T')[0],
        homeTeam: match.homeTeam._id,
        awayTeam: match.awayTeam._id,
        venue: match.venue || '',
        kickOffTime: new Date(match.matchDate).toISOString().split('T')[1]?.slice(0, 5) || '',
        seasonYear: match.seasonYear._id
      });
      setTeams(teamRes.data);
      setSeasons(seasonRes.data);
    } catch (err) {
      console.error('Error fetching schedule/team/season data:', err);
      alert('Failed to fetch data. Please try again.');
    }
  };

  fetchData();
}, [matchId]);
   

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const matchDate = `${form.matchDate}T${form.kickOffTime || '00:00'}`;

    await axios.put(
      `/data-entry/schedules/${id}`,
      { ...form, matchDate },
      { headers: { Authorization: localStorage.getItem('token') } }
    );

    alert('Schedule updated');
    navigate('/data-entry/schedules');
  };

  if (!schedule) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Edit Schedule</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="seasonYear" value={form.seasonYear} onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Select Season</option>
          {seasons.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>

        <input type="date" name="matchDate" value={form.matchDate} onChange={handleChange} className="w-full border p-2 rounded" required />

        <input type="time" name="kickOffTime" value={form.kickOffTime} onChange={handleChange} className="w-full border p-2 rounded" required />

        <select name="homeTeam" value={form.homeTeam} onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Select Home Team</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>{t.teamName}</option>
          ))}
        </select>

        <select name="awayTeam" value={form.awayTeam} onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Select Away Team</option>
          {teams.map((t) => (
            <option key={t._id} value={t._id}>{t.teamName}</option>
          ))}
        </select>

        <input
          type="text"
          name="venue"
          value={form.venue}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Venue"
        />

        <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">
          Update Schedule
        </button>
      </form>
    </div>
  );
}
