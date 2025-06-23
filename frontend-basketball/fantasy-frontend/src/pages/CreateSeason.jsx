import { useState, useEffect } from 'react';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';

export default function CreateSeason() {
  const [leagues, setLeagues] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    leagueId: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
   const fetchleagues =async () => {
      const res = await axios.get('/admin/leagues', {headers: { Authorization: localStorage.getItem('token') }});
      setLeagues(res.data);
    }
    fetchleagues();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate name format
  const yearPattern = /^(\d{4})-(\d{4})$/;
  const match = formData.name.match(yearPattern);

  if (!match) {
    alert('Season name must be in the format 2020-2021');
    return;
  }

  const startYear = parseInt(match[1], 10);
  const endYear = parseInt(match[2], 10);

  if (endYear !== startYear + 1) {
    alert('End year must be exactly one greater than start year');
    return;
  }

  // Validate start and end dates
  const start = new Date(formData.startDate);
  const end = new Date(formData.endDate);

  if (start >= end) {
    alert('Start date must be before end date');
    return;
  }

    try {
      await axios.post('/admin/season', formData, {headers: { Authorization: localStorage.getItem('token') }});
      navigate('/admin/seasons');
    } catch (err) {
        console.log(err)
      alert('Failed to create season');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Create Season</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Season Name(Ex: 2020-2021)"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          
        />

        <label className="block text-sm text-gray-600">Start Date</label>
        <input
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          
        />

        <label className="block text-sm text-gray-600">End Date</label>
        <input
          name="endDate"
          type="date"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          
        />

        <select
          name="leagueId"
          value={formData.leagueId}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select League</option>
          {leagues.map((lg) => (
            <option key={lg._id} value={lg._id}>
              {lg.name}
            </option>
          ))}
        </select>

        <button className="bg-orange-600 text-white py-2 px-6 rounded hover:bg-orange-700">
          Create Season
        </button>
      </form>
    </div>
  );
}
