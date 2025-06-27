// import { useState, useEffect } from 'react';
// import axios from '../config/axios';
// import { useParams, useNavigate } from 'react-router-dom';

// export default function EditTeam() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [teamData, setTeamData] = useState(null);
//   const [logoPreview, setLogoPreview] = useState('');
//   const [seasons, setSeasons] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const teamRes = await axios.get(`/data-entry/teams/${id}`, {headers: { Authorization: localStorage.getItem('token') }});
//       setTeamData(teamRes.data);
//       setLogoPreview(teamRes.data.logoImage);
//       console.log("teamRes",teamRes)

//       const seasonRes = await axios.get('/admin/seasons', {
//         headers: { Authorization: localStorage.getItem('token') },
//       });
//       console.log("seasonRes",seasonRes)
//       setSeasons(seasonRes.data);
//     };

//     fetchData();
//   }, [id]);

//   const handleChange = (field, value) => {
//     setTeamData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleCoachChange = (value) => {
//     const updated = [...teamData.seasons];
//     updated[0].coachName = value;
//     setTeamData((prev) => ({ ...prev, seasons: updated }));
//   };

//   const handleLogoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setTeamData((prev) => ({ ...prev, logoImage: file }));
//       setLogoPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const form = new FormData();
//     form.append('teamName', teamData.teamName);
//     form.append('homeCity', teamData.homeCity);
//     if (teamData.logoImage instanceof File) {
//       form.append('logoImage', teamData.logoImage);
//     }
//     form.append('coachName', teamData.seasons[0].coachName); // only updating current season coach

//     await axios.put(`/data-entry/teams/${id}`, form, {
//       headers: {
//         Authorization: localStorage.getItem('token'),
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     navigate('/data-entry/teams');
//   };

//   if (!teamData) return <p className="p-6">Loading team info...</p>;

//   return (
//     <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
//       <h2 className="text-2xl font-bold text-orange-600 mb-4">Edit Team</h2>

//       <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
//         <input
//           type="text"
//           value={teamData.teamName}
//           onChange={(e) => handleChange('teamName', e.target.value)}
//           className="w-full border p-2 rounded"
//           placeholder="Team Name"
//           required
//         />

//         <input
//           type="text"
//           value={teamData.homeCity}
//           onChange={(e) => handleChange('homeCity', e.target.value)}
//           className="w-full border p-2 rounded"
//           placeholder="Home City"
//           required
//         />

//         <div>
//           {logoPreview && (
//             <img src={logoPreview} alt="Team Logo" className="h-20 object-contain mb-2" />
//           )}
//           <input
//             type="file"
//             onChange={handleLogoChange}
//             accept="image/*"
//             className="w-full"
//           />
//         </div>

//         {teamData.seasons?.[0] && (
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Coach Name (Latest Season)</label>
//             <input
//               type="text"
//               value={teamData.seasons[0].coachName}
//               onChange={(e) => handleCoachChange(e.target.value)}
//               className="w-full border p-2 rounded"
//               required
//             />
//             <p className="text-sm text-gray-500 mt-1">
//                 Season: <strong>{teamData.seasons[0]?.seasonYear?.name || 'Unknown'}</strong>
//             </p>
//           </div>
//         )}

//         <button
//           type="submit"
//           className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
//         >
//           Update Team
//         </button>
//       </form>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

export default function EditTeam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [logoImage, setLogoImage] = useState(null);
  const [previewLogo, setPreviewLogo] = useState('');
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [coachName, setCoachName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTeam = async () => {
    const res = await axios.get(`/data-entry/teams/${id}`, {
      headers: { Authorization: localStorage.getItem('token') },
    });
    setTeam(res.data);
    setTeamName(res.data.teamName);
    setHomeCity(res.data.homeCity);
    setPreviewLogo(res.data.logoImage);
    setLoading(false);
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  useEffect(() => {
    if (team && selectedSeasonId) {
      const seasonObj = team.seasons.find(
        (s) => s.seasonYear._id === selectedSeasonId
      );
      setCoachName(seasonObj?.coachName || '');
    }
  }, [selectedSeasonId, team]);

  

  const handleSubmit = async (e) => {
  e.preventDefault();
  const form = new FormData();

  form.append('teamName', teamName);
  form.append('homeCity', homeCity);
  if (logoImage) {
    form.append('logoImage', logoImage);
  }

  // Include selected season & coach name for update
  if (selectedSeasonId) {
    form.append('seasonId', selectedSeasonId);
    form.append('coachName', coachName);
  }

  try {
    await axios.put(`/data-entry/teams/${id}`, form, {
      headers: {
        Authorization: localStorage.getItem('token'),
        'Content-Type': 'multipart/form-data',
      },
    });

    alert('Team and coach info updated!');
    fetchTeam(); // reload updated info
    navigate('/data-entry/teams')
  } catch (err) {
    console.error(err);
    alert('Failed to update team');
  }
};


  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold text-orange-600">Edit Team</h2>

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Team Name"
          required
        />

        <input
          type="text"
          value={homeCity}
          onChange={(e) => setHomeCity(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Home City"
          required
        />

        <div>
          {previewLogo && (
            <img
              src={`/${previewLogo}`}
              alt="Team Logo"
              className="w-20 h-20 object-contain mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoImage(e.target.files[0])}
            className="w-full border p-2 rounded"
          />
        </div>

        <select
           value={selectedSeasonId}
            onChange={(e) => setSelectedSeasonId(e.target.value)}
            className="w-full border p-2 rounded"
          required
           >
    <option value="">Select Season</option>
        {team.seasons.map((s) => (
          <option key={s.seasonYear._id} value={s.seasonYear._id}>
        {s.seasonYear.name}
      </option>
    ))}
  </select>

  <input
    type="text"
    value={coachName}
    onChange={(e) => setCoachName(e.target.value)}
    className="w-full border p-2 rounded"
    placeholder="Coach Name"
    required
  />

  <button
    type="submit"
    className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700"
  >
    Update Team & Coach
  </button>
      </form>      
    </div>
  );
}
