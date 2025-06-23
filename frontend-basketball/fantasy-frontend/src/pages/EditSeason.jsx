import { useEffect, useState } from 'react';
import axios from '../config/axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditSeason() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    isActive: true,
  });

  useEffect(() => {
    const fetchSeason = async () => {
      const res = await axios.get(`/admin/seasons/${id}`, {headers: { Authorization: localStorage.getItem('token') }});

      const season = res.data;

      setFormData({
        startDate: season.startDate.split('T')[0],
        endDate: season.endDate.split('T')[0],
        isActive: season.isActive,
      });
    }
    fetchSeason();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate start and end dates
  const start = new Date(formData.startDate);
  const end = new Date(formData.endDate);

  if (start >= end) {
    alert('Start date must be before end date');
    return;
  }
  try{
    await axios.put(`admin/season/${id}`,
      {
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
      },
      {
        headers: { Authorization: localStorage.getItem('token') },
      }
    );
}catch(err){
    console.error(err);
      alert('Failed to update league');
}
    navigate('/admin/seasons');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Edit Season</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Start Date</label>
          <input
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">End Date</label>
          <input
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <label className="text-sm text-gray-700">Active</label>
        </div>

        <button
          type="submit"
          className="bg-orange-600 text-white py-2 px-6 rounded hover:bg-orange-700"
        >
          Update Season
        </button>
      </form>
    </div>
  );
}
