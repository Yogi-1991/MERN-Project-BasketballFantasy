import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

export default function EditLeague() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    country: '',
    isActive: true,
  });
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const response = await axios.get(`/admin/league/${id}`,{headers: {Authorization: localStorage.getItem('token')}});
        const league = response.data;
        setFormData({
          name: league.name || '',
          country: league.country || '',
          isActive: league.isActive,
        });
        setLogoPreview(league.logo); // image path for preview
      } catch (err) {
        console.error(err);
        alert('Failed to load league');
      }
    }
    fetchLeagues();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('country', formData.country);
      data.append('isActive', formData.isActive);
      if (logoFile) {
        data.append('logo', logoFile);
      }

      await axios.put(`/admin/league/${id}`, data, {headers: {Authorization: localStorage.getItem('token')}});
      navigate('/admin/leagues');
    } catch (err) {
      console.error(err);
      alert('Failed to update league');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-orange-600">Edit League</h2>

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="League Name"
          className="w-full border p-2 rounded"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="country"
          placeholder="Country"
          className="w-full border p-2 rounded"
          value={formData.country}
          onChange={handleChange}
        />

        <div>
          <label className="block mb-1 text-gray-700 font-medium">Update Logo (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Current Logo"
              className="w-24 h-24 object-cover mt-2 border rounded"
            />
          )}
        </div>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <span>Active</span>
        </label>

        <button className="bg-orange-600 text-white py-2 px-6 rounded hover:bg-orange-700">
          Update League
        </button>
      </form>
    </div>
  );
}
