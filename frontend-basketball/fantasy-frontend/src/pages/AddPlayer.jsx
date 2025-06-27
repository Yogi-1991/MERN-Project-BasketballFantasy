import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

export default function AddPlayer() {
  const { teamId, seasonId } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState({
    firstName: '',
    lastName: '',
    position: '',
    jerseyNumber: '',
    height: '',
    weight: '',
    nationality: '',
    birthdate: '',
    credit: '',
  });
  const [profileImage, setProfileImage] = useState(null);

  const handleChange = (field, value) => {
    setPlayer((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(player).forEach(([key, val]) => form.append(key, val));
    form.append('teamId', teamId);
    form.append('seasonYear', seasonId);
    if (profileImage) form.append('profileImage', profileImage);
    try{
    await axios.post('/data-entry/players', form, {headers: {Authorization: localStorage.getItem('token')}});
    alert('Player added!');
    navigate(-1);
    }catch(err){
        console.log(err)
        alert(err.response.data.error)
    }
    
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Player</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="First Name"
          value={player.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={player.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <select
          value={player.position}
          onChange={(e) => handleChange('position', e.target.value)}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Position</option>
          <option>PG</option>
          <option>SG</option>
          <option>SF</option>
          <option>PF</option>
          <option>C</option>
          <option>Guard</option>
          <option>Forward</option>
        </select>
        <input
          type="number"
          placeholder="Jersey Number"
          value={player.jerseyNumber}
          onChange={(e) => handleChange('jerseyNumber', e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Height"
          value={player.height}
          onChange={(e) => handleChange('height', e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Weight"
          value={player.weight}
          onChange={(e) => handleChange('weight', e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Nationality"
          value={player.nationality}
          onChange={(e) => handleChange('nationality', e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="date"
          value={player.birthdate}
          onChange={(e) => handleChange('birthdate', e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Credit"
          value={player.credit}
          onChange={(e) => handleChange('credit', e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfileImage(e.target.files[0])}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
        >
          Add Player
        </button>
      </form>
    </div>
  );
}
