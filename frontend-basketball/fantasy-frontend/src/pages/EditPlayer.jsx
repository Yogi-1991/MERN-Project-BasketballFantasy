import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

export default function EditPlayer() {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    position: '',
    jerseyNumber: '',
    height: '',
    weight: '',
    nationality: '',
    birthdate: '',
    credit: '',
    isActive: true,
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchPlayer = async () => {
      const res = await axios.get(`/data-entry/players/${playerId}`, {
        headers: { Authorization: localStorage.getItem('token') },
      });
      const player = res.data;
      setForm({
        firstName: player.firstName,
        lastName: player.lastName,
        position: player.position,
        jerseyNumber: player.jerseyNumber || '',
        height: player.height || '',
        weight: player.weight || '',
        nationality: player.nationality || '',
        birthdate: player.birthdate?.slice(0, 10) || '',
        credit: player.credit,
        isActive: player.isActive,
      });
      setImagePreview(player.profileImage ? `/${player.profileImage}` : '');
    };
    fetchPlayer();
  }, [playerId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    for (const key in form) {
      payload.append(key, form[key]);
    }

    if (profileImage) {
      payload.append('profileImage', profileImage);
    }

    try {
      await axios.put(`/data-entry/player/${playerId}`, payload, {
        headers: {
          Authorization: localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Player updated successfully!');
      navigate(-1); // go back- it other way of using navigate
    } catch (err) {
      console.error(err);
      alert('Failed to update player');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-2xl font-bold text-orange-600 mb-4">Edit Player</h2>

      <form onSubmit={handleSubmit} className="space-y-3" encType="multipart/form-data">
        <input name="firstName" value={form.firstName} onChange={handleChange} required className="w-full border p-2 rounded" placeholder="First Name" />
        <input name="lastName" value={form.lastName} onChange={handleChange} required className="w-full border p-2 rounded" placeholder="Last Name" />

        <select name="position" value={form.position} onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">Select Position</option>
          {['PG','SG','SF','PF','C','G','F','point guard','shooting guard','small forward','power forward','center','guard','forward'].map(pos => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>

        <input name="jerseyNumber" type="number" value={form.jerseyNumber} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Jersey Number" />
        <input name="height" value={form.height} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Height" />
        <input name="weight" value={form.weight} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Weight" />
        <input name="nationality" value={form.nationality} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Nationality" />
        <input name="birthdate" type="date" value={form.birthdate} onChange={handleChange} className="w-full border p-2 rounded" />
        <input name="credit" type="number" value={form.credit} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Credit Value" />

        <label className="flex items-center gap-2">
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
          Active
        </label>

        <div>
          {imagePreview && (
            <img src={imagePreview} alt="Player" className="w-20 h-20 object-contain mb-2 rounded" />
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border p-2 rounded" />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Update</button>
      </form>
    </div>
  );
}
