import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

export default function EditContest() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    entryFee: '',
    prizePool: '',
    maxPlayers: ''
  });

  const fetchContest = async () => {
    try {
      const res = await axios.get(`/contests/show/${id}`, {headers: { Authorization: localStorage.getItem('token') }});
      const c = res.data;
      setFormData({
        name: c.name || '',
        entryFee: c.entryFee || '',
        prizePool: c.prizePool || '',
        maxPlayers: c.maxPlayers || ''
      });
    } catch (err) {
      console.error(err);
      alert('Failed to fetch contest');
    }
  };

  useEffect(() => {
    fetchContest();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/admin/contest-public/edit/${id}`, formData, {headers: { Authorization: localStorage.getItem('token') } });
      alert('Contest updated!');
      navigate('/admin/contests');
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.error || 'Failed to update contest');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-orange-600">Edit Contest</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Contest Name"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="number"
          name="entryFee"
          value={formData.entryFee}
          onChange={handleChange}
          placeholder="Entry Fee"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="number"
          name="prizePool"
          value={formData.prizePool}
          onChange={handleChange}
          placeholder="Prize Pool"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="number"
          name="maxPlayers"
          value={formData.maxPlayers}
          onChange={handleChange}
          placeholder="Max Players"
          className="border p-2 rounded w-full"
          required
        />
        <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
          Update Contest
        </button>
      </form>
    </div>
  );
}
